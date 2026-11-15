import { useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';

export default function Auth({ mode }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;
  const isLogin = mode === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [lampOn, setLampOn] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [color, setColor] = useState('amber');
  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });

  const dest = (u) => (u.role === 'customer' ? from || '/' : from?.startsWith('/admin') ? from : '/admin');
  if (user) return <Navigate to={dest(user)} replace />;

  const submit = async (e) => {
    e.preventDefault();
    setError('');
    setBusy(true);
    try {
      const u = isLogin ? await login(form.email, form.password) : await register(form);
      navigate(dest(u), { replace: true });
    } catch (err) {
      setError(errMsg(err));
      setBusy(false);
    }
  };

  return (
    <div className={`auth auth-demo auth-${color} ${lampOn ? 'lamp-on' : ''}`}>
      <div className="auth-controls">
        {['amber', 'cyan', 'rose', 'mint', 'moonlight'].map((tone) => (
          <button key={tone} type="button" className={`color-dot ${color === tone ? 'active' : ''}`} data-color={tone} onClick={() => setColor(tone)} aria-label={`${tone} light`} />
        ))}
      </div>
      <section className="auth-art">
        <Link to="/" className="brand-mark big" aria-label="Back to the shop">पु</Link>
        <div className="lamp-scene" aria-label={lampOn ? 'Lamp is on' : 'Turn on the lamp'}>
          <button type="button" className="lamp" onClick={() => setLampOn(!lampOn)} aria-label={lampOn ? 'Turn lamp off' : 'Turn lamp on'}>
            <span className="lamp-shade" /><span className="lamp-arm" /><span className="lamp-base" />
          </button>
          <span className="lamp-cord" />
        </div>
        <div className="auth-pitch">
          <p className="auth-kicker">Pustakalaya · online reading room</p>
          <h1>Rent the book. Return it when you are done.</h1>
          <p>Browse the shelves online, request a book for a few days, pay with eSewa or Khalti, and pick it up or have it delivered.</p>
        </div>
      </section>
      <section className="auth-form">
        <form onSubmit={submit} className={lampOn ? 'revealed' : ''}>
          <div className="auth-heading"><p className="auth-kicker">{isLogin ? 'Welcome back' : 'Join the reading room'}</p><h2>{isLogin ? 'Sign in to continue' : 'Create your account'}</h2></div>
          {!lampOn && <p className="lamp-hint">Turn on the lamp to reveal your account form.</p>}
          {error && <div className="alert" role="alert">{error}</div>}
          {!isLogin && <label>Full name<input required value={form.name} onChange={set('name')} autoComplete="name" /></label>}
          <label>Email<input type="email" required value={form.email} onChange={set('email')} autoComplete="email" /></label>
          {!isLogin && <label>Phone<input value={form.phone} onChange={set('phone')} autoComplete="tel" /></label>}
          <label>Password
            <span className="password-field"><input type={showPassword ? 'text' : 'password'} required minLength={6} value={form.password} onChange={set('password')} autoComplete={isLogin ? 'current-password' : 'new-password'} /><button type="button" onClick={() => setShowPassword(!showPassword)} aria-label={showPassword ? 'Hide password' : 'Show password'}>{showPassword ? 'Hide' : 'Show'}</button></span>
          </label>
          <button className="btn primary block auth-submit" disabled={busy}>{busy ? 'Please wait…' : isLogin ? 'Sign in' : 'Create account'}<span aria-hidden="true">→</span></button>
          <p className="switch">
            {isLogin ? <>New here? <Link to="/register" state={{ from }}>Create an account</Link></> : <>Already registered? <Link to="/login" state={{ from }}>Sign in</Link></>}
          </p>
        </form>
      </section>
    </div>
  );
}
