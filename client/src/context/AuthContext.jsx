import { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem('cf_user');
    return saved ? JSON.parse(saved) : null;
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('cf_token');
    if (token) {
      api.get('/auth/me')
        .then(r => { setUser(r.data.user); localStorage.setItem('cf_user', JSON.stringify(r.data.user)); })
        .catch(() => { localStorage.removeItem('cf_token'); localStorage.removeItem('cf_user'); setUser(null); })
        .finally(() => setLoading(false));
    } else {
      setLoading(false);
    }
  }, []);

  const login = async (email, password) => {
    const { data } = await api.post('/auth/login', { email, password });
    localStorage.setItem('cf_token', data.token);
    localStorage.setItem('cf_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const register = async (formData) => {
    const { data } = await api.post('/auth/register', formData);
    localStorage.setItem('cf_token', data.token);
    localStorage.setItem('cf_user', JSON.stringify(data.user));
    setUser(data.user);
    return data;
  };

  const logout = () => {
    localStorage.removeItem('cf_token');
    localStorage.removeItem('cf_user');
    setUser(null);
  };

  const refreshUser = async () => {
    const { data } = await api.get('/auth/me');
    setUser(data.user);
    localStorage.setItem('cf_user', JSON.stringify(data.user));
    return data.user;
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, refreshUser, setUser }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
