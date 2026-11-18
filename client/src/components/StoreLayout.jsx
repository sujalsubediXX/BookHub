import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import ThemePicker from './ThemePicker.jsx';
import { Icon } from './ui.jsx';

export default function StoreLayout() {
  const { user, logout, isStaff, isCustomer, wishlist } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const { pathname, hash } = useLocation();
  const [q, setQ] = useState('');
  const [picker, setPicker] = useState(false);
  const [menu, setMenu] = useState(false);

  // new page -> start at the top; "/#how" style links -> scroll to that section
  useEffect(() => {
    setMenu(false);
    if (hash) setTimeout(() => document.getElementById(hash.slice(1))?.scrollIntoView({ behavior: 'smooth' }), 60);
    else window.scrollTo(0, 0);
  }, [pathname, hash]);

  const search = (e) => {
    e.preventDefault();
    navigate(`/books${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ''}`);
  };

  return (
    <div className="store">
      <header className="store-head">
        <Link to="/" className="brand">
          <img className="brand-logo" src="/logo.png" alt="BookHub" />
          <strong>BookHub</strong>
        </Link>
        <button className="icon-btn menu-toggle" onClick={() => setMenu(!menu)} aria-label="Menu" aria-expanded={menu}><Icon name="menu" /></button>
        <div className={`head-body ${menu ? 'open' : ''}`}>
          <nav className="head-nav">
            <NavLink to="/" end>Home</NavLink>
            <NavLink to="/books">Browse</NavLink>
            <Link to="/#how">How it works</Link>
            {isCustomer && <NavLink to="/my-rentals">My rentals</NavLink>}
            {isCustomer && <NavLink to="/wishlist">Wishlist{wishlist.length > 0 && <em>{wishlist.length}</em>}</NavLink>}
            {isStaff && <NavLink to="/admin">Admin panel</NavLink>}
          </nav>
          <form className="head-search" onSubmit={search} role="search">
            <Icon name="search" size={16} />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search the catalog" aria-label="Search books" />
          </form>
          <div className="head-actions">
            <button className="btn sm" onClick={() => setPicker(true)} aria-label="Change theme"><Icon name="palette" size={16} /> <span className="hide-sm">{theme.name}</span></button>
            {user ? (
              <>
                <Link to="/profile" className="avatar" title={user.name}>{user.name[0]}</Link>
                <button className="btn ghost sm" onClick={() => { logout(); navigate('/'); }}>Log out</button>
              </>
            ) : (
              <>
                <Link to="/login" className="btn sm">Log in</Link>
                <Link to="/register" className="btn primary sm">Sign up</Link>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="store-main"><Outlet /></main>

      <footer className="site-foot">
        <div className="foot-grid">
          <div>
            <Link to="/" className="brand"><span className="brand-mark">BH</span><strong>BookHub</strong></Link>
            <p>An online reading room. Rent a book for a few days, pay online, and return it when you are done.</p>
          </div>
          <div>
            <h4 className="mono">Explore</h4>
            <Link to="/">Home</Link><Link to="/books">Browse the catalog</Link><Link to="/#how">How renting works</Link>
          </div>
          <div>
            <h4 className="mono">Your account</h4>
            {user ? <>{isCustomer && <><Link to="/my-rentals">My rentals</Link><Link to="/wishlist">Wishlist</Link></>}<Link to="/profile">Profile</Link></> : <><Link to="/login">Log in</Link><Link to="/register">Create an account</Link></>}
          </div>
        </div>
        <div className="foot-base mono">© {new Date().getFullYear()} BookHub</div>
      </footer>
      {picker && <ThemePicker onClose={() => setPicker(false)} />}
    </div>
  );
}
