import { Outlet } from 'react-router-dom';

function AuthLayout() {
  return (
    <div className="min-h-screen bg-[#FAF7F2] dark:bg-[#07090E] text-stone-900 dark:text-slate-100 flex items-center justify-center p-4 sm:p-6 lg:p-8 relative selection:bg-amber-500/25 selection:text-amber-300 overflow-hidden">
      
      {/* Atmospheric Ambient Dining Wallpaper */}
      <div 
        className="absolute inset-0 bg-cover bg-center pointer-events-none scale-105"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?auto=format&fit=crop&q=80&w=1920')`
        }}
      />
      <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-[#FAF7F2]/90 dark:from-[#07090E] dark:via-[#07090E]/85 dark:to-[#07090E]/95 pointer-events-none" />

      {/* Geometric Architectural Dot Grid Pattern */}
      <div 
        className="absolute inset-2 pointer-events-none "
        style={{
          backgroundImage: `radial-gradient(rgba(217, 119, 6, 0.4) 1.2px, transparent 1.2px)`,
          backgroundSize: '28px 28px'
        }}
      />

      {/* Center Form Card Outlet */}
      <div className="relative z-10 w-full flex items-center justify-center">
        <Outlet />
      </div>
    </div>
  );
}

export default AuthLayout;
