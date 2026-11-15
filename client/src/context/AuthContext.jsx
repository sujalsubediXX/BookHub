import { createContext, useContext, useEffect, useState, useCallback } from 'react';
import api from '../api.js';

const AuthCtx = createContext(null);
export const useAuth = () => useContext(AuthCtx);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(!!localStorage.getItem('lms_token'));
  const [wishlist, setWishlist] = useState([]);

  useEffect(() => {
    if (!localStorage.getItem('lms_token')) return;
    api.get('/auth/me')
      .then((r) => setUser(r.data.user))
      .catch(() => localStorage.removeItem('lms_token'))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => setWishlist((user?.wishlist || []).map(String)), [user?._id]);

  const handleAuth = (data) => {
    localStorage.setItem('lms_token', data.token);
    setUser(data.user);
    return data.user;
  };
  const login = useCallback(async (email, password) => handleAuth((await api.post('/auth/login', { email, password })).data), []);
  const register = useCallback(async (form) => handleAuth((await api.post('/auth/register', form)).data), []);
  const logout = useCallback(() => {
    localStorage.removeItem('lms_token');
    setUser(null);
  }, []);

  const toggleWishlist = useCallback(async (bookId) => {
    const r = await api.post(`/wishlist/${bookId}`);
    setWishlist(r.data.ids.map(String));
    return r.data.wishlisted;
  }, []);

  const isStaff = user?.role === 'admin' || user?.role === 'staff';
  const can = (perm) => !!user && (user.role === 'admin' || (user.role === 'staff' && (user.permissions || []).includes(perm)));

  return (
    <AuthCtx.Provider value={{ user, setUser, loading, login, register, logout, isStaff, isAdmin: user?.role === 'admin', isCustomer: user?.role === 'customer', can, wishlist, toggleWishlist }}>
      {children}
    </AuthCtx.Provider>
  );
}
