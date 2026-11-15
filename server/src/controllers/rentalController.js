import Rental from '../models/Rental.js';
import Book from '../models/Book.js';
import { ApiError, asyncHandler, calcLateFee, paginate, pageOf, rules } from '../utils/helpers.js';

const OPEN = ['requested', 'approved', 'ready', 'active'];
const populate = [
  { path: 'book', select: 'title author isbn image pricePerDay' },
  { path: 'user', select: 'name email phone membershipId' },
];
const load = async (id) => {
  const r = await Rental.findById(id);
  if (!r) throw new ApiError(404, 'Rental not found');
  return r;
};
const out = async (r) => ({ data: await r.populate(populate) });
const releaseCopy = (bookId) => Book.findByIdAndUpdate(bookId, { $inc: { availableCopies: 1 } });

// ---------- customer ----------
export const createRental = asyncHandler(async (req, res) => {
  const { bookId, fulfilment = 'pickup', deliveryAddress, phone, note } = req.body;
  const R = rules();
  const days = parseInt(req.body.days);
  if (!days || days < 1 || days > R.maxDays) throw new ApiError(400, `Choose between 1 and ${R.maxDays} days`);
  if (!['pickup', 'delivery'].includes(fulfilment)) throw new ApiError(400, 'Choose pickup or delivery');
  if (fulfilment === 'delivery' && !deliveryAddress?.trim()) throw new ApiError(400, 'Enter a delivery address');
  if (fulfilment === 'delivery' && !(phone || req.user.phone)) throw new ApiError(400, 'Enter a phone number for delivery');

  const book = await Book.findById(bookId);
  if (!book) throw new ApiError(404, 'Book not found');
  if (book.availableCopies < 1) throw new ApiError(400, 'No copies are available right now. Add it to your wishlist and check back');

  const uid = req.user._id;
  if ((await Rental.countDocuments({ user: uid, status: { $in: OPEN } })) >= R.maxOpen)
    throw new ApiError(400, `You can have at most ${R.maxOpen} open rentals at a time`);
  if (await Rental.exists({ user: uid, book: bookId, status: { $in: OPEN } }))
    throw new ApiError(400, 'You already have an open rental for this book');
  if (await Rental.exists({ user: uid, status: 'active', dueDate: { $lt: new Date() } }))
    throw new ApiError(400, 'Return your overdue book before renting another');
  if (await Rental.exists({ user: uid, lateFee: { $gt: 0 }, lateFeePaid: false }))
    throw new ApiError(400, 'Please pay your outstanding late fee at the library first');

  const rentalFee = book.pricePerDay * days;
  const deliveryFee = fulfilment === 'delivery' ? R.deliveryFee : 0;
  const rental = await Rental.create({
    book: book._id, user: uid, days, pricePerDay: book.pricePerDay, rentalFee, deliveryFee, total: rentalFee + deliveryFee,
    fulfilment, deliveryAddress: fulfilment === 'delivery' ? deliveryAddress : undefined, phone: phone || req.user.phone, note,
  });
  res.status(201).json(await out(rental));
});

export const myRentals = asyncHandler(async (req, res) => {
  const data = await Rental.find({ user: req.user._id }).sort('-createdAt').populate(populate);
  res.json({ data });
});

export const cancelRental = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  const isStaff = req.user.role !== 'customer';
  if (!isStaff && String(r.user) !== String(req.user._id)) throw new ApiError(403, 'Not your rental');
  if (isStaff && !req.user.can('rentals')) throw new ApiError(403, 'Your account does not have the "rentals" permission');
  const allowed = isStaff ? ['requested', 'approved', 'ready'] : ['requested', 'approved'];
  if (!allowed.includes(r.status)) throw new ApiError(400, 'This rental can no longer be cancelled. Please contact the library');

  if (r.status !== 'requested') await releaseCopy(r.book); // approved/ready were holding a copy
  if (r.payment.status === 'paid') r.payment.status = 'refund_due';
  r.status = 'cancelled';
  await r.save();
  res.json(await out(r));
});

