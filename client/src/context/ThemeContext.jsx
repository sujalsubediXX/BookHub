import { createContext, useContext, useState, useCallback } from 'react';
import { applyTheme, getTheme, savedThemeId } from '../themes.js';

const ThemeCtx = createContext(null);
export const useTheme = () => useContext(ThemeCtx);

export function ThemeProvider({ children }) {
  const [themeId, setThemeId] = useState(() => applyTheme(savedThemeId()).id);
  const setTheme = useCallback((id) => setThemeId(applyTheme(id).id), []);
  return <ThemeCtx.Provider value={{ theme: getTheme(themeId), setTheme }}>{children}</ThemeCtx.Provider>;
}
