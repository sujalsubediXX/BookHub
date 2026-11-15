import { useEffect, useState } from 'react';
import api from '../api.js';
import BookCard from '../components/BookCard.jsx';
import { Empty } from '../components/ui.jsx';
import { Link } from 'react-router-dom';

export default function Wishlist() {
  const [books, setBooks] = useState(null);
  const load = () => api.get('/wishlist').then((r) => setBooks(r.data.data));
  useEffect(() => { load(); }, []);
  if (!books) return <div className="splash">Loading…</div>;
  return (
    <>
      <h1 className="page-title">Wishlist</h1>
      {books.length === 0 ? <Empty title="Nothing saved yet" hint="Tap the heart on any book to keep it here." /> : (
        <div className="book-grid">{books.map((b) => <BookCard key={b._id} book={b} onWishlistChange={load} />)}</div>
      )}
      {books.length === 0 && <p className="center"><Link to="/books" className="btn primary">Browse books</Link></p>}
    </>
  );
}
