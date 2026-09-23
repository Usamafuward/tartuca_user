import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogIn, Calendar, Sun, Moon, Sparkles } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';
import { useTheme } from '../../context/ThemeContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const { isAuthenticated } = useAuth();
  const { getCartCount } = useCart();
  const { isDark, toggleTheme, theme } = useTheme();

  // "Home" removed as requested - brand logo navigates to '/'
  const navLinks = [
    { name: 'Menu', path: '/menu' },
    { name: 'Delivery', path: '/delivery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'Our Story', path: '/about' },
  ];

  const isActive = (path) => {
    if (path === '/') return location.pathname === '/';
    return location.pathname.startsWith(path);
  };

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-[var(--app-nav-bg)] backdrop-blur-xl border-b border-[var(--app-nav-border)] transition-colors duration-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-20">

          {/* Brand Monogram & Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center gap-3 group">
              <div className="relative w-10 h-10 sm:w-12 sm:h-12">
                <img
                  src="/tartuca-favicon.png"
                  alt="Tartuca Emblem"
                  className="w-full h-full object-cover"
                />
              </div>
              <span className="text-2xl sm:text-3xl font-serif font-bold tracking-tight text-white">
                Tar<span className="text-[#C47A16]">tuca</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation Links (No Home item) */}
          <div className="hidden lg:flex items-center gap-1 xl:gap-2 px-3 py-1.5 rounded-full bg-white/[0.03] border border-white/[0.06] backdrop-blur-md">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  className={`relative px-4 py-1.5 rounded-full text-xs font-semibold uppercase tracking-wider transition-all duration-200 ${active
                      ? 'text-amber-400 bg-amber-500/10 shadow-xs'
                      : 'text-slate-400 hover:text-white hover:bg-white/[0.05]'
                    }`}
                >
                  {link.name}
                  {active && (
                    <span className="absolute bottom-0 left-1/2 -translate-x-1/2 w-3 h-0.5 bg-amber-400 rounded-full" />
                  )}
                </Link>
              );
            })}
          </div>

          {/* Right Action Icons & CTA */}
          <div className="hidden md:flex items-center gap-3">

            {/* Theme Toggle Button (Dark / Light, defaults to system) */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-amber-400 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all duration-200 relative group"
              title={isDark ? "Switch to Light Mode" : "Switch to Dark Mode"}
              aria-label="Toggle dark/light theme"
            >
              {isDark ? (
                <Sun size={18} className="transition-transform group-hover:rotate-45 text-amber-400" />
              ) : (
                <Moon size={18} className="transition-transform group-hover:-rotate-12 text-slate-700" />
              )}
            </button>

            {/* Cart Pill */}
            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-amber-400 hover:border-amber-500/30 hover:bg-white/[0.08] transition-all duration-200 group"
              title="View Cart"
            >
              <ShoppingBag size={19} className="group-hover:scale-105 transition-transform" />
              {getCartCount() > 0 && (
                <span className="absolute -top-1.5 -right-1.5 min-w-5 h-5 px-1 bg-gradient-to-r from-amber-500 to-amber-600 text-slate-950 text-[10px] font-extrabold flex items-center justify-center rounded-full border border-[var(--app-bg)] shadow-md shadow-amber-500/30 animate-pulse">
                  {getCartCount()}
                </span>
              )}
            </Link>

            {/* User Profile / Login */}
            {isAuthenticated ? (
              <Link
                to="/profile"
                className="flex items-center gap-2 px-3.5 py-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 transition-all text-xs font-semibold"
              >
                <User size={15} className="text-amber-400" />
                <span>Profile</span>
              </Link>
            ) : (
              <Link
                to="/login"
                className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white hover:border-white/20 transition-all text-xs font-semibold"
              >
                <LogIn size={15} className="text-amber-400" />
                <span>Sign In</span>
              </Link>
            )}

            {/* VIP Book Table Button */}
            <Link
              to="/book-table"
              className="flex items-center gap-2 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 px-4 py-2.5 rounded-xl text-xs font-extrabold tracking-wide uppercase shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all duration-200 hover:scale-[1.02] active:scale-95 whitespace-nowrap"
            >
              <Calendar size={14} className="stroke-[2.5]" />
              <span>Book Table</span>
            </Link>
          </div>

          {/* Mobile Right Bar */}
          <div className="flex md:hidden items-center gap-2">
            {/* Theme Toggle Mobile */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-amber-400"
              aria-label="Toggle theme"
            >
              {isDark ? <Sun size={18} className="text-amber-400" /> : <Moon size={18} className="text-slate-700" />}
            </button>

            <Link
              to="/cart"
              className="relative p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-amber-400 transition-colors"
            >
              <ShoppingBag size={19} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-amber-400 text-slate-950 text-[10px] font-bold flex items-center justify-center rounded-full">
                  {getCartCount()}
                </span>
              )}
            </Link>

            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2.5 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 hover:text-white focus:outline-none"
              aria-label="Toggle Navigation Menu"
            >
              {isOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {isOpen && (
        <div className="md:hidden glass-panel border-b border-[var(--app-nav-border)] px-4 py-5 shadow-2xl animate-in slide-in-from-top-2 duration-200">
          <div className="space-y-1">
            {navLinks.map((link) => {
              const active = isActive(link.path);
              return (
                <Link
                  key={link.name}
                  to={link.path}
                  onClick={() => setIsOpen(false)}
                  className={`flex items-center justify-between px-4 py-3 rounded-xl text-sm font-semibold transition-colors ${active
                      ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                      : 'text-slate-400 hover:bg-white/[0.05] hover:text-white'
                    }`}
                >
                  <span>{link.name}</span>
                  {active && <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />}
                </Link>
              );
            })}
          </div>

          <div className="pt-4 mt-4 border-t border-white/10 flex flex-col gap-2.5">
            {isAuthenticated ? (
              <Link
                to="/profile"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-sm"
              >
                <User size={16} className="text-amber-400" />
                My Account & Orders
              </Link>
            ) : (
              <Link
                to="/login"
                onClick={() => setIsOpen(false)}
                className="flex items-center justify-center gap-2 py-3 rounded-xl bg-white/[0.04] border border-white/[0.08] text-slate-300 font-semibold text-sm"
              >
                <LogIn size={16} className="text-amber-400" />
                Sign In / Register
              </Link>
            )}

            <Link
              to="/book-table"
              onClick={() => setIsOpen(false)}
              className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25"
            >
              <Calendar size={16} className="stroke-[2.5]" />
              Reserve a Table
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
