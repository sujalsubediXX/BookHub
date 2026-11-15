import Book from '../models/Book.js';
import User from '../models/User.js';
import Rental from '../models/Rental.js';
import { asyncHandler } from '../utils/helpers.js';

const lowStock = { $expr: { $lte: ['$availableCopies', '$lowStockThreshold'] } };

// light counts for sidebar badges
export const counts = asyncHandler(async (req, res) => {
  const [pending, low] = await Promise.all([Rental.countDocuments({ status: 'requested' }), Book.countDocuments(lowStock)]);
  res.json({ pending, lowStock: low });
});

export const stats = asyncHandler(async (req, res) => {
  const now = new Date();
  const [titles, customers, pending, awaitingPayment, ready, active, overdue, low, out, lowList, recentRequests] = await Promise.all([
    Book.countDocuments(),
    User.countDocuments({ role: 'customer', isActive: true }),
    Rental.countDocuments({ status: 'requested' }),
    Rental.countDocuments({ status: 'approved' }),
    Rental.countDocuments({ status: 'ready' }),
    Rental.countDocuments({ status: 'active' }),
    Rental.countDocuments({ status: 'active', dueDate: { $lt: now } }),
    Book.countDocuments(lowStock),
    Book.countDocuments({ availableCopies: 0 }),
    Book.find(lowStock).sort('availableCopies').limit(6).select('title image availableCopies totalCopies lowStockThreshold'),
    Rental.find({ status: 'requested' }).sort('createdAt').limit(5).populate('book', 'title image').populate('user', 'name'),
  ]);

  const result = { titles, customers, pending, awaitingPayment, ready, active, overdue, lowStock: low, outOfStock: out, lowList, recentRequests };

  // money and analytics only for people with the reports permission
  if (req.user.can('reports')) {
    const start = new Date(now.getFullYear(), now.getMonth() - 5, 1);
    const [revenueMonthly, rentalsMonthly, totals, byMethod, byStatus, topBooks, topCategories] = await Promise.all([
      Rental.aggregate([
        { $match: { 'payment.status': 'paid', 'payment.paidAt': { $gte: start } } },
        { $group: { _id: { y: { $year: '$payment.paidAt' }, m: { $month: '$payment.paidAt' } }, v: { $sum: '$total' } } },
      ]),
      Rental.aggregate([
        { $match: { createdAt: { $gte: start } } },
        { $group: { _id: { y: { $year: '$createdAt' }, m: { $month: '$createdAt' } }, v: { $sum: 1 } } },
      ]),
      Rental.aggregate([
        { $group: {
          _id: null,
          rentals: { $sum: { $cond: [{ $eq: ['$payment.status', 'paid'] }, '$total', 0] } },
          late: { $sum: { $cond: [{ $and: [{ $eq: ['$lateFeePaid', true] }, { $gt: ['$lateFee', 0] }] }, '$lateFee', 0] } },
          outstanding: { $sum: { $cond: [{ $and: [{ $eq: ['$lateFeePaid', false] }, { $gt: ['$lateFee', 0] }] }, '$lateFee', 0] } },
        } },
      ]),
      Rental.aggregate([{ $match: { 'payment.status': 'paid' } }, { $group: { _id: '$payment.method', total: { $sum: '$total' }, count: { $sum: 1 } } }]),
      Rental.aggregate([{ $group: { _id: '$status', count: { $sum: 1 } } }]),
      Rental.aggregate([
        { $match: { status: { $in: ['active', 'returned', 'ready'] } } },
        { $group: { _id: '$book', rentals: { $sum: 1 } } },
        { $sort: { rentals: -1 } }, { $limit: 5 },
        { $lookup: { from: 'books', localField: '_id', foreignField: '_id', as: 'b' } }, { $unwind: '$b' },
        { $project: { rentals: 1, title: '$b.title', author: '$b.author' } },
      ]),
      Rental.aggregate([
        { $match: { status: { $in: ['active', 'returned', 'ready'] } } },
        { $lookup: { from: 'books', localField: 'book', foreignField: '_id', as: 'b' } }, { $unwind: '$b' }, { $unwind: '$b.genre' },
        { $lookup: { from: 'genres', localField: 'b.genre', foreignField: '_id', as: 'g' } }, { $unwind: '$g' },
        { $group: { _id: '$g.name', count: { $sum: 1 } } }, { $sort: { count: -1 } }, { $limit: 6 },
      ]),
    ]);

    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const find = (arr) => arr.find((x) => x._id.y === d.getFullYear() && x._id.m === d.getMonth() + 1)?.v || 0;
      months.push({ year: d.getFullYear(), month: d.getMonth() + 1, revenue: find(revenueMonthly), rentals: find(rentalsMonthly) });
    }
    const t = totals[0] || { rentals: 0, late: 0, outstanding: 0 };
    Object.assign(result, {
      revenue: { rentals: t.rentals, lateFees: t.late, total: t.rentals + t.late, outstandingLateFees: t.outstanding },
      months,
      byMethod: byMethod.map((x) => ({ method: x._id || 'cash', total: x.total, count: x.count })),
      byStatus: byStatus.map((x) => ({ status: x._id, count: x.count })),
      topBooks,
      topCategories: topCategories.map((x) => ({ name: x._id, count: x.count })),
    });
  }
  res.json(result);
});
