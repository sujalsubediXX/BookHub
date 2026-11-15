import Review from '../models/Review.js';
import Rental from '../models/Rental.js';
import Book from '../models/Book.js';
import { ApiError, asyncHandler, paginate, pageOf } from '../utils/helpers.js';

const refreshStats = async (bookId) => {
  const [s] = await Review.aggregate([
    { $match: { book: bookId } },
    { $group: { _id: null, avg: { $avg: '$rating' }, n: { $sum: 1 } } },
  ]);
  await Book.findByIdAndUpdate(bookId, { avgRating: s ? Math.round(s.avg * 10) / 10 : 0, reviewCount: s?.n || 0 });
};

export const listReviews = asyncHandler(async (req, res) => {
  const p = paginate(req.query, 8);
  const filter = { book: req.params.id };
  const [data, total] = await Promise.all([
    Review.find(filter).sort('-createdAt').skip(p.skip).limit(p.limit).populate('user', 'name'),
    Review.countDocuments(filter),
  ]);
  res.json(pageOf(data, total, p));
});

// only people who have actually had the book can review it
export const saveReview = asyncHandler(async (req, res) => {
  const book = await Book.findById(req.params.id);
  if (!book) throw new ApiError(404, 'Book not found');
  const rented = await Rental.exists({ book: book._id, user: req.user._id, status: { $in: ['active', 'returned'] } });
  if (!rented) throw new ApiError(403, 'You can review a book after you have rented it');
  const rating = Number(req.body.rating);
  if (!(rating >= 1 && rating <= 5)) throw new ApiError(400, 'Choose a rating from 1 to 5');
  const review = await Review.findOneAndUpdate(
    { book: book._id, user: req.user._id },
    { rating, comment: req.body.comment || '' },
    { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
  );
  await refreshStats(book._id);
  res.status(201).json({ data: review });
});

export const deleteReview = asyncHandler(async (req, res) => {
  const review = await Review.findById(req.params.id);
  if (!review) throw new ApiError(404, 'Review not found');
  const mine = String(review.user) === String(req.user._id);
  if (!mine && !req.user.can('books')) throw new ApiError(403, 'Not allowed');
  await review.deleteOne();
  await refreshStats(review.book);
  res.json({ message: 'Review deleted' });
});
