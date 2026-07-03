import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Menu, X, ShoppingBag, User, LogIn } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { useCart } from '../../context/CartContext';

function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { isAuthenticated } = useAuth();
  const { getCartCount } = useCart();

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Menu', path: '/menu' },
    { name: 'Delivery', path: '/delivery' },
    { name: 'Reviews', path: '/reviews' },
    { name: 'Gallery', path: '/gallery' },
    { name: 'About', path: '/about' },
  ];

  return (
    <nav className="bg-white/80 backdrop-blur-md fixed top-0 left-0 right-0 z-50 border-b border-gray-100 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-2 md:grid-cols-3 h-20 items-center">
          {/* Logo - Left aligned */}
          <div className="flex justify-start">
            <Link to="/" className="flex items-center gap-2 group">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center text-white font-bold text-xl group-hover:scale-105 transition-transform">
                T
              </div>
              <span className="text-2xl font-bold text-dark tracking-tight">
                Tar<span className="text-primary">tuca</span>
              </span>
            </Link>
          </div>

          {/* Desktop Navigation - Centered */}
          <div className="hidden md:flex justify-center items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="text-gray-600 hover:text-primary font-medium transition-colors text-sm whitespace-nowrap"
              >
                {link.name}
              </Link>
            ))}
          </div>

          {/* Right Actions - Right aligned */}
          <div className="hidden md:flex justify-end items-center gap-4">
            <Link to="/cart" className="text-dark hover:text-primary transition-colors relative border-2 border-dark hover:border-primary rounded-full flex items-center gap-2 p-2">
              <ShoppingBag size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {getCartCount()}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
                <Link to="/profile" className="text-dark hover:text-primary border-2 border-dark hover:border-primary transition-colors flex items-center gap-1 px-4 py-2 rounded-full">                   
                    <span className="text-sm font-medium">Profile</span>
                    <User size={20} />
                </Link>
            ) : (
                <Link to="/login" className="text-dark hover:text-primary border-2 border-dark hover:border-primary transition-colors flex items-center gap-1 px-4 py-2 rounded-full">
                    <span className="text-sm font-medium">Login</span>
                    <LogIn size={20} />
                </Link>
            )}
            <Link
              to="/book-table"
              className="bg-primary text-white px-4 py-2.5 rounded-full text-sm font-semibold hover:bg-primary-dark transition-colors shadow-lg shadow-primary/25 whitespace-nowrap"
            >
              Book Table
            </Link>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex justify-end items-center gap-4">
            <Link to="/cart" className="w-10 h-10 border border-primary rounded-xl flex items-center justify-center text-primary hover:bg-primary hover:text-white transition-all relative">
              <ShoppingBag size={20} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 bg-primary text-white text-[10px] font-bold flex items-center justify-center rounded-full border-2 border-white">
                    {getCartCount()}
                </span>
              )}
            </Link>
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-dark hover:text-primary transition-colors focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden bg-white border-t border-gray-100 absolute w-full left-0 shadow-lg">
          <div className="px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                to={link.path}
                className="block px-3 py-3 text-base font-medium text-dark hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                onClick={() => setIsOpen(false)}
              >
                {link.name}
              </Link>
            ))}
            <div className="pt-4 mt-4 border-t border-gray-100 flex flex-col gap-3">
              {isAuthenticated ? (
                <Link
                    to="/profile"
                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-dark hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    <User size={20} />
                    My Profile
                </Link>
              ) : (
                <Link
                    to="/login"
                    className="flex items-center gap-3 px-3 py-3 text-base font-medium text-dark hover:text-primary hover:bg-primary/5 rounded-lg transition-colors"
                    onClick={() => setIsOpen(false)}
                >
                    <LogIn size={20} />
                    Login / Register
                </Link>
              )}
              <Link
                to="/book-table"
                className="block w-full text-center bg-primary text-white px-4 py-3 rounded-xl font-semibold hover:bg-primary-dark transition-colors"
                onClick={() => setIsOpen(false)}
              >
                Book a Table
              </Link>
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
