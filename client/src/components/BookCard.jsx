import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { Cover, Icon, Stars, useToast } from './ui.jsx';
import { errMsg } from '../api.js';

export function WishlistHeart({ bookId, onChange }) {
  const { user, isCustomer, wishlist, toggleWishlist } = useAuth();
  const navigate = useNavigate();
  const toast = useToast();
  if (user && !isCustomer) return null;
  const on = wishlist.includes(String(bookId));
  const click = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!user) return navigate('/login', { state: { from: location.pathname + location.search } });
    try {
      const added = await toggleWishlist(bookId);
      toast(added ? 'Saved to your wishlist' : 'Removed from wishlist');
      onChange?.(added);
    } catch (err) { toast(errMsg(err), 'err'); }
  };
  return (
    <button className={`heart ${on ? 'on' : ''}`} onClick={click} aria-pressed={on} aria-label={on ? 'Remove from wishlist' : 'Save to wishlist'}>
      <Icon name="heart" size={18} />
    </button>
  );
}

export default function BookCard({ book, onWishlistChange }) {
  const out = book.availableCopies === 0;
  return (
    <article className="book-card">
      <Link to={`/books/${book._id}`} className="book-link">
        <div className="book-cover-wrap">
          <Cover book={book} />

          <WishlistHeart bookId={book._id} onChange={onWishlistChange} />
          <span className={`stock-pill ${out ? 'out' : book.availableCopies <= (book.lowStockThreshold ?? 2) ? 'low' : ''}`}>
            {out ? 'All copies out' : book.availableCopies <= (book.lowStockThreshold ?? 2) ? `Only ${book.availableCopies} left` : 'Available'}
          </span>
        </div>
        {book.genre?.[0]?.name && <p className="mono genre-label">{book.genre[0].name}</p>}
        <h3>{book.title}</h3>
        <p className="author">{book.author}</p>
        <Stars value={book.avgRating} count={book.reviewCount} size={13} />
        <p className="price">Rs {book.pricePerDay}<span> / day</span></p>
      </Link>
    </article>
  );
}
