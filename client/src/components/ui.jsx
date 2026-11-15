import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { fileUrl } from '../api.js';

/* ---------- toasts ---------- */
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [items, setItems] = useState([]);
  const push = useCallback((message, type = 'ok') => {
    const id = Math.random().toString(36).slice(2);
    setItems((i) => [...i, { id, message, type }]);
    setTimeout(() => setItems((i) => i.filter((x) => x.id !== id)), 4000);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {items.map((t) => (
          <div key={t.id} className={`toast ${t.type}`}>{t.message}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}

/* ---------- modal ---------- */
export function Modal({ title, onClose, children, wide }) {
  useEffect(() => {
    const onKey = (e) => e.key === 'Escape' && onClose();
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  return (
    <div className="overlay" onMouseDown={(e) => e.target === e.currentTarget && onClose()}>
      <div className={`modal ${wide ? 'wide' : ''}`} role="dialog" aria-modal="true" aria-label={title}>
        <header>
          <h2>{title}</h2>
          <button className="icon-btn" onClick={onClose} aria-label="Close">
            <Icon name="close" />
          </button>
        </header>
        <div className="modal-body">{children}</div>
      </div>
    </div>
  );
}

/* ---------- small pieces ---------- */
export function Pagination({ page, pages, total, onChange }) {
  return (
    <div className="pager">
      <span>{total} {total === 1 ? 'result' : 'results'}</span>
      {pages > 1 && (
        <div>
          <button className="btn sm" disabled={page <= 1} onClick={() => onChange(page - 1)}>Previous</button>
          <span className="pager-count">Page {page} of {pages}</span>
          <button className="btn sm" disabled={page >= pages} onClick={() => onChange(page + 1)}>Next</button>
        </div>
      )}
    </div>
  );
}

const LABELS = {
  requested: 'Awaiting approval', approved: 'Approved, pay now', ready: 'Ready to collect', active: 'With you', returned: 'Returned',
  rejected: 'Rejected', cancelled: 'Cancelled', expired: 'Expired', overdue: 'Overdue',
  unpaid: 'Unpaid', pending: 'Payment pending', paid: 'Paid', failed: 'Payment failed', refund_due: 'Refund due', refunded: 'Refunded',
};
const STAFF_LABELS = { approved: 'Awaiting payment', ready: 'Paid, to hand over', active: 'With reader' };
export const StatusBadge = ({ status, staff, label }) => (
  <span className={`badge ${status}`}>{label || (staff && STAFF_LABELS[status]) || LABELS[status] || status}</span>
);

export const Empty = ({ title, hint }) => (
  <div className="empty">
    <strong>{title}</strong>
    {hint && <p>{hint}</p>}
  </div>
);

export function useDebounce(value, delay = 350) {
  const [v, setV] = useState(value);
  useEffect(() => {
    const t = setTimeout(() => setV(value), delay);
    return () => clearTimeout(t);
  }, [value, delay]);
  return v;
}

export const fmtDate = (d) =>
  d ? new Date(d).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: 'numeric' }) : '—';
export const money = (n) => `Rs ${Number(n || 0).toLocaleString('en-IN')}`;

/* ---------- icons ---------- */
const PATHS = {
  dashboard: 'M3 3h8v8H3zM13 3h8v5h-8zM13 10h8v11h-8zM3 13h8v8H3z',
  books: 'M4 4h5v16H4zM11 4h5v16h-5zM18 6.2l3 .8-3.6 13-3-.8z',
  loans: 'M7 8h12l-3-3M17 16H5l3 3',
  reserve: 'M6 3h12v18l-6-4-6 4z',
  members: 'M9 11a4 4 0 100-8 4 4 0 000 8zM2 21c0-4 3-7 7-7s7 3 7 7M17 4a4 4 0 010 7M19 14c2 1 3 3.5 3 7',
  profile: 'M12 11a4 4 0 100-8 4 4 0 000 8zM4 21c0-4.5 3.5-7 8-7s8 2.5 8 7',
  palette: 'M12 3a9 9 0 100 18c1.6 0 2-1 1.5-2s0-2 1.6-2H18a3 3 0 003-3c0-6-4-11-9-11z',
  menu: 'M4 6h16M4 12h16M4 18h16',
  logout: 'M9 4H5v16h4M16 8l4 4-4 4M20 12H9',
  close: 'M6 6l12 12M18 6L6 18',
  search: 'M11 18a7 7 0 100-14 7 7 0 000 14zM20 20l-4-4',
  plus: 'M12 5v14M5 12h14',
  heart: 'M12 21s-7-4.5-9.5-9A5.5 5.5 0 0112 6a5.5 5.5 0 019.5 6c-2.5 4.5-9.5 9-9.5 9z',
  store: 'M3 9l1.5-5h15L21 9M3 9v11h18V9M3 9h18M9 20v-6h6v6',
  box: 'M21 8l-9-5-9 5v8l9 5 9-5zM3 8l9 5 9-5M12 13v8',
  shield: 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z',
  clipboard: 'M9 4h6v3H9zM7 5H5v16h14V5h-2M9 12h6M9 16h4',
  chart: 'M4 20V10M10 20V4M16 20v-7M22 20H2',
  tag: 'M3 12V3h9l9 9-9 9zM7.5 7.5h.01',
};
export const Icon = ({ name, size = 18 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
    <path d={PATHS[name]} />
  </svg>
);

/* ---------- ratings & covers ---------- */
export const Stars = ({ value = 0, count, size = 15 }) => (
  <span className="stars" title={`${value} out of 5`}>
    {[1, 2, 3, 4, 5].map((i) => (
      <svg key={i} width={size} height={size} viewBox="0 0 24 24" className={i <= Math.round(value) ? 'on' : ''} aria-hidden="true">
        <path d="M12 2.5l2.9 6 6.6.9-4.8 4.6 1.2 6.5L12 17.4l-5.9 3.1 1.2-6.5L2.5 9.4l6.6-.9z" />
      </svg>
    ))}
    {count !== undefined && <small>{value ? value.toFixed(1) : 'No ratings'}{count ? ` (${count})` : ''}</small>}
  </span>
);
const imglink = "http://localhost:5000/uploads/";
export function Cover({ book, className = '' }) {
  const [bad, setBad] = useState(false);
  const src = fileUrl(book.image);
  return src && !bad ? (
    <img className={`cover-img ${className}`} src={imglink + book.image} alt={`Cover of ${book.title}`} loading="lazy" onError={() => setBad(true)} />
  ) : (
    <div className={`cover-img ph ${className}`} aria-label={`No cover for ${book.title}`}><span>{book.title}</span></div>
  );
}
