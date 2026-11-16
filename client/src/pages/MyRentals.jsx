import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { Cover, Empty, Modal, StatusBadge, fmtDate, money, useToast } from '../components/ui.jsx';

const STEPS = ['Requested', 'Approved', 'Paid', 'Collected', 'Returned'];
const STEP_OF = { requested: 0, approved: 1, ready: 2, active: 3, returned: 4 };
const OPEN = ['requested', 'approved', 'ready', 'active'];
const daysBetween = (a, b) => Math.ceil((new Date(a) - new Date(b)) / 86400000);

function PayModal({ rental, onClose, onDone }) {
  const toast = useToast();
  const [method, setMethod] = useState('esewa');
  const [busy, setBusy] = useState(false);

  const pay = async () => {
    setBusy(true);
    try {
      const { data } = await api.post(`/rentals/${rental._id}/pay`, { method });
      if (data.method === 'cash') { toast(data.message); return onDone(); }
      if (data.method === 'khalti') { window.location.href = data.url; return; }
      // eSewa wants a signed form POST
      const form = document.createElement('form');
      form.method = 'POST';
      form.action = data.url;
      Object.entries(data.fields).forEach(([k, v]) => {
        const i = document.createElement('input');
        i.type = 'hidden'; i.name = k; i.value = v;
        form.appendChild(i);
      });
      document.body.appendChild(form);
      form.submit();
    } catch (err) { toast(errMsg(err), 'err'); setBusy(false); }
  };

  const options = [['esewa', 'eSewa', 'Pay with your eSewa wallet'], ['khalti', 'Khalti', 'Pay with Khalti'], ['cash', 'Pay at the counter', 'Cash at the library before the deadline']];
  return (
    <Modal title={`Pay ${money(rental.total)}`} onClose={onClose}>
      <p className="muted">{rental.book?.title} · {rental.days} days{rental.fulfilment === 'delivery' ? ' · delivery' : ''}</p>
      <fieldset className="radio-cards stack-cards">
        {options.map(([v, t, d]) => (
          <label key={v} className={method === v ? 'on' : ''}><input type="radio" name="m" checked={method === v} onChange={() => setMethod(v)} /><b>{t}</b><span>{d}</span></label>
        ))}
      </fieldset>
      <div className="form-actions"><button className="btn" onClick={onClose}>Not now</button><button className="btn primary" onClick={pay} disabled={busy}>{busy ? 'Opening…' : method === 'cash' ? 'Confirm' : `Continue to ${method === 'esewa' ? 'eSewa' : 'Khalti'}`}</button></div>
    </Modal>
  );
}

