import { useState, useEffect, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { 
  Search, Star, SlidersHorizontal, Plus, X, RotateCcw, 
  Sparkles, Leaf, Wheat, Utensils, Flame, ArrowRight, ChevronDown 
} from 'lucide-react';
import { MenuItemSkeleton } from '../components/common/Skeleton';
import { fetchMenuItems, fetchCategories, fetchSpecialOffers, API_URL } from '../services/api';
import { useCart } from '../context/CartContext';
import { useToast } from '../context/ToastContext';

function MenuPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const initialCategory = searchParams.get('category') || 'all';

  const [menuType, setMenuType] = useState(() => {
    return initialCategory === 'specials' ? 'specials' : 'regular';
  });
  const [activeCategory, setActiveCategory] = useState(
    initialCategory === 'specials' ? 'all' : String(initialCategory)
  );
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState(150);
  const [isVegetarianOnly, setIsVegetarianOnly] = useState(false);
  const [isGlutenFreeOnly, setIsGlutenFreeOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [specialOffers, setSpecialOffers] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();
  const { showToast } = useToast?.() || { showToast: () => {} };

  // Sync category param if URL changes
  useEffect(() => {
    const cat = searchParams.get('category');
    if (cat === 'specials') {
      setMenuType('specials');
      setActiveCategory('all');
    } else if (cat) {
      setMenuType('regular');
      setActiveCategory(String(cat));
    } else {
      setMenuType('regular');
      setActiveCategory('all');
    }
  }, [searchParams]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, catsData, offersData] = await Promise.all([
          fetchMenuItems().catch(() => []),
          fetchCategories().catch(() => []),
          fetchSpecialOffers().catch(() => [])
        ]);

        const mappedItems = itemsData.map(item => ({
          ...item,
          image: item.has_image 
            ? `${API_URL}/menu-items/${item.id}/image` 
            : (item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500'),
          type: 'menu_item'
        }));
        setMenuItems(mappedItems);

        const mappedOffers = offersData.map(offer => ({
          id: offer.id,
          name: offer.title,
          description: offer.description,
          price: parseFloat(offer.price) || 0,
          image: offer.has_image 
            ? `${API_URL}/special-offers/${offer.id}/image` 
            : (offer.image_url || 'https://images.unsplash.com/photo-1544025162-d76694265947?w=500'),
          badge: offer.badge_text || "Chef's Special",
          badgeColor: offer.badge_color || "bg-amber-500",
          type: 'special_offer',
          rating: 4.9,
          is_vegetarian: false,
          is_gluten_free: false
        }));
        setSpecialOffers(mappedOffers);

        const maxP = mappedItems.reduce((acc, curr) => Math.max(acc, Number(curr.price) || 0), 60);
        setPriceRange(Math.ceil(maxP) || 120);

        setCategories([
          { id: 'all', name: 'All Dishes', slug: 'all' },
          ...catsData
        ]);
      } catch (error) {
        console.error("Failed to load menu data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const handleSwitchMenuType = (type) => {
    setMenuType(type);
    setActiveCategory('all');
    const newParams = new URLSearchParams(searchParams);
    if (type === 'specials') {
      newParams.set('category', 'specials');
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams, { preventScrollReset: true });
  };

  const handleSelectCategory = (catId) => {
    const idStr = String(catId);
    setActiveCategory(idStr);
    const newParams = new URLSearchParams(searchParams);
    if (idStr === 'all') {
      newParams.delete('category');
    } else {
      newParams.set('category', idStr);
    }
    setSearchParams(newParams, { preventScrollReset: true });
  };

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('recommended');
    setIsVegetarianOnly(false);
    setIsGlutenFreeOnly(false);
    const maxP = menuType === 'specials'
      ? specialOffers.reduce((acc, curr) => Math.max(acc, Number(curr.price) || 0), 100)
      : menuItems.reduce((acc, curr) => Math.max(acc, Number(curr.price) || 0), 100);
    setPriceRange(Math.ceil(maxP));
    const newParams = new URLSearchParams(searchParams);
    if (menuType === 'specials') {
      newParams.set('category', 'specials');
    } else {
      newParams.delete('category');
    }
    setSearchParams(newParams, { preventScrollReset: true });
  };

  // Filtered dishes
  const filteredItems = useMemo(() => {
    if (menuType === 'specials') {
      let result = specialOffers.filter(item => {
        const matchesSearch = !searchQuery || 
          item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
          (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
        const matchesPrice = Number(item.price) <= priceRange;
        return matchesSearch && matchesPrice;
      });

      if (sortBy === 'price-low') {
        result.sort((a, b) => Number(a.price) - Number(b.price));
      } else if (sortBy === 'price-high') {
        result.sort((a, b) => Number(b.price) - Number(a.price));
      } else if (sortBy === 'name') {
        result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
      }
      return result;
    }

    let result = menuItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || String(item.category_id) === String(activeCategory);
      const matchesSearch = !searchQuery || 
        item.name?.toLowerCase().includes(searchQuery.toLowerCase()) || 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase()));
      const matchesPrice = Number(item.price) <= priceRange;
      const matchesVeg = !isVegetarianOnly || item.is_vegetarian;
      const matchesGF = !isGlutenFreeOnly || item.is_gluten_free;

      return matchesCategory && matchesSearch && matchesPrice && matchesVeg && matchesGF;
    });

    if (sortBy === 'price-low') {
      result.sort((a, b) => Number(a.price) - Number(b.price));
    } else if (sortBy === 'price-high') {
      result.sort((a, b) => Number(b.price) - Number(a.price));
    } else if (sortBy === 'name') {
      result.sort((a, b) => (a.name || '').localeCompare(b.name || ''));
    }

    return result;
  }, [menuType, menuItems, specialOffers, activeCategory, searchQuery, priceRange, isVegetarianOnly, isGlutenFreeOnly, sortBy]);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image,
      type: item.type || 'menu_item'
    });
    if (showToast) showToast(`Added "${item.name}" to order!`, 'success');
  };

  const filterSidebar = (
    <div className="space-y-6">
      {/* Chef's Specials (Specials Only) */}
      {menuType === 'specials' && (
        <div className="glass-card p-5 rounded-2xl border border-amber-500/30 bg-amber-500/[0.03]">
          <div className="flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-wider mb-2">
            <Flame size={15} /> Chef's Specials
          </div>
          <p className="text-xs text-slate-400 leading-relaxed">
            Featured chef's specials, signature curries, fresh seafood creations, and seasonal dishes crafted daily in our kitchen.
          </p>
        </div>
      )}

      {/* Price Range Slider */}
      <div className="glass-card p-5 rounded-2xl border border-white/10">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300">
            Price Ceiling
          </h3>
          <span className="text-amber-400 font-extrabold text-sm font-sans">${priceRange}</span>
        </div>
        <input 
          type="range" 
          min="5" 
          max="150" 
          value={priceRange} 
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-1.5 bg-white/10 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <div className="flex justify-between text-[10px] text-slate-500 mt-2 font-mono">
          <span>$5</span>
          <span>$150+</span>
        </div>
      </div>

      {/* Dietary Preferences (Regular Menu Only) */}
      {menuType === 'regular' && (
        <div className="glass-card p-5 rounded-2xl border border-white/10">
          <h3 className="text-xs font-bold uppercase tracking-[0.2em] text-slate-300 mb-4">
            Dietary Filters
          </h3>
          <div className="space-y-3">
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input 
                type="checkbox"
                checked={isVegetarianOnly}
                onChange={(e) => setIsVegetarianOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 group-hover:text-white font-medium flex items-center gap-1.5">
                <Leaf size={14} className="text-emerald-400" /> Vegetarian
              </span>
            </label>
            <label className="flex items-center gap-3 cursor-pointer select-none group">
              <input 
                type="checkbox"
                checked={isGlutenFreeOnly}
                onChange={(e) => setIsGlutenFreeOnly(e.target.checked)}
                className="w-4 h-4 rounded border-white/20 bg-white/5 text-amber-500 focus:ring-amber-500 accent-amber-500 cursor-pointer"
              />
              <span className="text-xs text-slate-300 group-hover:text-white font-medium flex items-center gap-1.5">
                <Wheat size={14} className="text-amber-400" /> Gluten-Free
              </span>
            </label>
          </div>
        </div>
      )}

      {/* Reset Filter Button */}
      <button 
        onClick={resetFilters}
        className="w-full py-3 px-4 rounded-xl border border-white/10 text-slate-400 hover:text-white hover:border-amber-400/40 text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 bg-white/[0.02]"
      >
        <RotateCcw size={13} />
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="min-h-screen pb-24">
      
      {/* Luxury Hero Banner */}
      <div className="relative py-24 sm:py-28 bg-[#FAF7F2] dark:bg-[#050608] border-b border-stone-200/80 dark:border-white/[0.08] overflow-hidden mb-12">
        <div className="absolute inset-0 opacity-50 bg-[url('https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&q=80&w=2000')] bg-cover bg-center" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#FAF7F2] via-[#FAF7F2]/80 to-[#FAF7F2]/60 dark:from-[#050608] dark:via-[#050608]/60 dark:to-[#050608]/75" />
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-700 dark:bg-amber-500/20 dark:border-amber-500/40 dark:text-amber-300 text-xs font-bold uppercase tracking-wider mb-6 backdrop-blur-md shadow-sm">
            <Sparkles size={13} className="text-amber-600 dark:text-amber-400" />
            <span>Authentic Sri Lankan & Diverse Cuisine</span>
          </div>
          <h1 className="text-5xl sm:text-6xl lg:text-7xl font-serif font-bold mb-6 tracking-tight text-stone-900 dark:text-white drop-shadow-sm dark:drop-shadow-lg">
            The Tartuca Menu
          </h1>
          <p className="text-base sm:text-lg text-stone-600 dark:text-slate-200 max-w-2xl mx-auto leading-relaxed font-normal">
            Aromatic Sri Lankan curries, ocean-fresh seafood, signature grills, woodfired pizzas, and handcrafted culinary favorites.
          </p>

          {/* Quick Pillars */}
          <div className="mt-8 inline-flex flex-wrap items-center justify-center gap-3 sm:gap-6 px-6 py-2.5 rounded-2xl bg-white/70 dark:bg-black/40 backdrop-blur-md border border-stone-200/80 dark:border-white/10 text-xs text-stone-600 dark:text-slate-300 shadow-sm">
            <div className="flex items-center gap-2">
              <Flame size={14} className="text-amber-500 dark:text-amber-400" />
              <span>Woodfired & Flame Grills</span>
            </div>
            <span className="hidden sm:inline text-stone-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <Leaf size={14} className="text-emerald-600 dark:text-emerald-400" />
              <span>Fresh Local Spices & Seafood</span>
            </div>
            <span className="hidden sm:inline text-stone-300 dark:text-slate-700">•</span>
            <div className="flex items-center gap-2">
              <Utensils size={14} className="text-amber-500 dark:text-amber-400" />
              <span>Crafted Fresh Daily</span>
            </div>
          </div>
        </div>
      </div>

      {/* Primary Menu Mode Switcher: Regular Menu vs Chef's Specials */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex justify-center">
          <div className="inline-flex p-1.5 rounded-2xl bg-stone-100/90 dark:bg-white/[0.04] border border-stone-200/80 dark:border-white/10 backdrop-blur-md shadow-sm">
            <button
              onClick={() => handleSwitchMenuType('regular')}
              className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 ${
                menuType === 'regular'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Utensils size={16} />
              <span>Regular Menu</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold font-mono transition-colors ${
                menuType === 'regular' ? 'bg-slate-950/20 text-slate-950' : 'bg-stone-200 text-stone-700 dark:bg-white/10 dark:text-slate-300'
              }`}>
                {menuItems.length}
              </span>
            </button>

            <button
              onClick={() => handleSwitchMenuType('specials')}
              className={`flex items-center gap-2.5 px-6 sm:px-8 py-3 rounded-xl text-xs sm:text-sm font-extrabold uppercase tracking-wider transition-all duration-300 ${
                menuType === 'specials'
                  ? 'bg-gradient-to-r from-amber-400 via-amber-500 to-amber-600 text-slate-950 shadow-md shadow-amber-500/25 scale-[1.02]'
                  : 'text-stone-600 dark:text-slate-400 hover:text-stone-900 dark:hover:text-white hover:bg-white/80 dark:hover:bg-white/[0.05]'
              }`}
            >
              <Flame size={16} className={menuType === 'specials' ? 'text-slate-950' : 'text-amber-500 dark:text-amber-400'} />
              <span>Chef's Specials</span>
              <span className={`text-[11px] px-2 py-0.5 rounded-full font-bold font-mono transition-colors ${
                menuType === 'specials' ? 'bg-slate-950/20 text-slate-950' : 'bg-amber-500/20 text-amber-700 dark:text-amber-300'
              }`}>
                {specialOffers.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Category (Regular Menu Only) */}
      {menuType === 'regular' ? (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 animate-in fade-in duration-300">
          {/* Mobile Category Dropdown */}
          <div className="sm:hidden max-w-md mx-auto">
            <label htmlFor="mobile-category-select" className="sr-only">Select Menu Category</label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500">
                <Utensils size={15} />
              </div>
              <select
                id="mobile-category-select"
                value={activeCategory}
                onChange={(e) => handleSelectCategory(e.target.value)}
                className="w-full appearance-none pl-10 pr-10 py-3 bg-stone-100/90 dark:bg-[#0F1117] border border-stone-300/80 dark:border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm cursor-pointer transition-colors"
              >
                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id} className="bg-white dark:bg-[#0E1015] text-stone-900 dark:text-white">
                    {cat.name}
                  </option>
                ))}
              </select>
              <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-500 dark:text-slate-400">
                <ChevronDown size={16} />
              </div>
            </div>
          </div>

          {/* Desktop & Tablet Category Pills */}
          <div className="hidden sm:flex justify-center gap-2 pb-2 flex-wrap">
            {categories.map((cat) => {
              const isSelected = String(activeCategory) === String(cat.id);
              return (
                <button
                  type="button"
                  key={cat.id}
                  onClick={() => handleSelectCategory(cat.id)}
                  className={`px-5 py-2.5 rounded-full text-xs font-bold uppercase tracking-wider whitespace-nowrap transition-all duration-200 border ${
                    isSelected
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-md shadow-amber-500/25'
                      : 'bg-white/80 dark:bg-white/[0.03] text-stone-600 dark:text-slate-300 border-stone-200/80 dark:border-white/10 hover:border-amber-400/50 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        </div>
      ) : (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8 animate-in fade-in duration-300">
          <div className="text-center max-w-xl mx-auto">
            <div className="inline-flex items-center gap-2 text-amber-400 text-xs font-bold uppercase tracking-widest px-3.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 mb-2">
              <Flame size={14} /> Limited-Edition Seasonal Offerings
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Exquisite tasting menus, rare harvest delicacies, and signature chef creations available for a limited dining window.
            </p>
          </div>
        </div>
      )}

      {/* Search & Sort Controls Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-8">
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
          
          {/* Search Bar */}
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder="Search curries, seafood, grills, pizzas, drinks..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-11 pr-10 py-3 bg-[#0F1117] border border-white/10 rounded-2xl text-white text-xs placeholder:text-slate-500 focus:outline-none focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/40 transition-all shadow-inner"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          {/* Mobile Filter Toggle & Sort Dropdown */}
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-3 bg-white/[0.04] border border-white/10 rounded-2xl text-xs font-bold text-slate-200 hover:text-white hover:border-white/20 transition-all"
            >
              <SlidersHorizontal size={15} className="text-amber-400" />
              <span>Filters</span>
            </button>

            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-3 bg-[#0F1117] border border-white/10 rounded-2xl text-xs font-bold text-slate-200 hover:border-white/20 focus:outline-none cursor-pointer"
            >
              <option value="recommended">Chef Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>

        </div>
      </div>

      {/* Mobile Filters Drawer Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 lg:hidden flex justify-end">
          <div className="bg-[#0E1015] border-l border-white/10 w-80 h-full p-6 overflow-y-auto flex flex-col justify-between animate-in slide-in-from-right duration-300">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-white/10">
                <h2 className="text-sm font-bold uppercase tracking-wider text-white">Menu Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-slate-400 hover:text-white p-1">
                  <X size={20} />
                </button>
              </div>
              {filterSidebar}
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 bg-gradient-to-r from-amber-400 to-amber-600 text-slate-950 py-3 rounded-xl font-extrabold text-xs uppercase tracking-wider shadow-md shadow-amber-500/20"
            >
              Show {filteredItems.length} Dishes
            </button>
          </div>
        </div>
      )}

      {/* Main Grid Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-4 gap-8">
          
          {/* Desktop Filter Sidebar */}
          <div className="hidden lg:block">
            <div className="sticky top-6">
              {filterSidebar}
            </div>
          </div>

          {/* Dishes Showcase Area */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl sm:text-2xl font-serif font-bold text-white">
                {menuType === 'specials' 
                  ? "Chef's Specials & Seasonal Creations"
                  : activeCategory === 'all' 
                  ? 'All A La Carte Dishes' 
                  : categories.find(c => String(c.id) === String(activeCategory))?.name || 'Menu Selections'}
              </h2>
              <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
                {filteredItems.length} {filteredItems.length === 1 ? 'creation' : 'creations'}
              </span>
            </div>
            
            {isLoading ? (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                <MenuItemSkeleton count={6} />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="glass-card rounded-3xl p-12 text-center border border-white/10">
                <div className="w-16 h-16 rounded-full bg-white/[0.04] border border-white/10 flex items-center justify-center mx-auto mb-4 text-2xl text-amber-400">
                  <Utensils size={28} />
                </div>
                <h3 className="text-lg font-serif font-bold text-white mb-2">No matching culinary dishes found</h3>
                <p className="text-slate-400 text-xs max-w-md mx-auto mb-6">
                  Try adjusting your keywords, increasing the price range, or loosening dietary filters.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-amber-500 text-slate-950 text-xs font-bold uppercase tracking-wider rounded-xl hover:bg-amber-400 transition-all shadow-md shadow-amber-500/25"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div 
                    key={`${item.id}-${item.type || 'item'}`}
                    className="glass-card rounded-3xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1 border border-white/[0.07] hover:border-amber-500/40 shadow-sm hover:shadow-2xl"
                  >
                    <div>
                      {/* Dish Thumbnail */}
                      <div className="relative h-48 bg-[#0F1117] overflow-hidden">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
                          }}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-[#151821] via-transparent to-transparent opacity-60" />

                        {/* Top Rating */}
                        <div className="absolute top-3 right-3 bg-black/75 backdrop-blur-md px-2 py-0.5 rounded-lg flex items-center gap-1 border border-white/15 shadow-sm">
                          <Star size={11} className="text-amber-400 fill-amber-400" />
                          <span className="text-[11px] font-bold !text-white text-white">{item.rating || 4.9}</span>
                        </div>

                        {/* Dietary or Special Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1">
                          {item.badge && (
                            <span className="bg-amber-500 text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              {item.badge}
                            </span>
                          )}
                          {item.is_vegetarian && (
                            <span className="bg-emerald-500/90 backdrop-blur-xs text-white text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              Veg
                            </span>
                          )}
                          {item.is_gluten_free && (
                            <span className="bg-amber-500/90 backdrop-blur-xs text-slate-950 text-[9px] font-extrabold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              Gluten Free
                            </span>
                          )}
                        </div>
                      </div>
                      
                      {/* Dish Information */}
                      <div className="p-5">
                        <h3 className="font-serif font-bold text-white text-base sm:text-lg mb-1.5 group-hover:text-amber-300 transition-colors line-clamp-1">
                          {item.name}
                        </h3>
                        <p className="text-slate-400 text-xs line-clamp-2 leading-relaxed font-normal">
                          {item.description || 'Prepared fresh with chef-selected seasonal harvest.'}
                        </p>
                      </div>
                    </div>
                    
                    {/* Price & Add to Order action */}
                    <div className="px-5 pb-5 pt-2 flex items-center justify-between border-t border-white/[0.06]">
                      <span className="text-lg font-extrabold text-amber-400 font-sans">
                        ${Number(item.price).toFixed(2)}
                      </span>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500/15 hover:bg-amber-500 text-amber-400 hover:text-slate-950 text-xs font-bold transition-all duration-200 border border-amber-500/30 hover:border-transparent active:scale-95"
                        title="Add to Order"
                      >
                        <Plus size={14} className="stroke-[2.5]" />
                        <span>Order</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}

export default MenuPage;
