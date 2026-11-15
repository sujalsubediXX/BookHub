import Rental from './models/Rental.js';
import Book from './models/Book.js';

// Approved rentals that are not paid before the deadline give their copy back to the shelf.
export async function expireUnpaid() {
  const stale = await Rental.find({ status: 'approved', 'payment.status': { $ne: 'paid' }, paymentDeadline: { $lt: new Date() } });
  for (const r of stale) {
    r.status = 'expired';
    if (r.payment.status === 'pending') r.payment.status = 'failed';
    await r.save();
    await Book.findByIdAndUpdate(r.book, { $inc: { availableCopies: 1 } });
  }
}

export function startJobs() {
  expireUnpaid().catch(() => {});
  setInterval(() => expireUnpaid().catch(() => {}), 30 * 60 * 1000);
}
