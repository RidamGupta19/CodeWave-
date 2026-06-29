import React, { useEffect, useRef, useState } from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api from '../api/axios';

const INACTIVITY_LIMIT = 5 * 60 * 1000; // 5 minutes in ms
const HEARTBEAT_INTERVAL = 30 * 1000; // 30 seconds in ms

const getPageName = (pathname) => {
  const path = pathname.toLowerCase();
  if (path.includes('/dashboard')) return 'dashboard';
  if (path.includes('/video-lectures') || path.includes('/topic/') || path.includes('/video')) return 'video';
  if (path.includes('/assessment')) return 'assessment';
  if (path.includes('/notes') || path.includes('/resources')) return 'notes';
  if (path.includes('/code') || path.includes('/guru') || path.includes('/zero-to-coding')) return 'coding';
  if (path.includes('/profile')) return 'profile';
  return 'other';
};

export default function ActivityTracker() {
  const { user } = useAuth();
  const location = useLocation();
  const lastActivity = useRef(Date.now());
  const [isInactive, setIsInactive] = useState(false);
  
  const currentPage = useRef(getPageName(location.pathname));
  const pageStartTime = useRef(Date.now());

  useEffect(() => {
    if (!user) return;

    const handleActivity = () => {
      lastActivity.current = Date.now();
      setIsInactive(false);
    };

    // Throttle user interaction checks
    let timeout;
    const throttledActivity = () => {
      if (!timeout) {
        handleActivity();
        timeout = setTimeout(() => { timeout = null; }, 2000);
      }
    };

    const events = ['mousemove', 'keydown', 'scroll', 'touchstart'];
    events.forEach(event => window.addEventListener(event, throttledActivity));

    return () => {
      events.forEach(event => window.removeEventListener(event, throttledActivity));
      if (timeout) clearTimeout(timeout);
    };
  }, [user]);

  // Page change detection
  useEffect(() => {
    if (!user) return;

    const newPage = getPageName(location.pathname);
    const oldPage = currentPage.current;

    if (newPage !== oldPage) {
      const now = Date.now();
      const timeSpentOnOldPage = Math.round((now - pageStartTime.current) / 1000);
      
      // 1. Send final active time for the previous page
      if (timeSpentOnOldPage > 0) {
        api.post('/activity/heartbeat', {
          pageName: oldPage,
          timeSpent: timeSpentOnOldPage,
          active: (now - lastActivity.current) < INACTIVITY_LIMIT,
          isNewVisit: false
        }).catch(err => console.error('Failed to log previous page active time:', err));
      }

      // 2. Register visit for new page immediately
      api.post('/activity/heartbeat', {
        pageName: newPage,
        timeSpent: 0,
        active: true,
        isNewVisit: true
      }).catch(err => console.error('Failed to log new page visit:', err));

      // 3. Update refs
      currentPage.current = newPage;
      pageStartTime.current = now;
    }
  }, [location.pathname, user]);

  // Periodic heartbeat handler
  useEffect(() => {
    if (!user) return;

    // Log initial page load visit
    api.post('/activity/heartbeat', {
      pageName: currentPage.current,
      timeSpent: 0,
      active: true,
      isNewVisit: true
    }).catch(err => console.error('Failed to log initial page visit:', err));

    const interval = setInterval(() => {
      const now = Date.now();
      const timeSinceLastActivity = now - lastActivity.current;
      const active = timeSinceLastActivity < INACTIVITY_LIMIT;

      if (!active) {
        setIsInactive(true);
      }

      // Send periodic heartbeat update
      api.post('/activity/heartbeat', {
        pageName: currentPage.current,
        timeSpent: 30,
        active,
        isNewVisit: false
      }).catch(err => console.error('Failed to send heartbeat:', err));

    }, HEARTBEAT_INTERVAL);

    // Terminate session cleanly when tab is closed
    const handleBeforeUnload = () => {
      const token = localStorage.getItem('cw_token');
      if (token) {
        const rawApiUrl = import.meta.env.VITE_API_URL || 'https://codewave-solution.onrender.com/api';
        const baseURL = rawApiUrl.endsWith('/api') ? rawApiUrl : `${rawApiUrl.replace(/\/$/, '')}/api`;
        
        // Use sendBeacon for synchronous backend logging on page exit
        navigator.sendBeacon(
          `${baseURL}/activity/session/end`,
          JSON.stringify({ token })
        );
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      clearInterval(interval);
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [user]);

  return null;
}
