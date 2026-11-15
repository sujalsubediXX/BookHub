import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../../api.js';
import { Cover, Empty, Modal, Pagination, StatusBadge, fmtDate, money, useToast } from '../../components/ui.jsx';

const TABS = [['requests', 'New requests'], ['awaiting', 'Awaiting payment'], ['ready', 'To hand over'], ['active', 'With readers'], ['overdue', 'Overdue'], ['returned', 'Returned'], ['latefees', 'Late fees due'], ['refunds', 'Refunds'], ['closed', 'Closed']];
const METHOD = { esewa: 'eSewa', khalti: 'Khalti', cash: 'Cash' };

export default function Rentals() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const userId = params.get('userId') || undefined;
  const [view, setView] = useState(params.get('view') || 'requests');
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ data: [], total: 0, pages: 1, page: 1 });
  const [rejecting, setRejecting] = useState(null);
  const [reason, setReason] = useState('');

  const load = useCallback(() => {
    api.get('/rentals', { params: { view, userId, page, limit: 10 } }).then((r) => setRes(r.data)).catch((e) => toast(errMsg(e), 'err'));
  }, [view, userId, page]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => setPage(1), [view, userId]);

  const act = async (id, path, ok, body) => {
    try { await api.patch(`/rentals/${id}/${path}`, body); toast(ok); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };
  const doReject = async () => { await act(rejecting, 'reject', 'Request rejected', { reason }); setRejecting(null); setReason(''); };

  const Actions = ({ r }) => (
    <>
      {r.status === 'requested' && <><button className="btn sm primary" onClick={() => act(r._id, 'approve', 'Approved. The copy is now held for the reader')}>Approve</button><button className="btn sm" onClick={() => setRejecting(r._id)}>Reject</button></>}
      {r.status === 'approved' && <><button className="btn sm primary" onClick={() => confirm(`Mark ${money(r.total)} as received in cash?`) && act(r._id, 'mark-paid', 'Marked as paid')}>Mark paid (cash)</button><button className="btn sm danger" onClick={() => confirm('Cancel and release the copy?') && act(r._id, 'cancel', 'Cancelled')}>Cancel</button></>}
      {r.status === 'ready' && <><button className="btn sm primary" onClick={() => act(r._id, 'handover', `Handed over. Due in ${r.days} days`)}>{r.fulfilment === 'delivery' ? 'Mark delivered' : 'Hand over'}</button><button className="btn sm danger" onClick={() => confirm('Cancel? The payment will be flagged for refund.') && act(r._id, 'cancel', 'Cancelled')}>Cancel</button></>}
      {r.status === 'active' && <button className="btn sm primary" onClick={() => confirm(r.isOverdue ? `Overdue. Late fee ${money(r.currentLateFee)}. Mark returned?` : 'Mark as returned?') && act(r._id, 'return', 'Book returned')}>Mark returned</button>}
      {r.status === 'returned' && r.lateFee > 0 && !r.lateFeePaid && <button className="btn sm primary" onClick={() => act(r._id, 'collect-late-fee', 'Late fee collected')}>Collect {money(r.lateFee)}</button>}
      {r.payment?.status === 'refund_due' && <button className="btn sm" onClick={() => act(r._id, 'refunded', 'Marked as refunded')}>Mark refunded</button>}
    </>
  );

  return (
    <>
      <h1 className="page-title">Rentals</h1>
      {userId && <div className="alert info">Showing one customer's rentals. <button className="linkish" onClick={() => setParams({})}>Show everyone</button></div>}
      <div className="segmented wide-seg">{TABS.map(([k, l]) => <button key={k} className={view === k ? 'on' : ''} onClick={() => setView(k)}>{l}</button>)}</div>

      <section className="panel">
        {res.data.length === 0 ? <Empty title="Nothing here" hint="Rentals in this stage will appear here." /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Book</th><th>Reader</th><th>Rental</th><th>Dates</th><th>Status</th><th /></tr></thead>
            <tbody>{res.data.map((r) => (
              <tr key={r._id}>
                <td><div className="with-thumb"><span className="thumb">{r.book && <Cover book={r.book} />}</span><span><strong>{r.book?.title}</strong><small>{r.book?.author}</small></span></div></td>
                <td>{r.user?.name}<small>{r.user?.phone || r.user?.email}</small><small>{r.user?.membershipId}</small></td>
                <td>{r.days} days · <strong>{money(r.total)}</strong>
                  <small>{r.fulfilment === 'delivery' ? `Deliver to ${r.deliveryAddress}` : 'Pickup'}</small>
                  <small>{r.payment?.status === 'paid' ? `Paid via ${METHOD[r.payment.method]}` : r.payment?.method === 'cash' ? 'Will pay cash' : r.payment?.status === 'pending' ? 'Online payment pending' : r.payment?.status === 'refund_due' ? 'Refund due' : ''}</small></td>
                <td><small>Requested {fmtDate(r.createdAt)}</small>
                  {r.status === 'approved' && <small>Pay by {new Date(r.paymentDeadline).toLocaleString('en-GB', { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' })}</small>}
                  {r.dueDate && <small className={r.isOverdue ? 'bad-text' : ''}>Due {fmtDate(r.dueDate)}</small>}
                  {r.returnedAt && <small>Returned {fmtDate(r.returnedAt)}{r.lateFee > 0 ? ` · late fee ${money(r.lateFee)}${r.lateFeePaid ? ' paid' : ''}` : ''}</small>}
                  {r.status === 'rejected' && <small>{r.rejectionReason}</small>}</td>
                <td><StatusBadge staff status={r.isOverdue ? 'overdue' : r.status} /></td>
                <td className="actions"><Actions r={r} /></td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
        <Pagination page={res.page} pages={res.pages} total={res.total} onChange={setPage} />
      </section>

      {rejecting && (
        <Modal title="Reject request" onClose={() => setRejecting(null)}>
          <label>Reason shown to the reader<textarea rows="3" value={reason} onChange={(e) => setReason(e.target.value)} placeholder="e.g. This copy is reserved for a class" /></label>
          <div className="form-actions"><button className="btn" onClick={() => setRejecting(null)}>Back</button><button className="btn primary" onClick={doReject}>Reject request</button></div>
        </Modal>
      )}
    </>
  );
}
