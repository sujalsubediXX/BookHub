import { useEffect, useRef, useState } from 'react';
import { Link, Navigate, useLocation, useNavigate } from 'react-router-dom';
import gsap from 'gsap';
import { Draggable } from 'gsap/Draggable';
import { useAuth } from '../context/AuthContext.jsx';
import { errMsg } from '../api.js';
import LampSvg from './LampSvg.jsx';
import './Auth.css';

gsap.registerPlugin(Draggable);

const COLORS = [
  { id: 'amber', hex: '#ffab3d', label: 'Amber (Warm)' },
  { id: 'cyan', hex: '#00f0ff', label: 'Cyan (Cyber)' },
  { id: 'rose', hex: '#ff3385', label: 'Rose (Sunset)' },
  { id: 'mint', hex: '#00e676', label: 'Mint (Emerald)' },
  { id: 'moonlight', hex: '#d8e5ff', label: 'Moonlight (Cool White)' },
];

const PARTICLE_THEMES = {
  amber: { fill: '255, 205, 120', glow: '255, 185, 80' },
  cyan: { fill: '140, 245, 255', glow: '0, 240, 255' },
  rose: { fill: '255, 160, 200', glow: '255, 51, 133' },
  mint: { fill: '160, 255, 200', glow: '0, 230, 118' },
  moonlight: { fill: '220, 235, 255', glow: '200, 220, 255' },
};

const DEMOS = [
  { label: 'Admin', email: 'admin@library.com', password: 'Admin@123' },
  { label: 'Staff', email: 'staff@library.com', password: 'Staff@123' },
  { label: 'Reader', email: 'reader@library.com', password: 'Reader@123' },
];

// Lamp geometry (matches the SVG)
const ANCHOR_X = 245;
const ANCHOR_Y = 212;
const REST_X = 245;
const REST_Y = 300;
const MAX_STRETCH = 120;
const TRIGGER_PULL = 32;
const PARTICLE_COUNT = 60;

/* ---------- Web Audio synth (shared, lazily created on first gesture) ---------- */
let audioCtx = null;

function initAudio() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (AC) audioCtx = new AC();
  }
  if (audioCtx && audioCtx.state === 'suspended') audioCtx.resume();
}

function playPluck(pullDist, turningOn) {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;

    const osc = audioCtx.createOscillator();
    const oscGain = audioCtx.createGain();
    osc.type = 'triangle';
    osc.frequency.setValueAtTime(480 + Math.min(260, pullDist * 3), now);
    osc.frequency.exponentialRampToValueAtTime(140, now + 0.12);
    oscGain.gain.setValueAtTime(0.4, now);
    oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.14);
    osc.connect(oscGain);
    oscGain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.15);

    if (pullDist >= TRIGGER_PULL) {
      const snap = audioCtx.createOscillator();
      const snapGain = audioCtx.createGain();
      snap.type = 'sine';
      snap.frequency.setValueAtTime(turningOn ? 1800 : 1500, now + 0.02);
      snap.frequency.exponentialRampToValueAtTime(320, now + 0.06);
      snapGain.gain.setValueAtTime(0.35, now + 0.02);
      snapGain.gain.exponentialRampToValueAtTime(0.001, now + 0.065);
      snap.connect(snapGain);
      snapGain.connect(audioCtx.destination);
      snap.start(now + 0.02);
      snap.stop(now + 0.07);

      if (turningOn) {
        const hum = audioCtx.createOscillator();
        const humGain = audioCtx.createGain();
        hum.type = 'sine';
        hum.frequency.setValueAtTime(120, now + 0.05);
        humGain.gain.setValueAtTime(0.001, now);
        humGain.gain.linearRampToValueAtTime(0.06, now + 0.08);
        humGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);
        hum.connect(humGain);
        humGain.connect(audioCtx.destination);
        hum.start(now + 0.05);
        hum.stop(now + 0.38);
      }
    }
  } catch (e) {
    console.warn('AudioContext error:', e);
  }
}

