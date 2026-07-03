import React from 'react';

// Base Skeleton Component with Shimmer Effect
export const Skeleton = ({ className = '', ...props }) => {
  return (
    <div 
      className={`bg-gray-200 relative overflow-hidden ${className}`}
      {...props}
    >
      <div className="absolute inset-0 -translate-x-full animate-shimmer bg-gradient-to-r from-transparent via-white/50 to-transparent" />
    </div>
  );
};

// Menu Item Skeleton (Card Style)
export const MenuItemSkeleton = ({ count = 6 }) => {
  return (
    <>
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white rounded-3xl p-4 shadow-sm border border-gray-100">
          {/* Image Placeholder */}
          <Skeleton className="h-48 rounded-2xl mb-4 w-full" />
          
          {/* Content Placeholder */}
          <div className="mb-4 space-y-2">
            <Skeleton className="h-6 w-3/4 rounded-md" />
            <Skeleton className="h-3 w-full rounded-md" />
            <Skeleton className="h-3 w-2/3 rounded-md" />
          </div>
          
          {/* Footer Placeholder */}
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-20 rounded-lg" />
            <Skeleton className="w-10 h-10 rounded-xl" />
          </div>
        </div>
      ))}
    </>
  );
};

// Hero Section Skeleton
export const HeroSkeleton = () => {
  return (
    <div className="relative w-full h-[500px] bg-gray-50 flex items-center">
      <div className="container mx-auto px-4 grid md:grid-cols-2 gap-8 items-center">
        <div className="space-y-6">
          <Skeleton className="h-16 w-3/4 rounded-2xl" />
          <Skeleton className="h-4 w-full rounded-lg" />
          <Skeleton className="h-4 w-5/6 rounded-lg" />
          <div className="flex gap-4 pt-4">
            <Skeleton className="h-12 w-32 rounded-xl" />
            <Skeleton className="h-12 w-32 rounded-xl" />
          </div>
        </div>
        <div className="hidden md:block">
           <Skeleton className="h-[400px] w-full rounded-3xl" />
        </div>
      </div>
    </div>
  );
};

// Gallery Grid Skeleton
export const GallerySkeleton = ({ count = 6 }) => {
  return (
    <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
      {Array(count).fill(0).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`rounded-2xl w-full ${i % 2 === 0 ? 'h-64' : 'h-80'}`} 
        />
      ))}
    </div>
  );
};

// Category Skeleton
export const CategorySkeleton = ({ count = 4 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="flex flex-col items-center justify-center p-10 rounded-3xl bg-gray-50 border border-gray-100 relative overflow-hidden h-64">
           <Skeleton className="w-20 h-20 rounded-full mb-6" />
           <Skeleton className="h-6 w-32 rounded-md mb-2" />
           <Skeleton className="h-4 w-16 rounded-md" />
        </div>
      ))}
    </div>
  );
};

// Text Block Skeleton
export const TextSkeleton = ({ lines = 3 }) => {
  return (
    <div className="space-y-3 w-full">
      {Array(lines).fill(0).map((_, i) => (
        <Skeleton 
          key={i} 
          className={`h-4 rounded-md ${i === lines - 1 ? 'w-2/3' : 'w-full'}`} 
        />
      ))}
    </div>
  );
};

// Review Skeleton
export const ReviewSkeleton = ({ count = 3 }) => {
  return (
    <div className="space-y-6">
      {Array(count).fill(0).map((_, i) => (
        <div key={i} className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
           <div className="flex items-center gap-4 mb-4">
              <Skeleton className="w-12 h-12 rounded-full" />
              <div className="space-y-2">
                 <Skeleton className="h-4 w-32 rounded" />
                 <Skeleton className="h-3 w-20 rounded" />
              </div>
           </div>
           <div className="space-y-2">
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-full rounded" />
              <Skeleton className="h-3 w-2/3 rounded" />
           </div>
        </div>
      ))}
    </div>
  );
};
