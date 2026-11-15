import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import { PERMISSIONS } from '../utils/helpers.js';

const userSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, 'Name is required'], trim: true },
    email: { type: String, required: [true, 'Email is required'], unique: true, lowercase: true, trim: true },
    password: { type: String, required: true, minlength: [6, 'Password must be at least 6 characters'], select: false },
    role: { type: String, enum: ['admin', 'staff', 'customer'], default: 'customer' },
    permissions: [{ type: String, enum: PERMISSIONS }], // only used for staff
    membershipId: { type: String, unique: true },
    phone: { type: String, trim: true },
    address: { type: String, trim: true },
    wishlist: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Book' }],
    isActive: { type: Boolean, default: true },
  },
  { timestamps: true }
);

userSchema.pre('validate', function () {
  if (!this.membershipId) {
    this.membershipId = 'BR-' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
  }
});

userSchema.pre('save', async function () {
  if (this.isModified('password')) this.password = await bcrypt.hash(this.password, 10);
});

userSchema.methods.matchPassword = function (plain) {
  return bcrypt.compare(plain, this.password);
};
userSchema.methods.can = function (perm) {
  return this.role === 'admin' || (this.role === 'staff' && this.permissions.includes(perm));
};

export default mongoose.model('User', userSchema);
