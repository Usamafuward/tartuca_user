import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useToast } from './ToastContext';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const { showToast } = useToast();
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  const login = (token) => {
    localStorage.setItem('token', token);
    setIsAuthenticated(true);
    showToast("Logged in successfully", "success");
  };

  const logout = useCallback((message = "Logged out successfully") => {
    localStorage.removeItem('token');
    setIsAuthenticated(false);
    showToast(message, "info");
  }, [showToast]);

  // Inactivity Logic
  useEffect(() => {
    let timeout;
    const INACTIVITY_LIMIT = 30 * 60 * 1000; // 30 minutes

    const resetTimer = () => {
      if (isAuthenticated) {
        clearTimeout(timeout);
        timeout = setTimeout(() => {
          // Clear token and state, then redirect
          logout("Session expired due to inactivity");
          window.location.href = '/login';
        }, INACTIVITY_LIMIT);
      }
    };

    if (isAuthenticated) {
      resetTimer(); // Set initial timer
      
      // Events to track activity
      window.addEventListener('mousemove', resetTimer);
      window.addEventListener('keypress', resetTimer);
      window.addEventListener('click', resetTimer);
      window.addEventListener('scroll', resetTimer, true);
    }

    return () => {
      if (timeout) clearTimeout(timeout);
      window.removeEventListener('mousemove', resetTimer);
      window.removeEventListener('keypress', resetTimer);
      window.removeEventListener('click', resetTimer);
      window.removeEventListener('scroll', resetTimer, true);
    };
  }, [isAuthenticated, logout]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
