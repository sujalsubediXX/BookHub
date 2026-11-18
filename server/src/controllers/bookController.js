import Book from '../models/Book.js';
import Rental from '../models/Rental.js';
import Review from '../models/Review.js';
import Genre from '../models/Genre.js';
import mongoose from 'mongoose';
import { ApiError, asyncHandler, escapeRegex, paginate, pageOf, rules } from '../utils/helpers.js';
import { removeFile } from '../middleware/upload.js';

const SORTS = { newest: '-createdAt', rating: '-avgRating -reviewCount', priceAsc: 'pricePerDay', priceDesc: '-pricePerDay', title: 'title', author: 'author' };
const TEXT = ['title', 'author', 'isbn', 'publisher', 'language', 'description', 'shelf'];
const NUM = ['totalCopies', 'pricePerDay', 'lowStockThreshold'];
const OPEN = ['requested', 'approved', 'ready', 'active'];

// public catalogue with filters
export const listBooks = asyncHandler(async (req, res) => {
  const { q, genre, language, minRating, minPrice, maxPrice, available, sort = 'newest' } = req.query;
  const p = paginate(req.query, 12);
  const filter = {};
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ title: rx }, { author: rx }, { isbn: rx }, { publisher: rx }];
  }
  if (genre) {
    let genreId = genre;
    if (!mongoose.isValidObjectId(genre)) {
      const matchingGenre = await Genre.findOne({ name: new RegExp(`^${escapeRegex(genre)}$`, 'i') }).select('_id').lean();
      genreId = matchingGenre?._id?.toString();
    }
    filter.$expr = { $in: [genreId || null, { $map: { input: '$genre', as: 'genreId', in: { $toString: '$$genreId' } } }] };
  }
  if (language) filter.language = language;
  if (minRating) filter.avgRating = { $gte: Number(minRating) };
  if (minPrice || maxPrice) {
    filter.pricePerDay = {};
    if (minPrice) filter.pricePerDay.$gte = Number(minPrice);
    if (maxPrice) filter.pricePerDay.$lte = Number(maxPrice);
  }
  if (available === 'true') filter.availableCopies = { $gt: 0 };

  const total = await Book.countDocuments(filter);
  const randomSkip = sort === 'random'
    ? Math.floor(Math.random() * Math.max(total - p.limit + 1, 1))
    : p.skip;
  const data = await Book.find(filter)
    .sort(SORTS[sort] || SORTS.newest)
    .skip(randomSkip)
    .limit(p.limit)
    .populate('genre', 'name');
  res.json(pageOf(data, total, p));
});

export const facets = asyncHandler(async (req, res) => {
  const [languages, price, titles] = await Promise.all([
    Book.distinct('language'),
    Book.aggregate([{ $group: { _id: null, min: { $min: '$pricePerDay' }, max: { $max: '$pricePerDay' } } }]),
    Book.countDocuments(),
  ]);
  res.json({ languages: languages.sort(), price: { min: price[0]?.min || 0, max: price[0]?.max || 0 }, titles, rules: rules() });
});

export const getBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id).populate('genre', 'name');
  if (!book) throw new ApiError(404, 'Book not found');
  res.json({ data: book });
});

const applyFields = (book, body) => {
  for (const k of TEXT) if (body[k] !== undefined) book[k] = body[k] === '' ? undefined : body[k];
  for (const k of NUM) if (body[k] !== undefined && body[k] !== '') book[k] = Number(body[k]);
  if (body.publishedDate) book.publishedDate = body.publishedDate;
  // multipart sends one value for one genre and an array for several
  if (body.genre !== undefined) book.genre = [].concat(body.genre).filter(Boolean);
};

export const createBook = asyncHandler(async (req, res) => {
  const book = new Book();
  applyFields(book, req.body);
  book.availableCopies = book.totalCopies;
  if (req.file) book.image = `/uploads/${req.file.filename}`;
  else if (req.body.image) book.image = req.body.image;
  try {
    await book.save();
  } catch (err) {
    if (req.file) removeFile(book.image);
    throw err;
  }
  await book.populate('genre', 'name');
  res.status(201).json({ data: book });
});

export const updateBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');
  const { totalCopies, ...rest } = req.body;
  applyFields(book, rest);

  if (totalCopies !== undefined && totalCopies !== '' && Number(totalCopies) !== book.totalCopies) {
    const out = book.totalCopies - book.availableCopies;
    if (Number(totalCopies) < out) throw new ApiError(400, `${out} copies are out with readers; total cannot be lower`);
    book.totalCopies = Number(totalCopies);
    book.availableCopies = book.totalCopies - out;
  }

  const old = book.image;
  if (req.file) book.image = `/uploads/${req.file.filename}`;
  else if (req.body.image && req.body.image !== old) book.image = req.body.image;
  try {
    await book.save();
  } catch (err) {
    if (req.file) removeFile(`/uploads/${req.file.filename}`);
    throw err;
  }
  if (book.image !== old) removeFile(old);
  await book.populate('genre', 'name');
  res.json({ data: book });
});

export const deleteBook = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');
  if (await Rental.exists({ book: book._id, status: { $in: OPEN } }))
    throw new ApiError(400, 'This book has open rental requests or copies out. Finish those first');
  removeFile(book.image);
  await Review.deleteMany({ book: book._id });
  await book.deleteOne();
  res.json({ message: 'Book deleted' });
});

// ---- inventory ----
export const inventory = asyncHandler(async (req, res) => {
  const { filter: f = 'all', q } = req.query;
  const p = paginate(req.query, 15);
  const filter = {};
  if (q) filter.$or = [{ title: new RegExp(escapeRegex(q), 'i') }, { author: new RegExp(escapeRegex(q), 'i') }];
  if (f === 'out') filter.availableCopies = 0;
  if (f === 'low') filter.$expr = { $lte: ['$availableCopies', '$lowStockThreshold'] };
  const [data, total] = await Promise.all([
    Book.find(filter).sort('availableCopies title').skip(p.skip).limit(p.limit),
    Book.countDocuments(filter),
  ]);
  res.json(pageOf(data, total, p));
});

export const adjustStock = asyncHandler(async (req, res) => {
  const delta = parseInt(req.body.delta);
  if (!delta) throw new ApiError(400, 'Provide a non-zero whole number');
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');
  if (book.totalCopies + delta < 1) throw new ApiError(400, 'A book needs at least one copy. Delete it instead');
  if (book.availableCopies + delta < 0) throw new ApiError(400, `${book.totalCopies - book.availableCopies} copies are out with readers; you cannot remove more than ${book.availableCopies}`);
  book.totalCopies += delta;
  book.availableCopies += delta;
  await book.save();
  res.json({ data: book });
});
