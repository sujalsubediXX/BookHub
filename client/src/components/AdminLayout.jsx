import { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation, useNavigate } from 'react-router-dom';
import api from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { useTheme } from '../context/ThemeContext.jsx';
import ThemePicker from './ThemePicker.jsx';
import { Icon } from './ui.jsx';

export default function AdminLayout() {
  const { user, logout, can, isAdmin } = useAuth();
  const { theme } = useTheme();
  const navigate = useNavigate();
  const loc = useLocation();
  const [open, setOpen] = useState(false);
  const [picker, setPicker] = useState(false);
  const [counts, setCounts] = useState({ pending: 0, lowStock: 0 });

  useEffect(() => {
    api.get('/admin/counts').then((r) => setCounts(r.data)).catch(() => {});
  }, [loc.pathname]);

  const nav = [
    { to: '/admin', label: 'Dashboard', icon: 'dashboard', end: true },
    can('rentals') && { to: '/admin/rentals', label: 'Rentals', icon: 'clipboard', badge: counts.pending },
    can('books') && { to: '/admin/books', label: 'Books', icon: 'books' },
    can('books') && { to: '/admin/genres', label: 'Genres', icon: 'tag' },
    can('books') && { to: '/admin/inventory', label: 'Inventory', icon: 'box', badge: counts.lowStock, warn: true },
    can('members') && { to: '/admin/customers', label: 'Customers', icon: 'members' },
    isAdmin && { to: '/admin/staff', label: 'Staff & access', icon: 'shield' },
    { to: '/admin/profile', label: 'My account', icon: 'profile' },
  ].filter(Boolean);

  return (
    <div className="shell">
      <aside className={`sidebar ${open ? 'open' : ''}`}>
        <div className="brand">
          <span className="brand-mark">BH</span>
          <div><strong>BookHub</strong><small>Admin panel</small></div>
        </div>
        <nav onClick={() => setOpen(false)}>
          {nav.map((n) => (
            <NavLink key={n.to} to={n.to} end={n.end}>
              <Icon name={n.icon} /> {n.label}
              {n.badge > 0 && <em className={`nav-badge ${n.warn ? 'warn' : ''}`}>{n.badge}</em>}
            </NavLink>
          ))}
          <Link to="/" className="store-link"><Icon name="store" /> View storefront</Link>
        </nav>
        <div className="sidebar-foot">
          <div className="me">
            <span className="avatar">{user.name[0]}</span>
            <div><strong>{user.name}</strong><small>{user.role}</small></div>
          </div>
          <button className="btn ghost sm" onClick={() => { logout(); navigate('/login'); }}><Icon name="logout" size={16} /> Log out</button>
        </div>
      </aside>
      {open && <div className="scrim" onClick={() => setOpen(false)} />}
      <div className="content">
        <header className="topbar">
          <button className="icon-btn menu-btn" onClick={() => setOpen(true)} aria-label="Open menu"><Icon name="menu" /></button>
          <span className="spacer" />
          <button className="btn sm" onClick={() => setPicker(true)}><Icon name="palette" size={16} /> {theme.name}</button>
        </header>
        <main><Outlet /></main>
      </div>
      {picker && <ThemePicker onClose={() => setPicker(false)} />}
    </div>
  );
}
