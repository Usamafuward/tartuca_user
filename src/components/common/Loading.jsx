import React from 'react';

// Simple Spinner Component with Amber Accent
export const LoadingSpinner = ({ size = 'md', text = '', className = '' }) => {
  const sizeClasses = {
    sm: 'w-5 h-5 border-2',
    md: 'w-8 h-8 border-3',
    lg: 'w-12 h-12 border-4',
    xl: 'w-16 h-16 border-4',
  };

  return (
    <div className={`flex flex-col items-center justify-center p-4 ${className}`}>
      <div 
        className={`${sizeClasses[size]} rounded-full animate-spin border-white/10 border-t-amber-400 mb-3`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="text-amber-400/90 text-xs uppercase tracking-wider font-bold animate-pulse">{text}</p>}
    </div>
  );
};

// Full Page Overlay Loader
export const LoadingOverlay = ({ isVisible, text = 'Loading...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md transition-opacity duration-300">
      <div className="glass-card p-8 rounded-3xl shadow-2xl flex flex-col items-center border border-amber-500/30">
        <LoadingSpinner size="lg" />
        <p className="mt-2 text-white font-serif font-bold text-base">{text}</p>
      </div>
    </div>
  );
};

// Inline Container Loader (for sections)
export const LoadingContainer = ({ height = 'h-64', text = 'Loading content...' }) => {
  return (
    <div className={`w-full ${height} flex items-center justify-center glass-card rounded-3xl border border-white/10`}>
      <LoadingSpinner size="md" text={text} />
    </div>
  );
};
