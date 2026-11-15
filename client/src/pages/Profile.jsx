import { useState } from 'react';
import api, { errMsg } from '../api.js';
import { useAuth } from '../context/AuthContext.jsx';
import { fmtDate, useToast } from '../components/ui.jsx';

export default function Profile() {
  const { user, setUser } = useAuth();
  const toast = useToast();
  const [f, setF] = useState({ name: user.name, phone: user.phone || '', address: user.address || '' });
  const [p, setP] = useState({ currentPassword: '', newPassword: '' });

  const save = async (e) => {
    e.preventDefault();
    try { const r = await api.put('/auth/me', f); setUser(r.data.user); toast('Profile saved'); } catch (err) { toast(errMsg(err), 'err'); }
  };
  const changePw = async (e) => {
    e.preventDefault();
    try { await api.put('/auth/password', p); setP({ currentPassword: '', newPassword: '' }); toast('Password changed'); } catch (err) { toast(errMsg(err), 'err'); }
  };

  return (
    <>
      <h1 className="page-title">My account</h1>
      <div className="grid-2">
        <section className="panel pad">
          <div className="idcard">
            <span className="avatar lg">{user.name[0]}</span>
            <div><strong>{user.name}</strong><small>{user.email}</small><small className="cap">{user.role} · since {fmtDate(user.createdAt)}</small></div>
            <code>{user.membershipId}</code>
          </div>
          <form onSubmit={save} className="stack">
            <label>Full name<input required value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} /></label>
            <label>Phone<input value={f.phone} onChange={(e) => setF({ ...f, phone: e.target.value })} /></label>
            <label>Default delivery address<input value={f.address} onChange={(e) => setF({ ...f, address: e.target.value })} /></label>
            <div className="form-actions"><button className="btn primary">Save changes</button></div>
          </form>
        </section>
        <section className="panel pad">
          <h2>Change password</h2>
          <form onSubmit={changePw} className="stack">
            <label>Current password<input type="password" required value={p.currentPassword} onChange={(e) => setP({ ...p, currentPassword: e.target.value })} autoComplete="current-password" /></label>
            <label>New password<input type="password" minLength={6} required value={p.newPassword} onChange={(e) => setP({ ...p, newPassword: e.target.value })} autoComplete="new-password" /></label>
            <div className="form-actions"><button className="btn primary">Update password</button></div>
          </form>
        </section>
      </div>
    </>
  );
}
