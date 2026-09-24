import React, { useState, useEffect } from 'react';
import { API_URL } from '../../services/api';

const sizeClasses = {
  xs: 'w-6 h-6 text-[10px]',
  sm: 'w-8 h-8 text-xs',
  md: 'w-10 h-10 text-sm',
  lg: 'w-14 h-14 text-lg',
  xl: 'w-20 h-20 text-2xl',
  '2xl': 'w-24 h-24 text-3xl font-serif'
};

const resolveImageSrc = (url) => {
  if (!url) return null;
  if (url.startsWith('http://') || url.startsWith('https://') || url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  const base = API_URL.endsWith('/api') ? API_URL.slice(0, -4) : API_URL;
  return `${base}${url.startsWith('/') ? '' : '/'}${url}`;
};

const UserAvatar = ({ 
  src, 
  name = 'User', 
  size = 'md', 
  className = '', 
  border = true 
}) => {
  const [imageError, setImageError] = useState(false);
  const resolvedSrc = resolveImageSrc(src);

  useEffect(() => {
    setImageError(false);
  }, [resolvedSrc]);

  // Extract first letter of name/fallback
  const cleanName = (typeof name === 'string' && name.trim()) ? name.trim() : 'User';
  const firstLetter = cleanName.charAt(0).toUpperCase() || 'T';

  const sizeClass = sizeClasses[size] || size;
  const borderClass = border ? 'border border-amber-500/30 shadow-md shadow-amber-500/10' : '';

  return (
    <div 
      className={`relative inline-flex items-center justify-center shrink-0 rounded-full overflow-hidden select-none ${sizeClass} ${borderClass} ${className}`}
    >
      {resolvedSrc && !imageError ? (
        <img
          key={resolvedSrc}
          src={resolvedSrc}
          alt={cleanName}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
          loading="lazy"
        />
      ) : (
        <div className="w-full h-full bg-gradient-to-br from-amber-500/25 via-amber-600/20 to-slate-900 text-amber-300 font-bold flex items-center justify-center uppercase tracking-wide">
          {firstLetter}
        </div>
      )}
    </div>
  );
};

export default UserAvatar;
