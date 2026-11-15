import { useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

const COPY = {
  paid: ['Payment received', 'Thank you. Your rental is paid. Collect it from the library, or wait for delivery. Your due date starts when you receive the book.'],
  late: ['Payment arrived after the hold expired', 'Your payment went through but the reserved copy had already been released. The library will refund you. Please contact them if you do not hear back.'],
  failed: ['Payment not completed', 'No money was taken, or it could not be confirmed. You can try again from your rentals while the payment window is open.'],
};

export default function PaymentResult() {
  const [p] = useSearchParams();
  const status = COPY[p.get('status')] ? p.get('status') : 'failed';
  const [title, text] = COPY[status];
  useEffect(() => { document.title = title; }, [title]);
  return (
    <div className="result-card">
      <span className={`result-icon ${status}`} aria-hidden="true">{status === 'paid' ? '✓' : status === 'late' ? '!' : '×'}</span>
      <h1>{title}</h1>
      <p>{text}</p>
      <Link to="/my-rentals" className="btn primary">Go to my rentals</Link>
    </div>
  );
}
