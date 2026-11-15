import User from '../models/User.js';
import Book from '../models/Book.js';
import { ApiError, asyncHandler } from '../utils/helpers.js';

export const getWishlist = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id).populate({ path: 'wishlist', populate: { path: 'genre', select: 'name' } });
  res.json({ data: user.wishlist });
});

export const toggleWishlist = asyncHandler(async (req, res) => {
  const { bookId } = req.params;
  if (!(await Book.exists({ _id: bookId }))) throw new ApiError(404, 'Book not found');
  const has = req.user.wishlist.some((id) => String(id) === bookId);
  req.user.wishlist = has ? req.user.wishlist.filter((id) => String(id) !== bookId) : [...req.user.wishlist, bookId];
  await req.user.save();
  res.json({ wishlisted: !has, ids: req.user.wishlist });
});
