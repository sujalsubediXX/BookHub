import mongoose from 'mongoose';
import { calcLateFee } from '../utils/helpers.js';

/*
 requested → approved (copy held, customer must pay) → ready (paid, waiting for handover)
 → active (with the customer, due date running) → returned
 side exits: rejected, cancelled, expired
*/
const rentalSchema = new mongoose.Schema(
  {
    book: { type: mongoose.Schema.Types.ObjectId, ref: 'Book', required: true },
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    days: { type: Number, required: true, min: 1 },
    pricePerDay: { type: Number, required: true },
    rentalFee: { type: Number, required: true },
    deliveryFee: { type: Number, default: 0 },
    total: { type: Number, required: true },

    fulfilment: { type: String, enum: ['pickup', 'delivery'], default: 'pickup' },
    deliveryAddress: { type: String, trim: true },
    phone: { type: String, trim: true },
    note: { type: String, trim: true },

    status: { type: String, enum: ['requested', 'approved', 'rejected', 'cancelled', 'expired', 'ready', 'active', 'returned'], default: 'requested' },
    rejectionReason: String,
    approvedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    approvedAt: Date,
    paymentDeadline: Date,

    payment: {
      method: { type: String, enum: ['esewa', 'khalti', 'cash'] },
      status: { type: String, enum: ['unpaid', 'pending', 'paid', 'failed', 'refund_due', 'refunded'], default: 'unpaid' },
      ref: String, // eSewa transaction_uuid or Khalti pidx
      gatewayRef: String,
      paidAt: Date,
    },

    handedOverAt: Date,
    dueDate: Date,
    returnedAt: Date,
    lateFee: { type: Number, default: 0 },
    lateFeePaid: { type: Boolean, default: true },
  },
  { timestamps: true, toJSON: { virtuals: true }, toObject: { virtuals: true } }
);

rentalSchema.virtual('isOverdue').get(function () {
  return this.status === 'active' && new Date() > this.dueDate;
});
rentalSchema.virtual('currentLateFee').get(function () {
  if (this.status === 'returned') return this.lateFee;
  return this.status === 'active' ? calcLateFee(this.dueDate) : 0;
});

rentalSchema.index({ user: 1, status: 1 });
rentalSchema.index({ book: 1, status: 1 });
rentalSchema.index({ 'payment.ref': 1 });

export default mongoose.model('Rental', rentalSchema);
