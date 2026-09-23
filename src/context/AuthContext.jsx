import { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

const INACTIVITY_LIMIT_MS = 30 * 60 * 1000; // 30 minutes

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast?.() || { showToast: () => {} };

  // Check initial token and expiration
  const [isAuthenticated, setIsAuthenticated] = useState(() => {
    const token = localStorage.getItem('token');
    const lastActive = localStorage.getItem('lastActivityTime');
    if (!token) return false;
    if (lastActive && Date.now() - Number(lastActive) > INACTIVITY_LIMIT_MS) {
      localStorage.removeItem('token');
      localStorage.removeItem('lastActivityTime');
      return false;
    }
    return true;
  });

  const lastRecordedActivityRef = useRef(Date.now());

  const logout = useCallback((message = "Logged out successfully") => {
    localStorage.removeItem('token');
    localStorage.removeItem('lastActivityTime');
    setIsAuthenticated(false);
    if (showToast) {
      showToast(message, "info");
    }
  }, [showToast]);

  const login = (token) => {
    const now = Date.now();
    localStorage.setItem('token', token);
    localStorage.setItem('lastActivityTime', now.toString());
    lastRecordedActivityRef.current = now;
    setIsAuthenticated(true);
    if (showToast) {
      showToast("Logged in successfully", "success");
    }
  };

  // Record user activity with throttling (at most once every 5 seconds)
  const recordActivity = useCallback(() => {
    const now = Date.now();
    if (now - lastRecordedActivityRef.current > 5000) {
      lastRecordedActivityRef.current = now;
      localStorage.setItem('lastActivityTime', now.toString());
    }
  }, []);

  // 30-Minute Inactivity Monitor
  useEffect(() => {
    if (!isAuthenticated) return;

    // Check if session has already expired
    const checkExpiration = () => {
      const storedTime = Number(localStorage.getItem('lastActivityTime')) || lastRecordedActivityRef.current;
      if (Date.now() - storedTime >= INACTIVITY_LIMIT_MS) {
        logout("Session expired due to inactivity. Please log in again.");
      }
    };

    checkExpiration();

    // Interaction event listeners
    const events = ['mousemove', 'mousedown', 'keydown', 'touchstart', 'scroll', 'click'];
    const handleUserInteraction = () => {
      recordActivity();
    };

    events.forEach(eventName => {
      window.addEventListener(eventName, handleUserInteraction, { passive: true });
    });

    // Check every 10 seconds
    const intervalId = setInterval(checkExpiration, 10000);

    // Also check when tab becomes visible after being in background or computer wake
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        checkExpiration();
      }
    };
    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cross-tab logout listener
    const handleStorageChange = (e) => {
      if (e.key === 'token' && !e.newValue) {
        setIsAuthenticated(false);
      }
    };
    window.addEventListener('storage', handleStorageChange);

    return () => {
      events.forEach(eventName => {
        window.removeEventListener(eventName, handleUserInteraction);
      });
      clearInterval(intervalId);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [isAuthenticated, logout, recordActivity]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, recordActivity }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
