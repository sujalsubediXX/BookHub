import jwt from 'jsonwebtoken';

export const PERMISSIONS = ['books', 'rentals', 'members', 'reports'];

export const asyncHandler = (fn) => (req, res, next) => Promise.resolve(fn(req, res, next)).catch(next);

export class ApiError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

export const signToken = (id) => jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// read lazily so .env is always loaded first
export const rules = () => ({
  maxDays: Number(process.env.MAX_RENTAL_DAYS || 30),
  maxOpen: Number(process.env.MAX_OPEN_RENTALS || 5),
  lateFeePerDay: Number(process.env.LATE_FEE_PER_DAY || 10),
  deliveryFee: Number(process.env.DELIVERY_FEE || 100),
  payWindowHours: Number(process.env.PAY_WINDOW_HOURS || 48),
});

export const calcLateFee = (due, end = new Date()) => {
  const days = Math.ceil((end - new Date(due)) / 86400000);
  return days > 0 ? days * rules().lateFeePerDay : 0;
};

export const escapeRegex = (s = '') => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

export const paginate = (query, defLimit = 10) => {
  const page = Math.max(parseInt(query.page) || 1, 1);
  const limit = Math.min(Math.max(parseInt(query.limit) || defLimit, 1), 200);
  return { page, limit, skip: (page - 1) * limit };
};

export const pageOf = (data, total, { page, limit }) => ({ data, total, page, pages: Math.ceil(total / limit) || 1 });
