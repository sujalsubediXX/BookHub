import crypto from 'crypto';
import Rental from '../models/Rental.js';
import { ApiError, asyncHandler } from '../utils/helpers.js';

const env = (k) => process.env[k];
const back = (res, status, rentalId = '') =>
  res.redirect(`${env('CLIENT_URL') || 'http://localhost:5173'}/payment/result?status=${status}&rental=${rentalId}`);

// ---------- gateway verification (the redirect alone is never trusted) ----------
async function verifyEsewa(rental) {
  const url = new URL(env('ESEWA_STATUS_URL'));
  url.search = new URLSearchParams({
    product_code: env('ESEWA_PRODUCT_CODE'),
    total_amount: String(rental.total),
    transaction_uuid: rental.payment.ref,
  }).toString();
  const d = await fetch(url).then((r) => r.json()).catch(() => ({}));
  return d.status === 'COMPLETE' ? { ok: true, gatewayRef: d.ref_id } : { ok: false, status: d.status };
}

async function verifyKhalti(rental) {
  const d = await fetch(`${env('KHALTI_BASE_URL')}/epayment/lookup/`, {
    method: 'POST',
    headers: { Authorization: `key ${env('KHALTI_SECRET')}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ pidx: rental.payment.ref }),
  }).then((r) => r.json()).catch(() => ({}));
  const amountOk = Number(d.total_amount) === Math.round(rental.total * 100); // Khalti reports paisa
  return d.status === 'Completed' && amountOk ? { ok: true, gatewayRef: d.transaction_id } : { ok: false, status: d.status };
}

const verify = (rental) => (rental.payment.method === 'esewa' ? verifyEsewa(rental) : verifyKhalti(rental));

// returns 'paid' | 'late' (money arrived after the hold expired -> refund due) | 'failed'
async function applyVerification(rental) {
  if (rental.payment.status === 'paid') return 'paid';
  const v = await verify(rental);
  if (!v.ok) {
    if (rental.payment.status === 'pending' && ['CANCELED', 'FULL_REFUND', 'NOT_FOUND', 'Expired', 'User canceled'].includes(v.status)) {
      rental.payment.status = 'failed';
      await rental.save();
    }
    return 'failed';
  }
  rental.payment.gatewayRef = v.gatewayRef;
  rental.payment.paidAt = new Date();
  if (rental.status === 'approved') {
    rental.payment.status = 'paid';
    rental.status = 'ready';
    await rental.save();
    return 'paid';
  }
  rental.payment.status = 'refund_due';
  await rental.save();
  return 'late';
}

// ---------- start a payment ----------
export const initiate = asyncHandler(async (req, res) => {
  const { method } = req.body;
  const rental = await Rental.findById(req.params.id).populate('book', 'title');
  if (!rental) throw new ApiError(404, 'Rental not found');
  if (String(rental.user) !== String(req.user._id)) throw new ApiError(403, 'Not your rental');
  if (rental.status !== 'approved') throw new ApiError(400, 'This rental is not waiting for payment');
  if (rental.payment.status === 'paid') throw new ApiError(400, 'Already paid');
  if (rental.paymentDeadline && rental.paymentDeadline < new Date()) throw new ApiError(400, 'The payment window has closed');

  const apiUrl = env('API_URL') || 'http://localhost:5000';

  if (method === 'cash') {
    rental.payment = { method: 'cash', status: 'unpaid' };
    await rental.save();
    return res.json({ method: 'cash', message: 'Pay at the library counter before the deadline and the staff will mark it paid.' });
  }

  if (method === 'esewa') {
    const uuid = `${rental._id}-${Date.now()}`;
    const total = String(rental.total);
    const productCode = env('ESEWA_PRODUCT_CODE');
    const signature = crypto
      .createHmac('sha256', env('ESEWA_SECRET'))
      .update(`total_amount=${total},transaction_uuid=${uuid},product_code=${productCode}`)
      .digest('base64');
    rental.payment = { method: 'esewa', status: 'pending', ref: uuid };
    await rental.save();
    return res.json({
      method: 'esewa',
      url: env('ESEWA_FORM_URL'),
      fields: {
        amount: total, tax_amount: '0', total_amount: total, transaction_uuid: uuid, product_code: productCode,
        product_service_charge: '0', product_delivery_charge: '0',
        success_url: `${apiUrl}/api/payments/esewa/success`,
        failure_url: `${apiUrl}/api/payments/esewa/failure?rental=${rental._id}`,
        signed_field_names: 'total_amount,transaction_uuid,product_code', signature,
      },
    });
  }

  if (method === 'khalti') {
    if (!env('KHALTI_SECRET')) throw new ApiError(503, 'Khalti is not configured yet (set KHALTI_SECRET)');
    if (rental.total < 10) throw new ApiError(400, 'Khalti needs a payment of at least Rs 10');
    const d = await fetch(`${env('KHALTI_BASE_URL')}/epayment/initiate/`, {
      method: 'POST',
      headers: { Authorization: `key ${env('KHALTI_SECRET')}`, 'Content-Type': 'application/json' },
      body: JSON.stringify({
        return_url: `${apiUrl}/api/payments/khalti/return`,
        website_url: env('CLIENT_URL'),
        amount: Math.round(rental.total * 100),
        purchase_order_id: String(rental._id),
        purchase_order_name: `Rental: ${rental.book.title}`.slice(0, 100),
        customer_info: { name: req.user.name, email: req.user.email, phone: req.user.phone || '9800000000' },
      }),
    }).then((r) => r.json()).catch(() => ({}));
    if (!d.pidx || !d.payment_url) throw new ApiError(502, d.detail || d.error_key || 'Could not start Khalti payment');
    rental.payment = { method: 'khalti', status: 'pending', ref: d.pidx };
    await rental.save();
    return res.json({ method: 'khalti', url: d.payment_url });
  }

  throw new ApiError(400, 'Choose eSewa, Khalti or pay at the counter');
});

// ---------- browser redirects from the gateways ----------
export const esewaSuccess = asyncHandler(async (req, res) => {
  let uuid;
  try {
    uuid = JSON.parse(Buffer.from(String(req.query.data || ''), 'base64').toString()).transaction_uuid;
  } catch { /* handled below */ }
  const rental = uuid && (await Rental.findOne({ 'payment.method': 'esewa', 'payment.ref': uuid }));
  if (!rental) return back(res, 'failed');
  return back(res, await applyVerification(rental), rental._id);
});

export const esewaFailure = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.query.rental).catch(() => null);
  if (rental && rental.payment.status === 'pending') {
    rental.payment.status = 'failed';
    await rental.save();
  }
  return back(res, 'failed', rental?._id);
});

export const khaltiReturn = asyncHandler(async (req, res) => {
  const rental = await Rental.findOne({ 'payment.method': 'khalti', 'payment.ref': String(req.query.pidx || '') });
  if (!rental) return back(res, 'failed');
  return back(res, await applyVerification(rental), rental._id);
});

// customer closed the tab before the redirect? let them re-check
export const verifyPayment = asyncHandler(async (req, res) => {
  const rental = await Rental.findById(req.params.id);
  if (!rental || String(rental.user) !== String(req.user._id)) throw new ApiError(404, 'Rental not found');
  if (!['esewa', 'khalti'].includes(rental.payment.method) || !rental.payment.ref) throw new ApiError(400, 'No online payment to check');
  const result = await applyVerification(rental);
  res.json({ result, status: rental.status });
});
