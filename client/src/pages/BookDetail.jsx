import { useCallback, useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { WishlistHeart } from '../components/BookCard.jsx';
import { Cover, Pagination, Stars, fmtDate, money, useToast } from '../components/ui.jsx';

function StarInput({ value, onChange }) {
  return (
    <div className="star-input" role="radiogroup" aria-label="Your rating">
      {[1, 2, 3, 4, 5].map((i) => (
        <button type="button" key={i} role="radio" aria-checked={value === i} className={i <= value ? 'on' : ''} onClick={() => onChange(i)} aria-label={`${i} star${i > 1 ? 's' : ''}`}>
          <svg width="26" height="26" viewBox="0 0 24 24"><path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" /></svg>
        </button>
      ))}
    </div>
  );
}

export default function BookDetail() {
  const { id } = useParams();
  const { user, isCustomer, isStaff } = useAuth();
  const navigate = useNavigate();
  const loc = useLocation();
  const toast = useToast();
  const [book, setBook] = useState(null);
  const [rules, setRules] = useState({ maxDays: 30, deliveryFee: 100, payWindowHours: 48 });
  const [reviews, setReviews] = useState({ data: [], total: 0, pages: 1, page: 1 });
  const [rp, setRp] = useState(1);
  const [form, setForm] = useState({ days: 3, fulfilment: 'pickup', deliveryAddress: user?.address || '', phone: user?.phone || '', note: '' });
  const [busy, setBusy] = useState(false);
  const [rv, setRv] = useState({ rating: 0, comment: '' });

  const loadBook = useCallback(() => api.get(`/books/${id}`).then((r) => setBook(r.data.data)).catch((e) => toast(errMsg(e), 'err')), [id]);
  const loadReviews = useCallback(() => api.get(`/books/${id}/reviews`, { params: { page: rp } }).then((r) => setReviews(r.data)), [id, rp]);
  useEffect(() => { loadBook(); api.get('/books/facets').then((r) => setRules(r.data.rules)); }, [loadBook]);
  useEffect(() => { loadReviews(); }, [loadReviews]);

  if (!book) return <div className="splash">Loading…</div>;

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const days = Math.min(Math.max(parseInt(form.days) || 1, 1), rules.maxDays);
  const delivery = form.fulfilment === 'delivery' ? rules.deliveryFee : 0;
  const total = book.pricePerDay * days + delivery;
  const out = book.availableCopies === 0;

  const rent = async (e) => {
    e.preventDefault();
    if (!user) return navigate('/login', { state: { from: loc.pathname } });
    setBusy(true);
    try {
      await api.post('/rentals', { bookId: book._id, ...form, days });
      toast('Request sent. You can pay as soon as the library approves it');
      navigate('/my-rentals');
    } catch (err) { toast(errMsg(err), 'err'); } finally { setBusy(false); }
  };

  const review = async (e) => {
    e.preventDefault();
    try {
      await api.post(`/books/${id}/reviews`, rv);
      toast('Thanks for your review');
      setRv({ rating: 0, comment: '' });
      loadBook(); loadReviews();
    } catch (err) { toast(errMsg(err), 'err'); }
  };
  const removeReview = async (rid) => {
    try { await api.delete(`/reviews/${rid}`); loadBook(); loadReviews(); } catch (err) { toast(errMsg(err), 'err'); }
  };

  return (
    <>
      <p className="crumbs"><Link to="/books">Catalog</Link> / {book.genre?.[0]?.name}</p>
      <div className="detail">
        <div className="detail-cover"><Cover book={book} /></div>

        <div className="detail-info">
          <div className="title-row">
            <h1>{book.title}</h1>
            <WishlistHeart bookId={book._id} />
          </div>
          <p className="author">by {book.author}</p>
          <Stars value={book.avgRating} count={book.reviewCount} size={18} />
          {book.description && <p className="desc">{book.description}</p>}
          <dl className="details">
            <dt>Genres</dt><dd className="genre-links">{book.genre?.map((g) => <Link key={g._id} to={`/books?genre=${g._id}`}>{g.name}</Link>)}</dd>
            <dt>Language</dt><dd>{book.language}</dd>
            <dt>Published</dt><dd>{fmtDate(book.publishedDate)}{book.publisher ? `, ${book.publisher}` : ''}</dd>
            <dt>ISBN</dt><dd>{book.isbn}</dd>
          </dl>
        </div>

        <form className="rent-box" onSubmit={rent}>
          <p className="rent-price"><b>Rs {book.pricePerDay}</b> / day</p>
          <p className={`avail ${out ? 'out' : ''}`}>{out ? 'All copies are out right now' : `${book.availableCopies} of ${book.totalCopies} copies available`}</p>

          {isStaff ? (
            <p className="muted">You are signed in as staff. Use a customer account to rent.</p>
          ) : out ? (
            <p className="muted">Save it to your wishlist and check back soon.</p>
          ) : (
            <>
              <label>How many days?
                <div className="stepper">
                  <button type="button" className="btn sm" onClick={() => setForm({ ...form, days: Math.max(1, days - 1) })} aria-label="Fewer days">−</button>
                  <input type="number" min="1" max={rules.maxDays} value={form.days} onChange={set('days')} aria-label="Days" />
                  <button type="button" className="btn sm" onClick={() => setForm({ ...form, days: Math.min(rules.maxDays, days + 1) })} aria-label="More days">+</button>
                </div>
              </label>
              <fieldset className="radio-cards">
                <legend>Get it by</legend>
                <label className={form.fulfilment === 'pickup' ? 'on' : ''}><input type="radio" name="f" checked={form.fulfilment === 'pickup'} onChange={() => setForm({ ...form, fulfilment: 'pickup' })} /><b>Pickup</b><span>From the library, free</span></label>
                <label className={form.fulfilment === 'delivery' ? 'on' : ''}><input type="radio" name="f" checked={form.fulfilment === 'delivery'} onChange={() => setForm({ ...form, fulfilment: 'delivery' })} /><b>Delivery</b><span>+ Rs {rules.deliveryFee}</span></label>
              </fieldset>
              {form.fulfilment === 'delivery' && (
                <>
                  <label>Delivery address<input required value={form.deliveryAddress} onChange={set('deliveryAddress')} placeholder="Area, street, landmark" /></label>
                  <label>Phone<input required value={form.phone} onChange={set('phone')} /></label>
                </>
              )}
              <div className="summary">
                <div><span>{days} day{days > 1 ? 's' : ''} × Rs {book.pricePerDay}</span><span>{money(book.pricePerDay * days)}</span></div>
                {delivery > 0 && <div><span>Delivery</span><span>{money(delivery)}</span></div>}
                <div className="total"><span>Total</span><span>{money(total)}</span></div>
              </div>
              <button className="btn primary block" disabled={busy}>{busy ? 'Sending…' : user ? 'Request to rent' : 'Log in to rent'}</button>
              <p className="muted small">The library approves each request. After approval you have {rules.payWindowHours} hours to pay, then the due date starts when you collect the book.</p>
            </>
          )}
        </form>
      </div>

      <section className="panel reviews">
        <div className="panel-head"><h2>Reviews</h2><Stars value={book.avgRating} count={book.reviewCount} /></div>
        {isCustomer && (
          <form onSubmit={review} className="review-form">
            <strong>Rented this book? Tell others what you thought.</strong>
            <StarInput value={rv.rating} onChange={(rating) => setRv({ ...rv, rating })} />
            <textarea rows="3" placeholder="Optional comment" value={rv.comment} onChange={(e) => setRv({ ...rv, comment: e.target.value })} maxLength={1000} />
            <div><button className="btn primary sm" disabled={!rv.rating}>Post review</button></div>
          </form>
        )}
        {reviews.data.length === 0 ? <p className="muted pad">No reviews yet.</p> : (
          <ul className="review-list">
            {reviews.data.map((r) => (
              <li key={r._id}>
                <div><strong>{r.user?.name || 'Reader'}</strong><Stars value={r.rating} size={13} /><small>{fmtDate(r.createdAt)}</small></div>
                {r.comment && <p>{r.comment}</p>}
                {user && (String(r.user?._id) === String(user._id) || user.role === 'admin') && <button className="linkish" onClick={() => removeReview(r._id)}>Delete</button>}
              </li>
            ))}
          </ul>
        )}
        <Pagination page={reviews.page} pages={reviews.pages} total={reviews.total} onChange={setRp} />
      </section>
    </>
  );
}
