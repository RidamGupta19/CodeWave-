import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../api/axios';
import { useAuth } from './AuthContext';

const FeatureFlagContext = createContext(null);

export function FeatureFlagProvider({ children }) {
  const { user } = useAuth();
  const [features, setFeatures] = useState({});
  const [loading, setLoading] = useState(true);

  const fetchFeatures = async () => {
    const token = localStorage.getItem('cw_token');
    if (!token || !user) {
      setFeatures({});
      setLoading(false);
      return;
    }
    
    try {
      const { data } = await api.get('/feature-flags');
      const map = {};
      if (data && data.data) {
        data.data.forEach(f => {
          map[f.featureKey] = f.enabled;
        });
      }
      setFeatures(map);
    } catch (err) {
      console.error('Failed to fetch feature flags:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeatures();
  }, [user]);

  const isFeatureEnabled = (key) => {
    // Failsafe: if not loaded or not in database, default to disabled (false)
    return features[key] === true;
  };

  return (
    <FeatureFlagContext.Provider value={{ features, loading, isFeatureEnabled, refreshFeatures: fetchFeatures }}>
      {children}
    </FeatureFlagContext.Provider>
  );
}

export const useFeatureFlags = () => useContext(FeatureFlagContext);
