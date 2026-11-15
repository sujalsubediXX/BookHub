import { useCallback, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import api, { errMsg } from '../../api.js';
import { Cover, Empty, Icon, Pagination, useDebounce, useToast } from '../../components/ui.jsx';

export default function Inventory() {
  const toast = useToast();
  const [params, setParams] = useSearchParams();
  const filter = params.get('filter') || 'all';
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ data: [], total: 0, pages: 1, page: 1 });
  const dq = useDebounce(q);

  const load = useCallback(() => {
    api.get('/books/inventory', { params: { filter, q: dq, page, limit: 15 } }).then((r) => setRes(r.data)).catch((e) => toast(errMsg(e), 'err'));
  }, [filter, dq, page]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => setPage(1), [filter, dq]);

  const adjust = async (b, delta) => {
    try { await api.patch(`/books/${b._id}/stock`, { delta }); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };
  const saveThreshold = async (b, v) => {
    if (Number(v) === b.lowStockThreshold || v === '') return;
    try { await api.put(`/books/${b._id}`, { lowStockThreshold: Number(v) }); toast('Alert level saved'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <>
      <h1 className="page-title">Inventory</h1>
      <div className="toolbar">
        <div className="segmented">
          {[['all', 'All'], ['low', 'Low stock'], ['out', 'Out of stock']].map(([k, l]) => <button key={k} className={filter === k ? 'on' : ''} onClick={() => setParams(k === 'all' ? {} : { filter: k })}>{l}</button>)}
        </div>
        <div className="search"><Icon name="search" size={16} /><input placeholder="Search title or author…" value={q} onChange={(e) => setQ(e.target.value)} /></div>
      </div>
      <section className="panel">
        {res.data.length === 0 ? <Empty title="Nothing to show" hint={filter === 'all' ? 'Add books first.' : 'No titles match this stock level.'} /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Book</th><th>On shelf</th><th>Out with readers</th><th>Total</th><th>Alert at</th><th>Status</th><th>Adjust stock</th></tr></thead>
            <tbody>{res.data.map((b) => {
              const out = b.availableCopies === 0, low = b.availableCopies <= b.lowStockThreshold;
              return (
                <tr key={b._id}>
                  <td><div className="with-thumb"><span className="thumb"><Cover book={b} /></span><span><strong>{b.title}</strong><small>{b.shelf ? `Shelf ${b.shelf}` : b.author}</small></span></div></td>
                  <td><strong>{b.availableCopies}</strong></td>
                  <td>{b.totalCopies - b.availableCopies}</td>
                  <td>{b.totalCopies}</td>
                  <td><input className="mini" type="number" min="0" defaultValue={b.lowStockThreshold} key={`${b._id}-${b.lowStockThreshold}`} onBlur={(e) => saveThreshold(b, e.target.value)} aria-label={`Low stock alert for ${b.title}`} /></td>
                  <td><span className={`badge ${out ? 'overdue' : low ? 'pending' : 'ready'}`}>{out ? 'Out of stock' : low ? 'Low' : 'OK'}</span></td>
                  <td className="actions"><button className="btn sm" onClick={() => adjust(b, -1)} aria-label="Remove one copy">−1</button><button className="btn sm" onClick={() => adjust(b, 1)} aria-label="Add one copy">+1</button><button className="btn sm" onClick={() => adjust(b, 5)} aria-label="Add five copies">+5</button></td>
                </tr>
              );
            })}</tbody>
          </table></div>
        )}
        <Pagination page={res.page} pages={res.pages} total={res.total} onChange={setPage} />
      </section>
    </>
  );
}
