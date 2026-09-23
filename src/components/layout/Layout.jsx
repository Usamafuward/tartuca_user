import { Outlet } from 'react-router-dom';
import Navbar from './Navbar';
import Footer from './Footer';

function Layout() {
  return (
    <div className="h-screen w-full overflow-hidden bg-[var(--app-bg)] text-[var(--app-text)] selection:bg-amber-500/25 selection:text-amber-300 font-sans transition-colors duration-200 relative">
      {/* Ambient Luxury Culinary Lighting */}
      <div className="fixed top-0 left-1/3 w-[600px] h-[400px] bg-amber-500/[0.035] rounded-full blur-[140px] pointer-events-none -z-10" />
      <div className="fixed bottom-1/4 right-10 w-[500px] h-[500px] bg-amber-600/[0.025] rounded-full blur-[160px] pointer-events-none -z-10" />
      
      {/* Floating Glassmorphic Navigation Bar */}
      <Navbar />
      
      {/* Scrollable Container starting directly after navbar */}
      <div 
        id="scroll-container" 
        className="fixed top-20 bottom-0 left-0 right-0 overflow-y-auto overflow-x-hidden flex flex-col scroll-smooth z-0"
      >
        {/* Main Content Area */}
        <main className="flex-1 w-full relative z-0 shrink-0">
          <Outlet />
        </main>

        {/* Luxury Footer */}
        <Footer />
      </div>
    </div>
  );
}

export default Layout;
