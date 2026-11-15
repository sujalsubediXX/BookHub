import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import api, { errMsg } from '../../api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Empty, Icon, Pagination, StatusBadge, fmtDate, useDebounce, useToast } from '../../components/ui.jsx';

export default function Customers() {
  const { isAdmin, can } = useAuth();
  const toast = useToast();
  const [q, setQ] = useState('');
  const [page, setPage] = useState(1);
  const [res, setRes] = useState({ data: [], total: 0, pages: 1, page: 1 });
  const dq = useDebounce(q);

  const load = useCallback(() => {
    api.get('/customers', { params: { q: dq, page, limit: 10 } }).then((r) => setRes(r.data)).catch((e) => toast(errMsg(e), 'err'));
  }, [dq, page]);
  useEffect(() => { load(); }, [load]);
  useEffect(() => setPage(1), [dq]);

  const toggle = async (u) => {
    if (u.isActive && !confirm(`Suspend ${u.name}? They will not be able to log in.`)) return;
    try { await api.put(`/customers/${u._id}`, { isActive: !u.isActive }); toast(u.isActive ? 'Customer suspended' : 'Customer restored'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };
  const remove = async (u) => {
    if (!confirm(`Delete ${u.name}? This cannot be undone.`)) return;
    try { await api.delete(`/customers/${u._id}`); toast('Customer deleted'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <>
      <h1 className="page-title">Customers</h1>
      <div className="toolbar"><div className="search"><Icon name="search" size={16} /><input placeholder="Search name, email, phone, member ID…" value={q} onChange={(e) => setQ(e.target.value)} /></div></div>
      <section className="panel">
        {res.data.length === 0 ? <Empty title="No customers found" /> : (
          <div className="table-wrap"><table>
            <thead><tr><th>Customer</th><th>Member ID</th><th>Phone</th><th>Status</th><th>Joined</th><th /></tr></thead>
            <tbody>{res.data.map((u) => (
              <tr key={u._id}>
                <td><strong>{u.name}</strong><small>{u.email}</small></td>
                <td>{u.membershipId}</td>
                <td>{u.phone || '—'}</td>
                <td><StatusBadge status={u.isActive ? 'ready' : 'overdue'} label={u.isActive ? 'Active' : 'Suspended'} /></td>
                <td>{fmtDate(u.createdAt)}</td>
                <td className="actions">
                  {can('rentals') && <Link className="btn sm" to={`/admin/rentals?userId=${u._id}&view=returned`}>Rentals</Link>}
                  <button className="btn sm" onClick={() => toggle(u)}>{u.isActive ? 'Suspend' : 'Restore'}</button>
                  {isAdmin && <button className="btn sm danger" onClick={() => remove(u)}>Delete</button>}
                </td>
              </tr>
            ))}</tbody>
          </table></div>
        )}
        <Pagination page={res.page} pages={res.pages} total={res.total} onChange={setPage} />
      </section>
    </>
  );
}
