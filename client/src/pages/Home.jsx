import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import BookCard from '../components/BookCard.jsx';
import { Cover, Icon } from '../components/ui.jsx';

const STEPS = [
  ['01', 'Pick a book', 'Search the catalog or browse by genre. See the cover, rating, reviews and how many copies are on the shelf.'],
  ['02', 'Send a request', 'Choose how many days you need and whether you will collect it or have it delivered.'],
  ['03', 'Pay once approved', 'The library approves your request and holds a copy for you. Pay with eSewa, Khalti or cash at the counter.'],
  ['04', 'Read and return', 'Your due date starts when you receive the book. Track it from your account and return it on time.'],
];

export default function Home() {
  const { user, isStaff, isCustomer } = useAuth();
  const navigate = useNavigate();
  const [q, setQ] = useState('');
  const [genres, setGenres] = useState([]);
  const [facets, setFacets] = useState({ price: { min: 0 }, titles: 0, rules: {} });
  const [featured, setFeatured] = useState([]);
  const [genre, setGenre] = useState('');
  const [books, setBooks] = useState([]);
  const [busy, setBusy] = useState(true);
  const [top, setTop] = useState([]);

  useEffect(() => {
    api.get('/genres').then((r) => setGenres(r.data.data));
    api.get('/books/facets').then((r) => setFacets(r.data));
    api.get('/books', { params: { sort: 'newest', limit: 3 } }).then((r) => setFeatured(r.data.data));
    api.get('/books', { params: { sort: 'rating', minRating: 1, limit: 4 } }).then((r) => setTop(r.data.data));
  }, []);

  useEffect(() => {
    setBusy(true);
    api.get('/books', { params: { genre: genre || undefined, sort: 'newest', limit: 8 } })
      .then((r) => setBooks(r.data.data)).finally(() => setBusy(false));
  }, [genre]);

  const R = facets.rules || {};

  return (
    <>
      {/* ---------- hero ---------- */}
      <section className="hero">
        <div className="hero-copy">
          <p className="eyebrow">Pustakalaya · online reading room</p>
          <h1 className="display">Rent a book.<br />Read it. Return it.</h1>
          <p className="lead-text">Browse the shelves from home, ask for a book for as many days as you need, and collect it from the library or have it delivered.</p>
          <form onSubmit={(e) => { e.preventDefault(); navigate(`/books?q=${encodeURIComponent(q)}`); }} className="hero-search" role="search">
            <Icon name="search" size={18} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search by title, author or ISBN" aria-label="Search books" />
            <button className="btn primary">Search</button>
          </form>
          <div className="hero-cta">
            <Link to="/books" className="btn">Browse the collection</Link>
            <a href="#how" className="linkish">How renting works →</a>
          </div>
        </div>
        <div className="fan" aria-hidden={featured.length === 0}>
          {featured.length > 0 ? featured.map((b, i) => (
            <Link key={b._id} to={`/books/${b._id}`} className={`fan-${i}`} aria-label={b.title}><Cover book={b} /></Link>
          )) : [62, 88, 74, 100, 68, 92, 80].map((h, i) => <i key={i} className="spine" style={{ height: `${h}%` }} />)}
        </div>
      </section>

      {/* ---------- numbers ---------- */}
      <section className="stat-strip">
        <div><b>{facets.titles}</b><span className="mono">titles to rent</span></div>
        <div><b>{genres.length}</b><span className="mono">genres</span></div>
        <div><b>Rs {facets.price.min}</b><span className="mono">from, per day</span></div>
        <div><b>Pickup or delivery</b><span className="mono">you choose</span></div>
      </section>

      {/* ---------- browse the collection ---------- */}
      <section className="block" id="collection">
        <header className="block-head">
          <div>
            <p className="eyebrow">The open shelves</p>
            <h2 className="display">Browse the collection</h2>
          </div>
          <Link to={genre ? `/books?genre=${genre}` : '/books'} className="btn">View the full catalog</Link>
        </header>

        <div className="genre-tabs" role="group" aria-label="Filter by genre">
          <button className={!genre ? 'on' : ''} onClick={() => setGenre('')}>All</button>
          {genres.map((g) => (
            <button key={g._id} className={genre === g._id ? 'on' : ''} onClick={() => setGenre(g._id)} disabled={g.count === 0}>
              {g.name} <small>{g.count}</small>
            </button>
          ))}
        </div>

        {busy && books.length === 0 ? <div className="splash">Loading…</div> : books.length === 0 ? (
          <p className="muted pad">No books in this genre yet.</p>
        ) : (
          <div className="book-grid">{books.map((b) => <BookCard key={b._id} book={b} />)}</div>
        )}
      </section>

      {/* ---------- favourites ---------- */}
      {top.length > 0 && (
        <section className="block">
          <header className="block-head">
            <div><p className="eyebrow">From our readers</p><h2 className="display">Highest rated</h2></div>
            <Link to="/books?sort=rating" className="btn">See all rated books</Link>
          </header>
          <div className="book-grid">{top.map((b) => <BookCard key={b._id} book={b} />)}</div>
        </section>
      )}

      {/* ---------- how it works ---------- */}
      <section className="block" id="how">
        <header className="block-head"><div><p className="eyebrow">Simple and fair</p><h2 className="display">How renting works</h2></div></header>
        <ol className="how-grid">
          {STEPS.map(([n, t, d]) => <li key={n}><span className="mono">{n}</span><h3>{t}</h3><p>{d}</p></li>)}
        </ol>
        <div className="terms">
          <div><h4>Pickup</h4><p>Collect from the library counter at no extra cost.</p></div>
          <div><h4>Delivery</h4><p>Have the book brought to you for Rs {R.deliveryFee ?? 100}.</p></div>
          <div><h4>Pay your way</h4><p>eSewa, Khalti, or cash at the counter. You have {R.payWindowHours ?? 48} hours to pay after approval.</p></div>
          <div><h4>Rent up to {R.maxDays ?? 30} days</h4><p>Late returns cost Rs {R.lateFeePerDay ?? 10} per day, so return on time.</p></div>
        </div>
      </section>

      {/* ---------- call to action ---------- */}
      <section className="cta-band">
        {isStaff ? (
          <><div><h2 className="display">Manage the shop</h2><p>Approve requests, update stock and see how the library is doing.</p></div><Link to="/admin" className="btn primary">Open the admin panel</Link></>
        ) : isCustomer ? (
          <><div><h2 className="display">Welcome back, {user.name.split(' ')[0]}</h2><p>Check your due dates or find your next read.</p></div><Link to="/my-rentals" className="btn primary">My rentals</Link></>
        ) : (
          <><div><h2 className="display">Ready for your next read?</h2><p>Create a free account, then request any book in the catalog.</p></div><div className="cta-actions"><Link to="/register" className="btn primary">Create an account</Link><Link to="/books" className="btn">Browse first</Link></div></>
        )}
      </section>
    </>
  );
}
