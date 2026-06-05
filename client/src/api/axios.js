import axios from 'axios';

const rawApiUrl = import.meta.env.VITE_API_URL || 'https://careerforge-nkf0.onrender.com/api';
const baseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;

const api = axios.create({
  baseURL,
  headers: { 'Content-Type': 'application/json' }
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('cf_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('cf_token');
      localStorage.removeItem('cf_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default api;
