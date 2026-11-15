// Each theme: [bg, surface, surface2, text, muted, border, primary, onPrimary, accent]
const T = (id, name, mode, c) => ({
  id, name, mode,
  colors: { bg: c[0], surface: c[1], surface2: c[2], text: c[3], muted: c[4], border: c[5], primary: c[6], onPrimary: c[7], accent: c[8] },
});

export const THEMES = [
  // ---- light ----
  T('reading-room', 'Reading Room', 'light', ['#f3efe6', '#fbf9f4', '#ebe5d8', '#20302a', '#647068', '#d9d3c7', '#20302a', '#fbf9f4', '#b36124']),
  T('himalaya', 'Himalaya', 'light', ['#eef3f7', '#ffffff', '#e3ecf3', '#14232f', '#5b6f7e', '#cfdbe5', '#1f6f8b', '#ffffff', '#c8963e']),
  T('paper', 'Paper', 'light', ['#f6f4ee', '#fffdf8', '#ece8dd', '#26231c', '#70695a', '#dcd5c4', '#5b4636', '#ffffff', '#9a3b3b']),
  T('daylight', 'Daylight', 'light', ['#f4f6fb', '#ffffff', '#e8ecf6', '#1b2033', '#5f6785', '#d6dbec', '#3b5bdb', '#ffffff', '#f08c00']),
  T('mint-tea', 'Mint Tea', 'light', ['#eef7f2', '#ffffff', '#ddefe5', '#17302a', '#587a6d', '#c5e0d2', '#1f8a70', '#ffffff', '#e8a33d']),
  T('sakura', 'Sakura', 'light', ['#fdf1f4', '#ffffff', '#fadfe6', '#3a1f2a', '#876070', '#f0cdd8', '#c2456b', '#ffffff', '#7b5ea7']),
  T('lavender', 'Lavender Mist', 'light', ['#f3f0fb', '#ffffff', '#e6e0f5', '#251c3d', '#6c6390', '#d8d0ee', '#6d4ac4', '#ffffff', '#d6457b']),
  T('sandstone', 'Sandstone', 'light', ['#efe9e1', '#faf7f2', '#e2d9cc', '#2d2820', '#7a6f5f', '#d3c8b6', '#a05a2c', '#ffffff', '#3d6b7d']),
  T('ice-blue', 'Ice Blue', 'light', ['#eaf4fb', '#ffffff', '#d6e9f6', '#0f2a3d', '#50748c', '#bcd9ec', '#0b79c4', '#ffffff', '#19b5a5']),
  T('citrus', 'Citrus', 'light', ['#fbfaee', '#ffffff', '#f1efc9', '#2a2d12', '#707543', '#e2e0a8', '#5f8a00', '#ffffff', '#f2790f']),
  T('solar-light', 'Solarized Light', 'light', ['#fdf6e3', '#fffcf2', '#eee8d5', '#073642', '#657b83', '#ddd6c1', '#268bd2', '#ffffff', '#cb4b16']),
  T('coral-reef', 'Coral Reef', 'light', ['#fff1ee', '#ffffff', '#ffe0d9', '#3b1c19', '#8f625c', '#f5cdc5', '#d6453d', '#ffffff', '#0f8b8d']),
  T('sage', 'Sage', 'light', ['#f0f3ec', '#fbfcf9', '#e1e8d8', '#232c1d', '#66745a', '#ccd7bf', '#56733a', '#ffffff', '#b0703c']),
  // ---- dark ----
  T('midnight', 'Midnight', 'dark', ['#0e1320', '#161d2f', '#1e2740', '#e6ebf7', '#8b97b8', '#2a3555', '#6c8cff', '#0b1020', '#ffb454']),
  T('nord', 'Nord', 'dark', ['#2e3440', '#3b4252', '#434c5e', '#eceff4', '#a3adc2', '#4c566a', '#88c0d0', '#1f2430', '#ebcb8b']),
  T('dracula', 'Dracula', 'dark', ['#282a36', '#313442', '#3b3f51', '#f8f8f2', '#a4a9c8', '#4a4e66', '#bd93f9', '#1b1c26', '#ff79c6']),
  T('solar-dark', 'Solarized Dark', 'dark', ['#002b36', '#073642', '#0d4452', '#eee8d5', '#93a1a1', '#1c5260', '#2aa198', '#00212b', '#b58900']),
  T('monokai', 'Monokai', 'dark', ['#272822', '#31322b', '#3b3c33', '#f8f8f2', '#aaa88f', '#4a4b3f', '#a6e22e', '#1c1d17', '#fd971f']),
  T('cyberpunk', 'Cyberpunk', 'dark', ['#0d0221', '#170536', '#240a4d', '#f4ecff', '#a58fd1', '#3a1a73', '#ff2a9d', '#1a0010', '#00f0ff']),
  T('forest-night', 'Forest Night', 'dark', ['#0f1a14', '#16251c', '#1e3226', '#e4f0e8', '#8cab98', '#2a4636', '#4cc38a', '#07140d', '#e3c565']),
  T('ocean-deep', 'Ocean Deep', 'dark', ['#0a1a24', '#102532', '#17344a', '#e2f1f8', '#86abc0', '#1f4560', '#29b6f6', '#04141d', '#ffd166']),
  T('espresso', 'Espresso', 'dark', ['#1c1512', '#271d19', '#33261f', '#f3e8df', '#b39b8b', '#46352b', '#d9a066', '#1c1008', '#8fbf9f']),
  T('graphite', 'Graphite', 'dark', ['#151515', '#1f1f1f', '#2a2a2a', '#eaeaea', '#9a9a9a', '#383838', '#e5e5e5', '#141414', '#5ec2ff']),
  T('aurora', 'Aurora', 'dark', ['#0b1220', '#121c30', '#1a2844', '#e8f1ff', '#8aa0c6', '#26395f', '#5eead4', '#04231f', '#c084fc']),
  T('matrix', 'Matrix', 'dark', ['#020a04', '#07140a', '#0c2112', '#b6ffc8', '#5fb578', '#12381e', '#00ff6a', '#012108', '#d4ff00']),
  T('ember', 'Ember', 'dark', ['#1a0f0c', '#26150f', '#351d14', '#ffe9dd', '#c09580', '#4d2a1c', '#ff7a3d', '#200a00', '#ffc857']),
];

