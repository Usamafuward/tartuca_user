import React from 'react';

// Simple Spinner Component
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
        className={`${sizeClasses[size]} rounded-full animate-spin border-gray-200 border-t-primary mb-3`}
        role="status"
        aria-label="loading"
      >
        <span className="sr-only">Loading...</span>
      </div>
      {text && <p className="text-gray-500 text-sm font-medium animate-pulse">{text}</p>}
    </div>
  );
};

// Full Page Overlay Loader
export const LoadingOverlay = ({ isVisible, text = 'Loading...' }) => {
  if (!isVisible) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-white/80 backdrop-blur-sm transition-opacity duration-300">
      <div className="bg-white p-6 rounded-2xl shadow-xl flex flex-col items-center border border-gray-light">
        <LoadingSpinner size="lg" />
        <p className="mt-4 text-dark font-semibold text-lg">{text}</p>
      </div>
    </div>
  );
};

// Inline Container Loader (for sections)
export const LoadingContainer = ({ height = 'h-64', text = 'Loading content...' }) => {
  return (
    <div className={`w-full ${height} flex items-center justify-center bg-gray-light rounded-xl border-2 border-dashed border-gray-200`}>
      <LoadingSpinner size="md" text={text} />
    </div>
  );
};
