import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { ApiError, asyncHandler } from '../utils/helpers.js';

const userFromRequest = async (req) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) return null;
  let decoded;
  try {
    decoded = jwt.verify(token, process.env.JWT_SECRET);
  } catch {
    throw new ApiError(401, 'Session expired, please log in again');
  }
  const user = await User.findById(decoded.id);
  if (!user || !user.isActive) throw new ApiError(401, 'Account not found or deactivated');
  return user;
};

export const protect = asyncHandler(async (req, res, next) => {
  req.user = await userFromRequest(req);
  if (!req.user) throw new ApiError(401, 'Please log in to continue');
  next();
});

export const staffOnly = (req, res, next) =>
  req.user.role === 'customer' ? next(new ApiError(403, 'Staff access only')) : next();
export const adminOnly = (req, res, next) =>
  req.user.role === 'admin' ? next() : next(new ApiError(403, 'Admin access only'));
export const customerOnly = (req, res, next) =>
  req.user.role === 'customer' ? next() : next(new ApiError(403, 'Only customers can do this'));

// admin has every permission; staff need it granted
export const can = (perm) => (req, res, next) =>
  req.user.can(perm) ? next() : next(new ApiError(403, `Your account does not have the "${perm}" permission`));
