import React from 'react';
import { useFeatureFlags } from '../context/FeatureFlagContext';
import FeatureUnavailable from '../pages/FeatureUnavailable';

export default function FeatureRoute({ featureKey, children }) {
  const { isFeatureEnabled, loading } = useFeatureFlags();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[60vh]">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-[var(--primary)] border-t-transparent"></div>
      </div>
    );
  }

  if (!isFeatureEnabled(featureKey)) {
    return <FeatureUnavailable />;
  }

  return children;
}
