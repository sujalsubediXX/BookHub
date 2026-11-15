import axios from 'axios';

const api = axios.create({ baseURL: import.meta.env.VITE_API_URL || '/api' });

api.interceptors.request.use((cfg) => {
  const token = localStorage.getItem('lms_token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

api.interceptors.response.use(
  (r) => r,
  (err) => {
    const url = err.config?.url || '';
    if (err.response?.status === 401 && !url.includes('/auth/login') && !url.includes('/auth/register')) {
      localStorage.removeItem('lms_token');
      if (!location.pathname.startsWith('/login')) location.href = '/login';
    }
    return Promise.reject(err);
  }
);

const FILE_BASE = import.meta.env.VITE_FILE_URL || '';
export const fileUrl = (p) => (!p ? '' : /^https?:/.test(p) ? p : FILE_BASE + p);

export const errMsg = (e) => e.response?.data?.message || e.message || 'Something went wrong';
export default api;
