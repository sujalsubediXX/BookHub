import User from '../models/User.js';
import { ApiError, asyncHandler, signToken } from '../utils/helpers.js';

const send = (res, status, user) => {
  const safe = user.toObject();
  delete safe.password;
  res.status(status).json({ token: signToken(user._id), user: safe });
};

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, phone, address } = req.body;
  const user = await User.create({ name, email, password, phone, address, role: 'customer' }); // public sign-up is always a customer
  send(res, 201, user);
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) throw new ApiError(400, 'Email and password are required');
  const user = await User.findOne({ email: email.toLowerCase() }).select('+password');
  if (!user || !(await user.matchPassword(password))) throw new ApiError(401, 'Incorrect email or password');
  if (!user.isActive) throw new ApiError(403, 'Your account is suspended. Please contact the library');
  send(res, 200, user);
});

export const me = asyncHandler(async (req, res) => res.json({ user: req.user }));

export const updateMe = asyncHandler(async (req, res) => {
  for (const k of ['name', 'phone', 'address']) if (req.body[k] !== undefined) req.user[k] = req.body[k];
  await req.user.save();
  res.json({ user: req.user });
});

export const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  const user = await User.findById(req.user._id).select('+password');
  if (!(await user.matchPassword(currentPassword || ''))) throw new ApiError(400, 'Current password is incorrect');
  user.password = newPassword;
  await user.save();
  res.json({ message: 'Password updated' });
});
