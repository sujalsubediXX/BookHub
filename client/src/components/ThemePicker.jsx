import { useState } from 'react';
import { Modal } from './ui.jsx';
import { THEMES } from '../themes.js';
import { useTheme } from '../context/ThemeContext.jsx';

export default function ThemePicker({ onClose }) {
  const { theme, setTheme } = useTheme();
  const [mode, setMode] = useState('all');
  const list = THEMES.filter((t) => mode === 'all' || t.mode === mode);
  const random = () => setTheme(THEMES[Math.floor(Math.random() * THEMES.length)].id);

  return (
    <Modal title="Choose a theme" onClose={onClose} wide>
      <div className="theme-bar">
        <div className="segmented" role="tablist">
          {['all', 'light', 'dark'].map((m) => (
            <button key={m} className={mode === m ? 'on' : ''} onClick={() => setMode(m)}>
              {m === 'all' ? `All (${THEMES.length})` : m === 'light' ? 'Light' : 'Dark'}
            </button>
          ))}
        </div>
        <button className="btn sm" onClick={random}>Surprise me</button>
      </div>
      <div className="theme-grid">
        {list.map((t) => (
          <button key={t.id} className={`theme-card ${theme.id === t.id ? 'active' : ''}`} onClick={() => setTheme(t.id)} aria-pressed={theme.id === t.id}>
            <span className="theme-preview" style={{ background: t.colors.bg, borderColor: t.colors.border }}>
              <span className="tp-side" style={{ background: t.colors.surface, borderColor: t.colors.border }} />
              <span className="tp-main">
                <i style={{ background: t.colors.primary }} />
                <i style={{ background: t.colors.surface2 }} />
                <i style={{ background: t.colors.accent }} />
              </span>
            </span>
            <span className="theme-name">{t.name}</span>
            <span className="theme-mode">{t.mode}</span>
          </button>
        ))}
      </div>
    </Modal>
  );
}