export const DEFAULT_THEME = 'reading-room';
const STORAGE_KEY = 'lms_theme';

export const getTheme = (id) => THEMES.find((t) => t.id === id) || THEMES[0];
export const savedThemeId = () => {
  try { return localStorage.getItem(STORAGE_KEY) || DEFAULT_THEME; } catch { return DEFAULT_THEME; }
};

export function applyTheme(id) {
  const t = getTheme(id);
  const s = document.documentElement.style;
  const c = t.colors;
  const dark = t.mode === 'dark';
  s.setProperty('--bg', c.bg);
  s.setProperty('--surface', c.surface);
  s.setProperty('--surface-2', c.surface2);
  s.setProperty('--text', c.text);
  s.setProperty('--muted', c.muted);
  s.setProperty('--border', c.border);
  s.setProperty('--primary', c.primary);
  s.setProperty('--on-primary', c.onPrimary);
  s.setProperty('--accent', c.accent);
  s.setProperty('--danger', dark ? '#ff6b6b' : '#c62828');
  s.setProperty('--success', dark ? '#4ade80' : '#1b7f4b');
  s.setProperty('--warning', dark ? '#fbbf24' : '#a35f00');
  s.setProperty('--shadow', dark ? '0 10px 30px rgba(0,0,0,.45)' : '0 10px 30px rgba(20,35,47,.12)');
  s.setProperty('color-scheme', t.mode);
  document.documentElement.dataset.theme = t.id;
  try { localStorage.setItem(STORAGE_KEY, t.id); } catch { /* ignore */ }
  return t;
}
