import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, Sandwich, Salad, CakeSlice, 
  Martini, Utensils, Plus, ChevronLeft, ChevronRight, Quote,
  Calendar, Flame, Sparkles, Clock, ShieldCheck
} from 'lucide-react';
import { 
  fetchCategories, fetchMenuItems, fetchSpecialOffers, 
  fetchReviews, fetchGallery, API_URL 
} from '../services/api';
import { Skeleton, CategorySkeleton, MenuItemSkeleton } from '../components/common/Skeleton';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';
import { useSettings } from '../context/SettingsContext';

function HomePage() {
  const { addToCart } = useCart();
  const { showToast } = useToast?.() || { showToast: () => {} };
  const { settings, formatPrice } = useSettings();
  
  const getInitials = (name = '') => {
    const clean = name.trim();
    if (!clean) return 'TP';
    const parts = clean.split(/\s+/).filter(Boolean);
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
  };

  // State for Categories
  const [categories, setCategories] = useState([]);
  const [categoriesLoading, setCategoriesLoading] = useState(true);

  // State for Featured Items
  const [specialOffers, setSpecialOffers] = useState([]);
  const [offersLoading, setOffersLoading] = useState(true);

  // State for Testimonials
  const [testimonials, setTestimonials] = useState([]);
  const [testimonialsLoading, setTestimonialsLoading] = useState(true);

  // State for Atmosphere
  const [atmosphereImages, setAtmosphereImages] = useState([]);

  // Load Data
  useEffect(() => {
    const loadData = async () => {
      try {
        const [cats, items, offers, reviews, gallery] = await Promise.all([
          fetchCategories().catch(() => []),
          fetchMenuItems().catch(() => []),
          fetchSpecialOffers().catch(() => []),
          fetchReviews().catch(() => []),
          fetchGallery().catch(() => [])
        ]);
        
        // Icon mapping
        const getIcon = (slug = '') => {
          const s = slug.toLowerCase();
          if (s.includes('pizza') || s.includes('fast') || s.includes('bread')) return Sandwich;
          if (s.includes('salad') || s.includes('healthy') || s.includes('appetizer')) return Salad;
          if (s.includes('dessert') || s.includes('sweet') || s.includes('cake')) return CakeSlice;
          if (s.includes('drink') || s.includes('beverage') || s.includes('wine')) return Martini;
          return Utensils;
        };

        setCategories(cats.map((cat) => ({
          ...cat,
          icon: getIcon(cat.slug || cat.name),
          count: items.filter(i => i.category_id === cat.id).length + ' Items'
        })));
        setCategoriesLoading(false);

        const getBadgeClass = (color = '') => {
          if (!color) return 'bg-amber-500/90 text-slate-950';
          if (color.startsWith('bg-')) return color;
          const map = {
            red: 'bg-rose-500 text-white',
            blue: 'bg-sky-500 text-white',
            green: 'bg-emerald-500 text-white',
            yellow: 'bg-amber-400 text-slate-950',
            orange: 'bg-amber-500 text-slate-950',
            purple: 'bg-purple-500 text-white'
          };
          return map[color.toLowerCase()] || 'bg-amber-500 text-slate-950';
        };

        setSpecialOffers(offers.map(offer => ({
          id: offer.id,
          name: offer.title,
          description: offer.description,
          price: parseFloat(offer.price) || 0,
          image: offer.has_image ? `${API_URL}/special-offers/${offer.id}/image` : (offer.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500'),
          badge: offer.badge_text,
          badgeColor: getBadgeClass(offer.badge_color),
          rating: 4.9,
          reviews: 142
        })));
        setOffersLoading(false);

        setTestimonials(reviews.slice(0, 3).map(r => ({
          name: r.author_name,
          rating: r.rating,
          content: r.comment,
          avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(r.author_name || 'Guest')}&background=161922&color=F59E0B`
        })));
        setTestimonialsLoading(false);

        setAtmosphereImages(gallery.map(img => ({
          src: img.has_image ? `${API_URL}/gallery/${img.id}/image` : (img.image_url || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'),
          alt: img.alt_text || 'Tartuca Atmosphere'
        })).slice(0, 3));

      } catch (error) {
        console.error("Failed to load home page data", error);
        setCategoriesLoading(false);
        setOffersLoading(false);
        setTestimonialsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleAddOfferToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: item.price,
      image: item.image,
      type: 'special_offer'
    });
    if (showToast) showToast(`Added "${item.name}" to your order!`, 'success');
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 overflow-hidden">
      
      {/* 1. Balanced Cinematic Hero Section */}
      <section className="relative pt-6 sm:pt-10 lg:pt-12 pb-10 lg:pb-16 w-full flex items-center min-h-[calc(100vh-6rem)]">
        {/* Soft Ambient Light Cone */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[750px] h-[450px] bg-gradient-to-b from-amber-500/10 via-amber-600/[0.03] to-transparent rounded-full blur-[110px] pointer-events-none -z-10" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-12 gap-12 lg:gap-10 items-center">
            
            {/* Left Narrative Column */}
            <div className="lg:col-span-7 text-center lg:text-left z-10 flex flex-col items-center lg:items-start">
              
              {/* Sri Lankan Heritage Badge */}
              <div className="inline-flex items-center gap-2.5 px-4 py-1.5 rounded-full bg-white/70 dark:bg-white/[0.04] border border-amber-500/30 backdrop-blur-md mb-6 shadow-sm">
                <Sparkles size={14} className="text-amber-500 dark:text-amber-400" />
                <span className="text-xs font-bold uppercase tracking-[0.18em] text-amber-700 dark:text-amber-300">
                  Sri Lankan Culinary Heritage • Est. 2014
                </span>
              </div>
              
              {/* Hero Main Headline */}
              <h1 className="text-4xl sm:text-5xl lg:text-6xl font-serif font-bold text-stone-900 dark:text-white tracking-tight leading-[1.12] mb-5">
                Rich Spices, Seafood & <br />
                <span className="gold-gradient-text">
                  Signature Island Dishes.
                </span>
              </h1>
              
              <p className="text-stone-600 dark:text-slate-300 text-sm sm:text-base mb-6 max-w-xl mx-auto lg:mx-0 leading-relaxed font-normal">
                Authentic Sri Lankan cuisine and warm hospitality in Colombo. Experience traditional slow-simmered curries, ocean-fresh seafood, sizzling flame grills, woodfired pizzas, and handcrafted delicacies prepared with genuine local spices.
              </p>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start w-full sm:w-auto mb-8">
                <Link
                  to="/menu"
                  className="flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 px-8 py-3.5 rounded-xl font-bold text-xs uppercase tracking-wider shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all duration-200"
                >
                  <span>Explore Menu</span>
                  <ArrowRight size={17} />
                </Link>
                
                <Link
                  to="/book-table"
                  className="flex items-center justify-center gap-2 px-8 py-3.5 rounded-xl font-bold text-xs text-stone-800 dark:text-slate-200 bg-white/80 dark:bg-white/[0.04] border border-stone-300/80 dark:border-white/10 hover:border-amber-400/50 hover:bg-white dark:hover:bg-white/[0.08] transition-all duration-200 shadow-sm"
                >
                  <Calendar size={17} className="text-amber-500 dark:text-amber-400" />
                  <span>Reserve Table</span>
                </Link>
              </div>

              {/* Social Proof & Quick Highlights */}
              <div className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6 pt-6 border-t border-stone-200/80 dark:border-white/[0.08] w-full max-w-xl">
                <div className="flex items-center gap-3">
                  <div className="flex -space-x-2.5">
                    {[
                      'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=100&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&auto=format&fit=crop&q=80',
                      'https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=100&auto=format&fit=crop&q=80'
                    ].map((img, i) => (
                      <img 
                        key={i} 
                        src={img} 
                        alt="Diner" 
                        className="w-9 h-9 rounded-full border-2 border-white dark:border-[#08090C] object-cover shadow-sm"
                      />
                    ))}
                    <div className="w-9 h-9 rounded-full border-2 border-white dark:border-[#08090C] bg-amber-500 text-slate-950 text-xs flex items-center justify-center font-black">
                      +4k
                    </div>
                  </div>
                  <div>
                    <div className="flex gap-1 text-amber-500 dark:text-amber-400">
                      {[1, 2, 3, 4, 5].map((i) => (
                        <Star key={i} size={14} fill="currentColor" strokeWidth={0} />
                      ))}
                    </div>
                    <p className="text-xs text-stone-500 dark:text-slate-400 font-medium mt-0.5">
                      <strong className="text-stone-900 dark:text-white">4.9 / 5.0</strong> from 2,400+ diners
                    </p>
                  </div>
                </div>

                <div className="hidden sm:block w-px h-8 bg-stone-300 dark:bg-white/10" />

                <div className="flex items-center gap-4 text-xs font-semibold text-stone-600 dark:text-slate-300">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-500" />
                    <span>Kitchen Open</span>
                  </div>
                  <span>•</span>
                  <span>Authentic Spices</span>
                </div>
              </div>
            </div>

            {/* Right Visual Focal Point - Zoomed & Enhanced Circular Dish Showcase */}
            <div className="lg:col-span-5 relative flex justify-center lg:justify-end">
              <div className="relative w-80 sm:w-[420px] lg:w-[460px] xl:w-[490px] aspect-square">
                
                {/* Decorative Glowing Rings */}
                <div className="absolute inset-0 rounded-full border border-amber-500/25 scale-105 pointer-events-none animate-pulse duration-3000" />
                <div className="absolute inset-0 rounded-full border border-dashed border-amber-500/30 dark:border-white/15 scale-115 pointer-events-none" />
                
                {/* Main Hero Featured Dish Circle (Zoomed & Vibrant) */}
                <div className="w-full h-full rounded-full overflow-hidden border-4 border-white/60 dark:border-white/10 shadow-2xl shadow-stone-900/20 dark:shadow-black/80 bg-stone-100 dark:bg-[#151821] relative z-10 group">
                  <img 
                    src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1200" 
                    alt="Signature Sri Lankan Culinary Dish" 
                    className="w-full h-full object-cover scale-110 group-hover:scale-115 transition-transform duration-700 ease-out"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent" />
                </div>

                {/* Floating Highlight Badge 1: 30% Off First Order */}
                <div className="absolute -bottom-3 -left-3 bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-xl p-3.5 pr-6 rounded-2xl shadow-2xl border border-stone-200/80 dark:border-white/10 flex items-center gap-3.5 z-20 hover:scale-105 transition-transform">
                  <div className="w-11 h-11 bg-amber-500/15 border border-amber-500/30 rounded-xl flex items-center justify-center text-amber-500 dark:text-amber-400 shrink-0">
                    <Flame size={22} />
                  </div>
                  <div>
                    <p className="font-extrabold text-stone-900 dark:text-white text-xs sm:text-sm">30% Off First Order</p>
                    <p className="text-[11px] text-amber-600 dark:text-amber-400 font-semibold tracking-wide uppercase">Use code: TARTUCA30</p>
                  </div>
                </div>

                {/* Floating Highlight Badge 2: Delivery Speed */}
                <div className="absolute top-4 -right-2 bg-white/95 dark:bg-[#0F1117]/95 backdrop-blur-xl p-3 px-4 rounded-2xl shadow-2xl border border-stone-200/80 dark:border-white/10 flex items-center gap-2.5 z-20">
                  <Clock size={16} className="text-amber-500 dark:text-amber-400" />
                  <span className="text-xs font-bold text-stone-800 dark:text-slate-200">
                    Delivery: {settings.min_delivery_time || 25}-{settings.max_delivery_time || 45} min
                  </span>
                </div>

              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 2. Chef's Special Offers / Menu Highlights */}
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center md:justify-between mb-12 gap-4">
            <div>
              <span className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
                Popular Choices
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
                Chef’s Special Dishes
              </h2>
            </div>
            <Link 
              to="/menu?category=specials"
              className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 flex items-center gap-1.5"
            >
              <span>View All Specials</span>
              <ArrowRight size={14} />
            </Link>
          </div>

          {offersLoading ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              <MenuItemSkeleton count={4} />
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialOffers.slice(0, 4).map((item) => (
                <div
                  key={item.id}
                  className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 border border-stone-200/80 dark:border-white/10"
                >
                  {/* Dish Image */}
                  <div className="relative h-52 bg-stone-100 dark:bg-[#0F1117] overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" 
                      onError={(e) => {
                        e.target.src = 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#151821] via-transparent to-transparent opacity-60" />
                    
                    {item.badge && (
                      <span className={`absolute top-3.5 left-3.5 ${item.badgeColor} text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase tracking-wider shadow-md`}>
                        {item.badge}
                      </span>
                    )}

                    <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md px-2.5 py-1 rounded-lg flex items-center gap-1 border border-white/15 shadow-sm">
                      <Star size={12} className="text-amber-400 fill-amber-400" />
                      <span className="text-xs font-bold !text-white text-white">{item.rating}</span>
                    </div>
                  </div>

                  {/* Dish Content */}
                  <div className="p-5 flex flex-col flex-1 justify-between">
                    <div>
                      <div className="flex justify-between items-baseline gap-2 mb-2">
                        <h3 className="font-serif font-bold text-stone-900 dark:text-white text-lg group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                      </div>
                      
                      <p className="text-stone-600 dark:text-slate-400 text-xs mb-4 line-clamp-2 leading-relaxed">
                        {item.description}
                      </p>
                    </div>

                    <div className="flex items-center justify-between pt-3 border-t border-stone-200/80 dark:border-white/[0.08]">
                      <span className="text-xl font-extrabold text-amber-600 dark:text-amber-400 font-sans">
                        {formatPrice(item.price)}
                      </span>
                      
                      <button 
                        onClick={() => handleAddOfferToCart(item)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-700 dark:text-amber-400 hover:text-slate-950 text-xs font-bold transition-all duration-200 border border-amber-500/30 hover:border-transparent active:scale-95"
                        title="Add to order"
                      >
                        <Plus size={15} className="stroke-[2.5]" />
                        <span>Add</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* 3. Artisanal Categories Section */}
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-center justify-between mb-12 gap-4">
            <div>
              <span className="text-amber-600 dark:text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
                Curated Selections
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-stone-900 dark:text-white tracking-tight">
                Explore by Category
              </h2>
            </div>
            <Link 
              to="/menu" 
              className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 hover:text-amber-500 dark:hover:text-amber-300 flex items-center gap-1.5 transition-colors group"
            >
              <span>Full Menu Catalogue</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          {categoriesLoading ? (
            <CategorySkeleton count={4} />
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {categories.slice(0, 4).map((cat) => {
                const IconComponent = cat.icon;
                return (
                  <Link
                    key={cat.id}
                    to={`/menu?category=${cat.id}`}
                    className="group glass-card p-6 sm:p-8 rounded-3xl flex flex-col items-center justify-center text-center transition-all duration-300 hover:-translate-y-1 relative overflow-hidden border border-stone-200/80 dark:border-white/10"
                  >
                    <div className="w-16 h-16 rounded-2xl bg-stone-100 dark:bg-white/[0.04] border border-stone-200/80 dark:border-white/[0.08] text-amber-600 dark:text-amber-400 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-amber-400/40 group-hover:bg-amber-500/10 group-hover:text-amber-700 dark:group-hover:text-amber-300 transition-all duration-300 shadow-sm">
                      <IconComponent size={28} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-stone-900 dark:text-white mb-1 group-hover:text-amber-600 dark:group-hover:text-amber-300 transition-colors">
                      {cat.name}
                    </h3>
                    <p className="text-xs text-stone-500 dark:text-slate-400 font-medium">
                      {cat.count}
                    </p>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </section>

      {/* 4. VIP Table Reservation Showcase Banner */}
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="relative rounded-3xl overflow-hidden border border-amber-500/25 dark:border-amber-500/30 bg-gradient-to-r from-[#FFFDF8] via-[#F6EFE3] to-[#EDE3D0] dark:from-[#141720] dark:via-[#1A1E29] dark:to-[#141720] p-8 sm:p-10 lg:p-14 shadow-2xl">
            {/* Background Ambient Glow */}
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-24 -right-24 w-72 h-72 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 grid lg:grid-cols-12 gap-8 lg:gap-12 items-center">
              
              {/* Left Column: Story & CTAs */}
              <div className="lg:col-span-7">
                <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-3 block">
                  Table Reservations
                </span>
                <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-white leading-tight mb-5">
                  Reserve a Table at Tartuca.
                </h2>
                <p className="text-slate-300 text-sm sm:text-base leading-relaxed mb-8 font-normal max-w-xl">
                  Enjoy genuine Sri Lankan hospitality. Whether you are planning a romantic dinner, a family gathering, or an evening with friends, reserve your table easily online.
                </p>

                <div className="flex flex-col sm:flex-row gap-4">
                  <Link
                    to="/book-table"
                    className="inline-flex items-center justify-center gap-2.5 bg-gradient-to-r from-amber-400 to-amber-600 hover:from-amber-300 hover:to-amber-500 text-slate-950 px-8 py-4 rounded-2xl font-extrabold text-sm uppercase tracking-wider shadow-lg shadow-amber-500/25 transition-all"
                  >
                    <Calendar size={18} className="stroke-[2.5]" />
                    <span>Reserve Table Online</span>
                  </Link>
                  <Link
                    to="/gallery"
                    className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-2xl font-bold text-sm text-slate-200 bg-white/[0.04] border border-white/10 hover:border-white/20 transition-all"
                  >
                    <span>View Restaurant Gallery</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </div>

              {/* Right Column: Featured Dining Visual */}
              <div className="lg:col-span-5 relative">
                <div className="relative rounded-3xl overflow-hidden shadow-2xl border border-white/15 group">
                  <div className="relative h-72 sm:h-80 lg:h-96 w-full overflow-hidden bg-[#0E1015]">
                    <img
                      src="https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?auto=format&fit=crop&q=80&w=1000"
                      alt="Tartuca Dining Room"
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent" />
                    
                    {/* Top Floating Badge */}
                    <div className="absolute top-4 right-4 z-10">
                      <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-black/70 backdrop-blur-md border border-white/20 text-xs font-bold !text-white text-white shadow-lg">
                        <Sparkles size={13} className="!text-amber-400 text-amber-400" />
                        <span>Woodfired Kitchen</span>
                      </div>
                    </div>

                    {/* Bottom Caption Overlay */}
                    <div className="absolute bottom-5 left-5 right-5 z-10">
                      <span className="!text-amber-400 text-amber-400 text-[10px] font-extrabold uppercase tracking-widest block mb-1">
                        Cozy & Welcoming Atmosphere
                      </span>
                      <h3 className="font-serif font-bold !text-white text-white text-lg sm:text-xl drop-shadow-md">
                        Authentic Dining & Warm Ambiance
                      </h3>
                      <p className="!text-slate-200 text-slate-200 text-xs mt-1 font-normal line-clamp-1">
                        Rich curries, fresh seafood, woodfired pizzas, and refreshing drinks.
                      </p>
                    </div>
                  </div>
                </div>
              </div>

            </div>
          </div>
        </div>
      </section>

      {/* 5. Atmosphere Gallery Preview */}
      <section className="relative w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
                Our Restaurant
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white tracking-tight">
                Atmosphere & Dining Space
              </h2>
            </div>
            <Link 
              to="/gallery" 
              className="text-amber-400 font-semibold text-xs uppercase tracking-wider hover:text-amber-300 flex items-center gap-1.5 transition-colors group"
            >
              <span>Explore Complete Gallery</span>
              <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-[480px]">
            {/* Left Large Showcase Image */}
            <div className="relative rounded-3xl overflow-hidden group h-full border border-white/10">
              <div 
                className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                style={{ backgroundImage: `url('${atmosphereImages[0]?.src || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'}')` }}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 z-10">
                <span className="!text-amber-400 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/40 mb-2 inline-block">
                  Main Dining Room
                </span>
                <h3 className="!text-white text-white font-serif text-xl font-bold drop-shadow-md">Cozy Indoor Dining</h3>
              </div>
            </div>

            {/* Right Two Stacked Images */}
            <div className="flex flex-col gap-6 h-full">
              <div className="relative flex-1 rounded-3xl overflow-hidden group border border-white/10">
                <div 
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url('${atmosphereImages[1]?.src || 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?w=800'}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 z-10">
                  <span className="!text-amber-400 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/40 mb-1 inline-block">
                    Garden Terrace
                  </span>
                  <h3 className="!text-white text-white font-serif text-lg font-bold drop-shadow-md">Outdoor Evening Seating</h3>
                </div>
              </div>

              <div className="relative flex-1 rounded-3xl overflow-hidden group border border-white/10">
                <div 
                  className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" 
                  style={{ backgroundImage: `url('${atmosphereImages[2]?.src || 'https://images.unsplash.com/photo-1550966871-3ed3cdb5ed0c?w=800'}')` }}
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-6 z-10">
                  <span className="!text-amber-400 text-amber-400 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-md bg-black/70 backdrop-blur-md border border-amber-500/40 mb-1 inline-block">
                    Beverage Bar
                  </span>
                  <h3 className="!text-white text-white font-serif text-lg font-bold drop-shadow-md">Crafted Beverages & Fresh Mocktails</h3>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Guest Testimonials / Acclaim */}
      {!testimonialsLoading && testimonials.length > 0 && (
        <section className="relative w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-16">
              <span className="text-amber-400 font-bold text-xs uppercase tracking-[0.2em] mb-2 block">
                Guest Reviews
              </span>
              <h2 className="text-3xl lg:text-4xl font-serif font-bold text-white mb-4">
                What Diners Say
              </h2>
              <p className="text-slate-400 max-w-xl mx-auto text-sm leading-relaxed">
                Read genuine feedback from guests who have dined with us.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              {testimonials.map((t, idx) => (
                <div
                  key={idx}
                  className="glass-card rounded-3xl p-8 flex flex-col justify-between relative group hover:border-amber-500/40 transition-all duration-300"
                >
                  <div>
                    <div className="flex items-center gap-3.5 mb-6">
                      <div className="w-12 h-12 rounded-full bg-linear-to-br from-amber-400 via-amber-500 to-amber-600 text-slate-950 font-serif font-black text-sm flex items-center justify-center shrink-0 shadow-md shadow-amber-500/20 border border-amber-300/40">
                        {getInitials(t.name)}
                      </div>
                      <div>
                        <h4 className="font-serif font-bold text-white text-base">{t.name}</h4>
                        <div className="flex gap-1 mt-1 text-amber-400">
                          {Array.from({ length: t.rating || 5 }).map((_, i) => (
                            <Star key={i} size={13} fill="currentColor" strokeWidth={0} />
                          ))}
                        </div>
                      </div>
                      <Quote size={32} className="ml-auto text-white/[0.06] group-hover:text-amber-500/20 transition-colors" />
                    </div>

                    <p className="text-slate-300 text-sm italic leading-relaxed mb-6 font-normal">
                      "{t.content}"
                    </p>
                  </div>

                  <div className="pt-4 border-t border-white/[0.06] flex items-center justify-between text-[11px] text-slate-500">
                    <span className="flex items-center gap-1 text-emerald-400 font-semibold">
                      <ShieldCheck size={14} /> Verified Diner
                    </span>
                    <span>Tartuca Reviews</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

    </div>
  );
}

export default HomePage;