function RentalCard({ r, reload }) {
  const toast = useToast();
  const [paying, setPaying] = useState(false);
  const step = STEP_OF[r.status];
  const act = async (fn, ok) => { try { await fn(); toast(ok); reload(); } catch (e) { toast(errMsg(e), 'err'); } };

  let dueLine = null;
  if (r.status === 'active') {
    const left = daysBetween(r.dueDate, new Date());
    dueLine = r.isOverdue
      ? <p className="due bad">Overdue by {Math.abs(left)} day{Math.abs(left) !== 1 ? 's' : ''}. Late fee so far {money(r.currentLateFee)}</p>
      : <p className={`due ${left <= 2 ? 'soon' : ''}`}>Due {fmtDate(r.dueDate)} · {left <= 0 ? 'due today' : `${left} day${left !== 1 ? 's' : ''} left`}</p>;
  }
  if (r.status === 'returned') dueLine = <p className="due">Returned {fmtDate(r.returnedAt)}{r.lateFee > 0 ? ` · late fee ${money(r.lateFee)} ${r.lateFeePaid ? '(paid)' : '(unpaid, please pay at the library)'}` : ''}</p>;

  return (
    <article className="rental">
      <Link to={`/books/${r.book?._id}`} className="rental-cover">{r.book && <Cover book={r.book} />}</Link>
      <div className="rental-body">
        <header>
          <div><h3><Link to={`/books/${r.book?._id}`}>{r.book?.title}</Link></h3><small>{r.book?.author}</small></div>
          <StatusBadge status={r.isOverdue ? 'overdue' : r.status} />
        </header>

        {step !== undefined && (
          <ol className="tracker" aria-label="Rental progress">
            {STEPS.map((s, i) => <li key={s} className={i < step ? 'done' : i === step ? 'now' : ''}><i />{s}</li>)}
          </ol>
        )}

        <p className="meta">{r.days} days · {money(r.total)} · {r.fulfilment === 'delivery' ? `Delivery to ${r.deliveryAddress}` : 'Pickup at library'} · requested {fmtDate(r.createdAt)}</p>
        {dueLine}
        {r.status === 'requested' && <p className="note">Waiting for the library to approve your request.</p>}
        {r.status === 'approved' && <p className="note warn">Approved. Pay by {new Date(r.paymentDeadline).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })} or the copy goes back on the shelf.{r.payment?.method === 'cash' ? ' You chose to pay at the counter.' : ''}{r.payment?.status === 'pending' ? ' An online payment is in progress.' : ''}{r.payment?.status === 'failed' ? ' Your last payment did not go through.' : ''}</p>}
        {r.status === 'ready' && <p className="note ok">Paid. {r.fulfilment === 'delivery' ? 'Your book will be delivered soon.' : 'Collect your book from the library counter.'} The due date starts when you receive it.</p>}
        {r.status === 'rejected' && <p className="note bad">{r.rejectionReason}</p>}
        {r.status === 'expired' && <p className="note">The payment window closed, so this request expired. You can request the book again.</p>}
        {r.payment?.status === 'refund_due' && <p className="note warn">A refund of {money(r.total)} is being processed by the library.</p>}
        {r.payment?.status === 'refunded' && <p className="note">Refunded.</p>}

        <footer>
          {r.status === 'approved' && <button className="btn primary sm" onClick={() => setPaying(true)}>Pay now</button>}
          {r.status === 'approved' && r.payment?.status === 'pending' && <button className="btn sm" onClick={() => act(async () => { const { data } = await api.post(`/rentals/${r._id}/verify-payment`); if (data.result !== 'paid') throw new Error('Not paid yet'); }, 'Payment confirmed')}>I already paid, check status</button>}
          {['requested', 'approved'].includes(r.status) && <button className="btn sm danger" onClick={() => confirm('Cancel this rental?') && act(() => api.patch(`/rentals/${r._id}/cancel`), 'Rental cancelled')}>Cancel</button>}
        </footer>
      </div>
      {paying && <PayModal rental={r} onClose={() => setPaying(false)} onDone={() => { setPaying(false); reload(); }} />}
    </article>
  );
}

export default function MyRentals() {
  const { wishlist } = useAuth();
  const toast = useToast();
  const [tab, setTab] = useState('current');
  const [rentals, setRentals] = useState(null);
  const load = useCallback(() => api.get('/rentals/my').then((r) => setRentals(r.data.data)).catch((e) => toast(errMsg(e), 'err')), []);
  useEffect(() => { load(); }, [load]);

  if (!rentals) return <div className="splash">Loading…</div>;
  const current = rentals.filter((r) => OPEN.includes(r.status));
  const history = rentals.filter((r) => !OPEN.includes(r.status));
  const list = tab === 'current' ? current : history;
  const dueSoon = current.filter((r) => r.status === 'active');

  return (
    <>
      <section className="reader-hero">
        <div>
          <p className="eyebrow">Your reading room</p>
          <h1>My rentals</h1>
          <p>Everything you are reading, waiting for, or ready to return.</p>
        </div>
        <div className="reader-actions"><Link to="/books" className="btn primary">Find your next book</Link><Link to="/wishlist" className="btn">Saved books {wishlist.length > 0 && `(${wishlist.length})`}</Link></div>
      </section>
      <section className="reading-pulse" aria-label="Reading summary">
        <div><b>{current.length}</b><span>open rentals</span></div>
        <div className={dueSoon.some((r) => r.isOverdue) ? 'alert-stat' : ''}><b>{dueSoon.filter((r) => r.isOverdue).length}</b><span>need attention</span></div>
        <div><b>{history.length}</b><span>in your history</span></div>
        <div><b>{wishlist.length}</b><span>saved for later</span></div>
      </section>
      {dueSoon.some((r) => r.isOverdue) && <div className="alert">You have an overdue book. Please return it to avoid more late fees and to rent again.</div>}
      <div className="segmented wide-seg">
        <button className={tab === 'current' ? 'on' : ''} onClick={() => setTab('current')}>Current ({current.length})</button>
        <button className={tab === 'history' ? 'on' : ''} onClick={() => setTab('history')}>History ({history.length})</button>
      </div>
      {list.length === 0 ? (
        <Empty title={tab === 'current' ? 'No open rentals' : 'No past rentals'} hint={tab === 'current' ? 'Find something to read and request it.' : ''} />
      ) : (
        <div className="rental-list">{list.map((r) => <RentalCard key={r._id} r={r} reload={load} />)}</div>
      )}
      {tab === 'current' && current.length === 0 && <p className="center"><Link to="/books" className="btn primary">Browse books</Link></p>}
    </>
  );
}
