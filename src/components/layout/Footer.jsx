import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { MapPin, Phone, Mail, Instagram, Facebook, Twitter, Clock, ArrowRight, CheckCircle2 } from 'lucide-react';
import { fetchRestaurantSettings } from '../../services/api';

function Footer() {
  const [settings, setSettings] = useState({
    name: 'Tartuca',
    phone: '+94 11 257 4820',
    email: 'info@tartuca.lk',
    address: '42 Green Path (Ananda Coomaraswamy Mw), Colombo 07, Sri Lanka'
  });
  const [emailSubscribed, setEmailSubscribed] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');

  useEffect(() => {
    fetchRestaurantSettings()
      .then(data => {
        if (data) {
          setSettings(prev => ({
            name: data.name || prev.name,
            phone: data.phone || prev.phone,
            email: data.email || prev.email,
            address: data.address || prev.address
          }));
        }
      })
      .catch(() => {});
  }, []);

  const handleSubscribe = (e) => {
    e.preventDefault();
    if (newsletterEmail) {
      setEmailSubscribed(true);
      setNewsletterEmail('');
    }
  };

  const quickLinks = [
    { label: 'Our Menu', path: '/menu' },
    { label: 'Table Reservations', path: '/book-table' },
    { label: 'Doorstep Delivery', path: '/delivery' },
    { label: 'Guest Reviews', path: '/reviews' },
    { label: 'Photo Gallery', path: '/gallery' },
    { label: 'Our Story', path: '/about' }
  ];

  return (
    <footer className="relative bg-[var(--app-footer-bg)] text-slate-300 pt-20 pb-12 border-t border-[var(--app-footer-border)] overflow-hidden transition-colors duration-250 shrink-0">
      {/* Top subtle golden light leak */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-px bg-gradient-to-r from-transparent via-amber-500/40 to-transparent" />
      <div className="absolute top-0 left-1/4 w-96 h-32 bg-amber-500/[0.02] blur-3xl pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8 mb-16">
          
          {/* Column 1: Brand & Philosophy */}
          <div>
            <Link to="/" className="flex items-center gap-3 mb-6 group inline-flex">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-400 via-amber-500 to-amber-600 flex items-center justify-center text-slate-950 font-serif font-black text-xl shadow-md shadow-amber-500/20 group-hover:scale-105 transition-transform duration-200">
                T
              </div>
              <span className="text-2xl font-serif font-bold tracking-tight text-white">
                Tar<span className="text-amber-400">tuca</span>
              </span>
            </Link>
            <p className="text-slate-400 text-sm leading-relaxed mb-6 font-normal">
              Authentic Sri Lankan restaurant in Colombo, Sri Lanka. Serving rich traditional curries, ocean-fresh seafood, woodfired pizzas, and handcrafted culinary favorites prepared with authentic spices.
            </p>
            <div className="flex items-center gap-3">
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-white/[0.08] transition-all"
                aria-label="Instagram"
              >
                <Instagram size={16} />
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-white/[0.08] transition-all"
                aria-label="Facebook"
              >
                <Facebook size={16} />
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noreferrer" 
                className="w-9 h-9 rounded-xl bg-white/[0.04] border border-white/[0.08] flex items-center justify-center text-slate-300 hover:text-amber-400 hover:border-amber-500/40 hover:bg-white/[0.08] transition-all"
                aria-label="Twitter"
              >
                <Twitter size={16} />
              </a>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 font-sans">
              Discover
            </h4>
            <ul className="space-y-3">
              {quickLinks.map((item) => (
                <li key={item.label}>
                  <Link
                    to={item.path}
                    className="text-slate-400 hover:text-white hover:translate-x-1 inline-flex items-center gap-1.5 transition-all text-sm font-medium"
                  >
                    <span className="text-amber-400/40 text-xs">›</span>
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Hours & Location */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 font-sans">
              Dining Hours & Location
            </h4>
            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-start gap-3">
                <MapPin size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <span className="leading-snug">{settings.address}</span>
              </div>
              <div className="flex items-center gap-3">
                <Phone size={18} className="text-amber-400 shrink-0" />
                <span>{settings.phone}</span>
              </div>
              <div className="flex items-center gap-3">
                <Mail size={18} className="text-amber-400 shrink-0" />
                <span>{settings.email}</span>
              </div>
              <div className="pt-2 border-t border-white/[0.06] flex items-start gap-3">
                <Clock size={18} className="text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <p className="text-white text-xs font-semibold">Lunch Service: 12:00 – 15:30</p>
                  <p className="text-white text-xs font-semibold">Dinner Service: 18:00 – 23:30</p>
                  <p className="text-slate-500 text-[11px] mt-0.5">Open Tuesday – Sunday</p>
                </div>
              </div>
            </div>
          </div>

          {/* Column 4: Newsletter */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-[0.2em] text-amber-400 mb-6 font-sans">
              Newsletter & Updates
            </h4>
            <p className="text-slate-400 text-sm mb-4 leading-relaxed">
              Subscribe for updates on seasonal specials, chef's recommendations, and holiday bookings.
            </p>

            {emailSubscribed ? (
              <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 flex items-center gap-3 text-amber-300 text-xs font-medium animate-in fade-in duration-300">
                <CheckCircle2 size={18} className="text-amber-400 shrink-0" />
                <span>Thank you for subscribing! We'll keep you updated.</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2.5">
                <div className="relative">
                  <input
                    type="email"
                    required
                    value={newsletterEmail}
                    onChange={(e) => setNewsletterEmail(e.target.value)}
                    placeholder="Enter your email address"
                    className="w-full px-4 py-3 rounded-xl bg-white/[0.04] border border-white/[0.1] text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 focus:bg-white/[0.07] transition-all"
                  />
                </div>
                <button 
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 font-bold py-2.5 px-4 rounded-xl text-xs uppercase tracking-wider transition-all duration-200 shadow-md shadow-amber-500/20"
                >
                  <span>Join The Guestbook</span>
                  <ArrowRight size={14} />
                </button>
              </form>
            )}
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="border-t border-white/[0.08] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4 text-xs text-slate-500">
          <p>
            &copy; {new Date().getFullYear()} Tartuca Artisanal Ristorante. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/privacy" className="hover:text-amber-400 transition-colors">Privacy Policy</Link>
            <span className="text-slate-700">•</span>
            <Link to="/terms" className="hover:text-amber-400 transition-colors">Terms of Service</Link>
            <span className="text-slate-700">•</span>
            <Link to="/book-table" className="hover:text-amber-400 transition-colors">Private Bookings</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
