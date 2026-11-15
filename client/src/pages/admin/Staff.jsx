import { useCallback, useEffect, useState } from 'react';
import api, { errMsg } from '../../api.js';
import { useAuth } from '../../context/AuthContext.jsx';
import { Icon, Modal, StatusBadge, fmtDate, useToast } from '../../components/ui.jsx';

const PERMS = [
  ['books', 'Books & inventory', 'Add and edit books, covers, prices and stock'],
  ['rentals', 'Rentals', 'Approve or reject requests, hand over and take back books, collect fees'],
  ['members', 'Customers', 'View customers and suspend or restore accounts'],
  ['reports', 'Reports', 'See revenue and analytics on the dashboard'],
];

function StaffForm({ person, onClose, onSaved }) {
  const toast = useToast();
  const [f, setF] = useState(person ? { name: person.name, phone: person.phone || '', permissions: person.permissions || [], password: '' } : { name: '', email: '', password: '', phone: '', permissions: ['books', 'rentals'] });
  const [busy, setBusy] = useState(false);
  const toggle = (p) => setF({ ...f, permissions: f.permissions.includes(p) ? f.permissions.filter((x) => x !== p) : [...f.permissions, p] });

  const submit = async (e) => {
    e.preventDefault();
    setBusy(true);
    try {
      const body = { ...f };
      if (person && !body.password) delete body.password;
      if (person) await api.put(`/staff/${person._id}`, body); else await api.post('/staff', body);
      toast(person ? 'Staff account updated' : 'Staff account created');
      onSaved();
    } catch (err) { toast(errMsg(err), 'err'); } finally { setBusy(false); }
  };

  return (
    <Modal title={person ? `Edit ${person.name}` : 'Add a staff account'} onClose={onClose}>
      <form onSubmit={submit} className="stack">
        <label>Full name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
        {!person && <label>Email<input type="email" required value={f.email} onChange={(e) => setF({ ...f, email: e.target.value })} /></label>}
        <label>{person ? 'Reset password (leave empty to keep)' : 'Temporary password'}<input type="password" minLength={6} required={!person} value={f.password} onChange={(e) => setF({ ...f, password: e.target.value })} autoComplete="new-password" /></label>
        <label>Phone<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
        <fieldset className="perm-list">
          <legend>What can they do?</legend>
          {PERMS.map(([k, t, d]) => (
            <label key={k} className="perm"><input type="checkbox" checked={f.permissions.includes(k)} onChange={() => toggle(k)} /><span><b>{t}</b><small>{d}</small></span></label>
          ))}
        </fieldset>
        <div className="form-actions"><button type="button" className="btn" onClick={onClose}>Cancel</button><button className="btn primary" disabled={busy}>{busy ? 'Saving…' : 'Save'}</button></div>
      </form>
    </Modal>
  );
}

export default function Staff() {
  const { user } = useAuth();
  const toast = useToast();
  const [list, setList] = useState([]);
  const [editing, setEditing] = useState(null);
  const load = useCallback(() => api.get('/staff').then((r) => setList(r.data.data)).catch((e) => toast(errMsg(e), 'err')), []);
  useEffect(() => { load(); }, [load]);

  const toggle = async (p) => {
    try { await api.put(`/staff/${p._id}`, { isActive: !p.isActive }); toast(p.isActive ? 'Account deactivated' : 'Account reactivated'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };
  const remove = async (p) => {
    if (!confirm(`Delete the account for ${p.name}?`)) return;
    try { await api.delete(`/staff/${p._id}`); toast('Account deleted'); load(); } catch (e) { toast(errMsg(e), 'err'); }
  };

  return (
    <>
      <div className="page-head"><h1 className="page-title">Staff & access</h1><button className="btn primary" onClick={() => setEditing('new')}><Icon name="plus" size={16} /> Add staff</button></div>
      <p className="muted lead">Admins can do everything. Staff accounts only get the areas you tick below.</p>
      <section className="panel">
        <div className="table-wrap"><table>
          <thead><tr><th>Name</th><th>Role</th><th>Access</th><th>Status</th><th>Added</th><th /></tr></thead>
          <tbody>{list.map((p) => (
            <tr key={p._id}>
              <td><strong>{p.name}</strong><small>{p.email}</small></td>
              <td className="cap">{p.role}</td>
              <td>{p.role === 'admin' ? <span className="muted">Everything</span> : p.permissions.length ? p.permissions.map((x) => <span key={x} className="chip-sm">{PERMS.find((q) => q[0] === x)?.[1]}</span>) : <span className="muted">No access yet</span>}</td>
              <td><StatusBadge status={p.isActive ? 'ready' : 'overdue'} label={p.isActive ? 'Active' : 'Deactivated'} /></td>
              <td>{fmtDate(p.createdAt)}</td>
              <td className="actions">
                {p.role === 'staff' && <>
                  <button className="btn sm" onClick={() => setEditing(p)}>Edit access</button>
                  <button className="btn sm" onClick={() => toggle(p)}>{p.isActive ? 'Deactivate' : 'Reactivate'}</button>
                  <button className="btn sm danger" onClick={() => remove(p)}>Delete</button>
                </>}
                {p._id === user._id && <span className="muted">You</span>}
              </td>
            </tr>
          ))}</tbody>
        </table></div>
      </section>
      {editing && <StaffForm person={editing === 'new' ? null : editing} onClose={() => setEditing(null)} onSaved={() => { setEditing(null); load(); }} />}
    </>
  );
}