// ---------- staff ----------
export const listRentals = asyncHandler(async (req, res) => {
  const { view, userId, bookId } = req.query;
  const p = paginate(req.query, 10);
  const filter = {};
  if (view === 'requests') filter.status = 'requested';
  else if (view === 'awaiting') filter.status = 'approved';
  else if (view === 'ready') filter.status = 'ready';
  else if (view === 'active') filter.status = 'active';
  else if (view === 'overdue') Object.assign(filter, { status: 'active', dueDate: { $lt: new Date() } });
  else if (view === 'returned') filter.status = 'returned';
  else if (view === 'closed') filter.status = { $in: ['rejected', 'cancelled', 'expired'] };
  else if (view === 'refunds') filter['payment.status'] = 'refund_due';
  else if (view === 'latefees') Object.assign(filter, { lateFee: { $gt: 0 }, lateFeePaid: false });
  if (userId) filter.user = userId;
  if (bookId) filter.book = bookId;

  // oldest requests first so nobody waits forever; everything else newest first
  const sort = view === 'requests' || view === 'awaiting' ? 'createdAt' : '-createdAt';
  const [data, total] = await Promise.all([
    Rental.find(filter).sort(sort).skip(p.skip).limit(p.limit).populate(populate),
    Rental.countDocuments(filter),
  ]);
  res.json(pageOf(data, total, p));
});

export const approve = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  if (r.status !== 'requested') throw new ApiError(400, 'Only new requests can be approved');
  // atomically hold a copy so two staff cannot approve the last one twice
  const book = await Book.findOneAndUpdate({ _id: r.book, availableCopies: { $gt: 0 } }, { $inc: { availableCopies: -1 } });
  if (!book) throw new ApiError(400, 'No copies left to hold. Reject this request or add stock first');

  r.approvedBy = req.user._id;
  r.approvedAt = new Date();
  if (r.total === 0) {
    r.status = 'ready'; // free rental, nothing to pay
    r.payment = { method: 'cash', status: 'paid', paidAt: new Date() };
  } else {
    r.status = 'approved';
    r.paymentDeadline = new Date(Date.now() + rules().payWindowHours * 3600000);
  }
  await r.save();
  res.json(await out(r));
});

export const reject = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  if (r.status !== 'requested') throw new ApiError(400, 'Only new requests can be rejected');
  r.status = 'rejected';
  r.rejectionReason = req.body.reason?.trim() || 'Not available for rent right now';
  await r.save();
  res.json(await out(r));
});

// cash paid at the counter
export const markPaid = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  if (r.status !== 'approved') throw new ApiError(400, 'Only approved rentals waiting for payment can be marked paid');
  r.payment = { method: 'cash', status: 'paid', paidAt: new Date() };
  r.status = 'ready';
  await r.save();
  res.json(await out(r));
});

export const handover = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  if (r.status !== 'ready') throw new ApiError(400, 'Only paid rentals can be handed over');
  r.status = 'active';
  r.handedOverAt = new Date();
  r.dueDate = new Date(Date.now() + r.days * 86400000);
  await r.save();
  res.json(await out(r));
});

export const returnRental = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  if (r.status !== 'active') throw new ApiError(400, 'This book is not currently out');
  r.status = 'returned';
  r.returnedAt = new Date();
  r.lateFee = calcLateFee(r.dueDate, r.returnedAt);
  r.lateFeePaid = r.lateFee === 0;
  await r.save();
  await releaseCopy(r.book);
  res.json(await out(r));
});

export const collectLateFee = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  if (r.status !== 'returned' || !r.lateFee) throw new ApiError(400, 'No late fee to collect');
  r.lateFeePaid = true;
  await r.save();
  res.json(await out(r));
});

export const markRefunded = asyncHandler(async (req, res) => {
  const r = await load(req.params.id);
  if (r.payment.status !== 'refund_due') throw new ApiError(400, 'No refund is due on this rental');
  r.payment.status = 'refunded';
  await r.save();
  res.json(await out(r));
});