function playColorTick() {
  try {
    initAudio();
    if (!audioCtx) return;
    const now = audioCtx.currentTime;
    const osc = audioCtx.createOscillator();
    const gain = audioCtx.createGain();
    osc.type = 'sine';
    osc.frequency.setValueAtTime(880, now);
    osc.frequency.exponentialRampToValueAtTime(1320, now + 0.05);
    gain.gain.setValueAtTime(0.12, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.06);
    osc.connect(gain);
    gain.connect(audioCtx.destination);
    osc.start(now);
    osc.stop(now + 0.07);
  } catch (e) {
    /* ignore */
  }
}

/* ---------- Small presentational helpers ---------- */
const iconProps = { viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 2 };

const UserIcon = () => (
  <svg className="la-field-icon" {...iconProps}>
    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
    <circle cx="12" cy="7" r="4" />
  </svg>
);
const MailIcon = () => (
  <svg className="la-field-icon" {...iconProps}>
    <rect x="2" y="4" width="20" height="16" rx="2" />
    <path d="m22 7-10 6L2 7" />
  </svg>
);
const PhoneIcon = () => (
  <svg className="la-field-icon" {...iconProps}>
    <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.36 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0 1 22 16.92z" />
  </svg>
);
const LockIcon = () => (
  <svg className="la-field-icon" {...iconProps}>
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

function Field({ id, label, icon, children }) {
  return (
    <div className="la-form-group">
      <label htmlFor={id}>{label}</label>
      <div className="la-input-wrapper">
        {icon}
        {children}
      </div>
    </div>
  );
}

/* ---------- Page ---------- */
export default function Auth({ mode }) {
  const { user, login, register } = useAuth();
  const navigate = useNavigate();
  const from = useLocation().state?.from;

  const [tab, setTab] = useState(mode === 'login' ? 'login' : 'register');
  const isLogin = tab === 'login';
  const [form, setForm] = useState({ name: '', email: '', password: '', phone: '' });
  const [error, setError] = useState('');
  const [busy, setBusy] = useState(false);
  const [showPass, setShowPass] = useState(false);
  const [color, setColor] = useState('amber');
  const [soundOn, setSoundOn] = useState(true);

  const rootRef = useRef(null);
  const isOnRef = useRef(false); // is the lamp lit?
  const soundRef = useRef(true);
  const colorRef = useRef('amber');

  const set = (k) => (e) => setForm({ ...form, [k]: e.target.value });
  const loggedIn = Boolean(user);

  // Follow the route if something else navigates between /login and /register
  useEffect(() => {
    setTab(mode === 'login' ? 'login' : 'register');
  }, [mode]);

  // Little title animation when switching tabs
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    gsap.fromTo(
      root.querySelectorAll('.la-card-title, .la-card-subtitle'),
      { opacity: 0.6, y: -4 },
      { opacity: 1, y: 0, duration: 0.3, ease: 'power2.out' }
    );
  }, [tab]);

  /* ----- The lamp: cord, light, dust, tilt ----- */
  useEffect(() => {
    if (loggedIn) return undefined;
    const root = rootRef.current;
    if (!root) return undefined;

    const q = (s) => root.querySelector(s);
    const qa = (s) => root.querySelectorAll(s);

    const cordBead = q('#cordBead');
    const cordHit = q('#cordHit');
    const elasticCord = q('#elasticCord');
    const shadeAssembly = q('#shadeAssembly');
    const card = q('.la-login-card');
    const formStage = q('.la-form-stage');
    const canvas = q('#dustCanvas');
    const ctx = canvas.getContext('2d');
    const filament = q('.la-bulb-filament');
    const bulbGlow = q('.la-bulb-glow-core');
    const lightEls = qa('.la-svg-light-beam, .la-ambient-glow, .la-shade-reflector-on');

    const sound = () => soundRef.current;

    gsap.set(cordBead, { x: REST_X, y: REST_Y });

    /* Elastic string */
    let twangAmp = 0;
    let twangStartTime = 0;
    const twangProxy = { val: 0 };

    const renderElasticString = (curX, curY) => {
      let twangOffset = 0;
      if (twangAmp > 0.05) {
        twangOffset = Math.sin((performance.now() - twangStartTime) * 0.05) * twangAmp;
      }
      const midX = (ANCHOR_X + curX) / 2 + twangOffset;
      const midY = (ANCHOR_Y + curY) / 2;
      const stretchRatio = Math.max(1, (curY - ANCHOR_Y) / (REST_Y - ANCHOR_Y));
      const strokeWidth = Math.max(1.6, 2.6 / Math.sqrt(stretchRatio));
      elasticCord.setAttribute('d', `M ${ANCHOR_X} ${ANCHOR_Y} Q ${midX} ${midY} ${curX} ${curY}`);
      elasticCord.setAttribute('stroke-width', strokeWidth.toFixed(2));
    };

    /* Lamp on / off */
    const setLamp = (on) => {
      isOnRef.current = on;
      root.setAttribute('data-on', on ? 'true' : 'false');

      gsap.killTweensOf([bulbGlow, filament, ...lightEls, card, ...qa('.la-login-card *')]);
      gsap.set(lightEls, { clearProps: 'opacity,visibility' });

      if (on) {
        gsap.timeline()
          .to(filament, { stroke: '#fff', duration: 0.05 })
          .to(bulbGlow, { opacity: 0.95, duration: 0.1, ease: 'power2.out' });

        gsap.fromTo(
          card,
          { y: 24, scale: 0.96, opacity: 0 },
          { y: 0, scale: 1, opacity: 1, duration: 0.5, ease: 'power2.out' }
        );

        gsap.fromTo(
          qa('.la-card-header, .la-auth-tabs, .la-alert, .la-form-group, .la-submit-btn, .la-auth-divider, .la-social-row'),
          { y: 14, opacity: 0 },
          { y: 0, opacity: 1, duration: 0.45, stagger: 0.04, ease: 'power2.out', delay: 0.08 }
        );
      } else {
        gsap.set(bulbGlow, { opacity: 0, clearProps: 'opacity' });
        gsap.set(filament, { stroke: '#555', filter: 'none', clearProps: 'all' });
        gsap.to(card, {
          y: 16,
          opacity: 0,
          scale: 0.96,
          duration: 0.22,
          ease: 'power2.in',
          onComplete: () => gsap.set(card, { clearProps: 'all' }),
        });
        gsap.set(card, { rotateX: 0, rotateY: 0 });
      }
    };

    /* Release: toggle if pulled far enough, then snap back with a twang */
    const handleRelease = (curX, curY) => {
      const pullDist = curY - REST_Y;
      if (pullDist >= TRIGGER_PULL) setLamp(!isOnRef.current);

      if (sound()) playPluck(pullDist, isOnRef.current);

      gsap.to(cordBead, {
        x: REST_X,
        y: REST_Y,
        duration: 1.15,
        ease: 'elastic.out(2.2, 0.16)',
        onUpdate: () => renderElasticString(gsap.getProperty(cordBead, 'x'), gsap.getProperty(cordBead, 'y')),
      });

      twangAmp = (curX - REST_X) * 0.4 + pullDist * 0.3;
      twangStartTime = performance.now();
      twangProxy.val = twangAmp;
      gsap.killTweensOf(twangProxy);
      gsap.to(twangProxy, {
        val: 0,
        duration: 0.9,
        ease: 'power2.out',
        onUpdate: () => {
          twangAmp = twangProxy.val;
        },
      });

      gsap.to(shadeAssembly, {
        rotation: 0,
        duration: 0.7,
        ease: 'back.out(2.2)',
        transformOrigin: '215px 175px',
      });
    };

    const [drag] = Draggable.create(cordBead, {
      type: 'x,y',
      bounds: {
        minY: REST_Y,
        maxY: REST_Y + MAX_STRETCH,
        minX: REST_X - 45,
        maxX: REST_X + 45,
      },
      cursor: 'grab',
      activeCursor: 'grabbing',
      onPress() {
        initAudio();
        twangAmp = 0;
      },
      onDrag() {
        renderElasticString(this.x, this.y);
        const pullDist = this.y - REST_Y;
        gsap.set(shadeAssembly, {
          rotation: (pullDist / MAX_STRETCH) * 1.8,
          transformOrigin: '215px 175px',
        });
      },
      onRelease() {
        handleRelease(this.x, this.y);
      },
    });

    /* Click (or keyboard) on the bead performs a simulated pull */
    let simulating = false;
    let pullTimer = 0;
    const simulatePull = () => {
      if (simulating) return;
      simulating = true;
      initAudio();

      gsap.to(cordBead, {
        y: REST_Y + 50,
        duration: 0.22,
        ease: 'power2.in',
        onUpdate: () => renderElasticString(REST_X, gsap.getProperty(cordBead, 'y')),
        onComplete: () => {
          handleRelease(REST_X, REST_Y + 50);
          pullTimer = window.setTimeout(() => {
            simulating = false;
          }, 500);
        },
      });
      gsap.to(shadeAssembly, {
        rotation: 1.8,
        duration: 0.22,
        ease: 'power2.in',
        transformOrigin: '230px 188px',
      });
    };

    const onKey = (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        simulatePull();
      }
    };
    cordHit.addEventListener('click', simulatePull);
    cordBead.addEventListener('keydown', onKey);

    /* 3D tilt on the card */
    const onMove = (e) => {
      if (!isOnRef.current) return;
      const rect = formStage.getBoundingClientRect();
      const x = e.clientX - rect.left - rect.width / 2;
      const y = e.clientY - rect.top - rect.height / 2;
      gsap.to(card, {
        rotateX: -(y / rect.height) * 9,
        rotateY: (x / rect.width) * 9,
        duration: 0.5,
        ease: 'power1.out',
        transformPerspective: 900,
      });
    };
    const onLeave = () => {
      gsap.to(card, { rotateX: 0, rotateY: 0, duration: 0.7, ease: 'power2.out' });
    };
    formStage.addEventListener('mousemove', onMove);
    formStage.addEventListener('mouseleave', onLeave);

    /* Dust particles */
    let width = 0;
    let height = 0;
    const resize = () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', resize);
    resize();

    const makeParticle = () => {
      const p = {};
      p.x = Math.random() * width;
      p.y = Math.random() * height;
      p.radius = Math.random() * 2 + 0.6;
      p.vx = (Math.random() - 0.4) * 0.35;
      p.vy = -Math.random() * 0.4 - 0.15;
      p.alpha = Math.random() * 0.6 + 0.2;
      p.pulseSpeed = Math.random() * 0.03 + 0.01;
      p.pulse = Math.random() * Math.PI;
      return p;
    };
    const particles = Array.from({ length: PARTICLE_COUNT }, makeParticle);

    let raf = 0;
    const frame = () => {
      ctx.clearRect(0, 0, width, height);
      const theme = PARTICLE_THEMES[colorRef.current] || PARTICLE_THEMES.amber;
      const lit = isOnRef.current;
      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.pulse += p.pulseSpeed;
        if (p.y < 0) p.y = height;
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;

        const a = (Math.sin(p.pulse) * 0.3 + 0.7) * p.alpha * (lit ? 1 : 0.08);
        ctx.save();
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${theme.fill}, ${a})`;
        if (lit) {
          ctx.shadowBlur = 7;
          ctx.shadowColor = `rgba(${theme.glow}, 0.5)`;
        }
        ctx.fill();
        ctx.restore();
      }
      raf = requestAnimationFrame(frame);
    };
    frame();

    renderElasticString(REST_X, REST_Y);

    return () => {
      cancelAnimationFrame(raf);
      window.clearTimeout(pullTimer);
      window.removeEventListener('resize', resize);
      formStage.removeEventListener('mousemove', onMove);
      formStage.removeEventListener('mouseleave', onLeave);
      cordHit.removeEventListener('click', simulatePull);
      cordBead.removeEventListener('keydown', onKey);
      drag.kill();
      gsap.killTweensOf([
        cordBead, shadeAssembly, card, bulbGlow, filament, twangProxy,
        ...lightEls, ...qa('.la-login-card *'),
      ]);
    };
  }, [loggedIn]);

  /* ----- Handlers ----- */
  const pickColor = (id) => {
    if (id === color) return;
    setColor(id);
    colorRef.current = id;
    if (soundRef.current) playColorTick();

    if (isOnRef.current && rootRef.current) {
      const els = rootRef.current.querySelectorAll('.la-svg-light-beam, .la-ambient-glow');
      gsap.fromTo(
        els,
        { opacity: 0.65 },
        {
          opacity: 1,
          duration: 0.45,
          ease: 'power1.out',
          onComplete: () => gsap.set(els, { clearProps: 'opacity,visibility' }),
        }
      );
    }
  };

  const toggleSound = () => {
    const next = !soundOn;
    setSoundOn(next);
    soundRef.current = next;
    if (next) initAudio();
  };

  const switchTab = (next) => {
    if (next === tab) return;
    setTab(next);
    setError('');
  };

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
      if (!isLogin && err.response?.status === 409) {
        setTab('login');
        setError('This email is already registered. Log in instead.');
      } else {
        setError(errMsg(err));
      }
      setBusy(false);
    }
  };

  return (
    <div className="la-root" ref={rootRef} data-on="false" data-color={color}>
      <div className="la-ambient-glow" />
      <canvas id="dustCanvas" />

      <Link to="/" className="la-back" aria-label="Back to the shop">
        <span className="la-back-mark">पु</span>
        <span className="la-back-text">Back to the shop</span>
      </Link>

      <div className="la-quick-controls">
        <div className="la-color-palette" role="group" aria-label="Lamp colour">
          {COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              className={`la-color-dot-btn${color === c.id ? ' la-active' : ''}`}
              style={{ '--dot-color': c.hex }}
              aria-label={c.label}
              aria-pressed={color === c.id}
              title={c.label}
              onClick={() => pickColor(c.id)}
            />
          ))}
        </div>

        <button
          type="button"
          className="la-sound-toggle"
          onClick={toggleSound}
          title="Toggle sound"
          aria-label={soundOn ? 'Mute sound' : 'Unmute sound'}
        >
          {soundOn ? (
            <svg className="la-sound-icon" {...iconProps}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07" />
              <path d="M19.07 4.93a10 10 0 0 1 0 14.14" />
            </svg>
          ) : (
            <svg className="la-sound-icon" {...iconProps}>
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
              <line x1="23" y1="9" x2="17" y2="15" />
              <line x1="17" y1="9" x2="23" y2="15" />
            </svg>
          )}
        </button>
      </div>

      <main className="la-scene-container">
        {/* Lamp */}
        <div className="la-lamp-stage">
          <div className="la-lamp-wrapper">
            <LampSvg />
            <div className="la-cord-tooltip">
              <span>Pull string to turn on</span>
              <div className="la-tooltip-arrow" />
            </div>
          </div>
        </div>

        {/* Form */}
        <div className="la-form-stage">
          <div className="la-login-card">
            <div className="la-card-header">
              <h1 className="la-card-title">{isLogin ? 'Welcome back' : 'Create your account'}</h1>
              <p className="la-card-subtitle">
                {isLogin ? 'Log in to continue to your account' : 'Create an account to get started'}
              </p>
            </div>

            <div className="la-auth-tabs" data-active={isLogin ? 'login' : 'register'}>
              <button
                type="button"
                className={`la-auth-tab${isLogin ? ' la-active' : ''}`}
                onClick={() => switchTab('login')}
              >
                Log in
              </button>
              <button
                type="button"
                className={`la-auth-tab${!isLogin ? ' la-active' : ''}`}
                onClick={() => switchTab('register')}
              >
                Sign up
              </button>
              <div className="la-tab-slider" />
            </div>

            <form className="la-auth-form" onSubmit={submit}>
              {error && (
                <div className="la-alert" role="alert">
                  {error}
                </div>
              )}

              {!isLogin && (
                <Field id="la-name" label="Full name" icon={<UserIcon />}>
                  <input
                    id="la-name"
                    type="text"
                    required
                    placeholder="Enter your full name"
                    value={form.name}
                    onChange={set('name')}
                    autoComplete="name"
                  />
                </Field>
              )}

              <Field id="la-email" label="Email" icon={<MailIcon />}>
                <input
                  id="la-email"
                  type="email"
                  required
                  placeholder="Enter your email"
                  value={form.email}
                  onChange={set('email')}
                  autoComplete="email"
                />
              </Field>

              {!isLogin && (
                <Field id="la-phone" label="Phone" icon={<PhoneIcon />}>
                  <input
                    id="la-phone"
                    type="tel"
                    placeholder="Enter your phone number"
                    value={form.phone}
                    onChange={set('phone')}
                    autoComplete="tel"
                  />
                </Field>
              )}

              <Field id="la-password" label="Password" icon={<LockIcon />}>
                <input
                  id="la-password"
                  type={showPass ? 'text' : 'password'}
                  required
                  minLength={6}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={set('password')}
                  autoComplete={isLogin ? 'current-password' : 'new-password'}
                />
                <button
                  type="button"
                  className="la-eye-toggle"
                  onClick={() => setShowPass((v) => !v)}
                  aria-label={showPass ? 'Hide password' : 'Show password'}
                >
                  {showPass ? (
                    <svg className="la-eye-icon" {...iconProps}>
                      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24" />
                      <line x1="1" y1="1" x2="23" y2="23" />
                    </svg>
                  ) : (
                    <svg className="la-eye-icon" {...iconProps}>
                      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                      <circle cx="12" cy="12" r="3" />
                    </svg>
                  )}
                </button>
              </Field>

              <button type="submit" className="la-submit-btn" disabled={busy}>
                <span className="la-btn-glow-layer" />
                {busy ? (
                  <div className="la-btn-spinner" aria-label="Please wait" />
                ) : (
                  <span className="la-btn-content">
                    <span className="la-btn-text">{isLogin ? 'Log in' : 'Create account'}</span>
                    <svg className="la-btn-arrow" {...iconProps} strokeWidth="2.5">
                      <line x1="5" y1="12" x2="19" y2="12" />
                      <polyline points="12 5 19 12 12 19" />
                    </svg>
                  </span>
                )}
              </button>

              {isLogin && (
                <>
                  <div className="la-auth-divider">
                    <span className="la-divider-line" />
                    <span className="la-divider-text">or try a demo account</span>
                    <span className="la-divider-line" />
                  </div>
                  <div className="la-social-row">
                    {DEMOS.map((d) => (
                      <button
                        key={d.label}
                        type="button"
                        className="la-social-btn la-demo-btn"
                        title={`${d.email} / ${d.password}`}
                        onClick={() => setForm((f) => ({ ...f, email: d.email, password: d.password }))}
                      >
                        {d.label}
                      </button>
                    ))}
                  </div>
                </>
              )}
            </form>
          </div>
        </div>
      </main>
    </div>
  );
}