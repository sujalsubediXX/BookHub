import Genre from '../models/Genre.js';
import Book from '../models/Book.js';
import { ApiError, asyncHandler } from '../utils/helpers.js';

// public: every genre with how many titles it holds
export const listGenres = asyncHandler(async (req, res) => {
  const [genres, counts] = await Promise.all([
    Genre.find().sort('name'),
    Book.aggregate([{ $unwind: '$genre' }, { $group: { _id: '$genre', count: { $sum: 1 } } }]),
  ]);
  const byId = Object.fromEntries(counts.map((c) => [String(c._id), c.count]));
  res.json({ data: genres.map((g) => ({ _id: g._id, name: g.name, description: g.description, count: byId[String(g._id)] || 0 })) });
});

export const createGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.create({ name: req.body.name, description: req.body.description });
  res.status(201).json({ data: genre });
});

export const updateGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) throw new ApiError(404, 'Genre not found');
  if (req.body.name !== undefined) genre.name = req.body.name;
  if (req.body.description !== undefined) genre.description = req.body.description;
  await genre.save();
  res.json({ data: genre });
});

export const deleteGenre = asyncHandler(async (req, res) => {
  const genre = await Genre.findById(req.params.id);
  if (!genre) throw new ApiError(404, 'Genre not found');
  if (await Book.exists({ genre: genre._id })) throw new ApiError(400, 'Books still use this genre. Move them to another genre first');
  await genre.deleteOne();
  res.json({ message: 'Genre deleted' });
});
