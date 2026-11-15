import User from '../models/User.js';
import Rental from '../models/Rental.js';
import { ApiError, asyncHandler, escapeRegex, paginate, pageOf, PERMISSIONS } from '../utils/helpers.js';

const OPEN = ['requested', 'approved', 'ready', 'active'];
const cleanPerms = (p) => (Array.isArray(p) ? [...new Set(p.filter((x) => PERMISSIONS.includes(x)))] : []);

// ---------- customers (permission: members) ----------
export const listCustomers = asyncHandler(async (req, res) => {
  const { q, isActive } = req.query;
  const p = paginate(req.query, 10);
  const filter = { role: 'customer' };
  if (isActive !== undefined) filter.isActive = isActive === 'true';
  if (q) {
    const rx = new RegExp(escapeRegex(q), 'i');
    filter.$or = [{ name: rx }, { email: rx }, { membershipId: rx }, { phone: rx }];
  }
  const [data, total] = await Promise.all([User.find(filter).sort('-createdAt').skip(p.skip).limit(p.limit), User.countDocuments(filter)]);
  res.json(pageOf(data, total, p));
});

export const updateCustomer = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'customer' });
  if (!user) throw new ApiError(404, 'Customer not found');
  for (const k of ['name', 'phone', 'address']) if (req.body[k] !== undefined) user[k] = req.body[k];
  if (req.body.isActive !== undefined) user.isActive = !!req.body.isActive;
  await user.save();
  res.json({ data: user });
});

export const deleteCustomer = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'customer' });
  if (!user) throw new ApiError(404, 'Customer not found');
  if (await Rental.exists({ user: user._id, status: { $in: OPEN } })) throw new ApiError(400, 'This customer has open rentals');
  await user.deleteOne();
  res.json({ message: 'Customer deleted' });
});

// ---------- staff accounts (admin only) ----------
export const listStaff = asyncHandler(async (req, res) => {
  res.json({ data: await User.find({ role: { $in: ['admin', 'staff'] } }).sort('role name') });
});

export const createStaff = asyncHandler(async (req, res) => {
  const { name, email, password, phone } = req.body;
  const user = await User.create({ name, email, password, phone, role: 'staff', permissions: cleanPerms(req.body.permissions) });
  const out = user.toObject();
  delete out.password;
  res.status(201).json({ data: out });
});

export const updateStaff = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'staff' });
  if (!user) throw new ApiError(404, 'Staff account not found');
  if (req.body.name !== undefined) user.name = req.body.name;
  if (req.body.phone !== undefined) user.phone = req.body.phone;
  if (req.body.permissions !== undefined) user.permissions = cleanPerms(req.body.permissions);
  if (req.body.isActive !== undefined) user.isActive = !!req.body.isActive;
  if (req.body.password) user.password = req.body.password; // admin can reset a staff password
  await user.save();
  res.json({ data: user });
});

export const deleteStaff = asyncHandler(async (req, res) => {
  const user = await User.findOne({ _id: req.params.id, role: 'staff' });
  if (!user) throw new ApiError(404, 'Staff account not found');
  await user.deleteOne();
  res.json({ message: 'Staff account deleted' });
});
