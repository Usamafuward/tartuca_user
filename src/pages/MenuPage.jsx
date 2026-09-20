import { useState, useEffect, useMemo } from 'react';
import { Search, Star, Filter, SlidersHorizontal, Plus, X, RotateCcw } from 'lucide-react';
import { MenuItemSkeleton } from '../components/common/Skeleton';
import { fetchMenuItems, fetchCategories, API_URL } from '../services/api';
import { useCart } from '../context/CartContext';

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState('recommended');
  const [priceRange, setPriceRange] = useState(100);
  const [isVegetarianOnly, setIsVegetarianOnly] = useState(false);
  const [isGlutenFreeOnly, setIsGlutenFreeOnly] = useState(false);
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [menuItems, setMenuItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const { addToCart } = useCart();

  useEffect(() => {
    const loadData = async () => {
      try {
        const [itemsData, catsData] = await Promise.all([
          fetchMenuItems(),
          fetchCategories()
        ]);
        const mappedItems = itemsData.map(item => ({
          ...item,
          image: item.has_image ? `${API_URL}/menu-items/${item.id}/image` : (item.image_url || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500')
        }));
        setMenuItems(mappedItems);

        // Find max price to initialize slider nicely
        const maxP = mappedItems.reduce((acc, curr) => Math.max(acc, Number(curr.price) || 0), 50);
        setPriceRange(Math.ceil(maxP) || 100);

        setCategories([
          { id: 'all', name: 'All Items', slug: 'all', icon: '🍽️' },
          ...catsData.map(c => ({
            ...c,
            icon: c.name.toLowerCase().includes('pizza') ? '🍕' :
                  c.name.toLowerCase().includes('pasta') ? '🍝' :
                  c.name.toLowerCase().includes('dessert') ? '🍰' :
                  c.name.toLowerCase().includes('drink') || c.name.toLowerCase().includes('beverage') ? '🍷' :
                  c.name.toLowerCase().includes('salad') ? '🥗' : '🍽️'
          }))
        ]);
      } catch (error) {
        console.error("Failed to load menu data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const resetFilters = () => {
    setActiveCategory('all');
    setSearchQuery('');
    setSortBy('recommended');
    setIsVegetarianOnly(false);
    setIsGlutenFreeOnly(false);
    const maxP = menuItems.reduce((acc, curr) => Math.max(acc, Number(curr.price) || 0), 100);
    setPriceRange(Math.ceil(maxP));
  };

  const filteredItems = useMemo(() => {
    let result = menuItems.filter(item => {
      const matchesCategory = activeCategory === 'all' || item.category_id === activeCategory;
      const matchesSearch = !searchQuery || 
        item.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
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
      result.sort((a, b) => a.name.localeCompare(b.name));
    }

    return result;
  }, [menuItems, activeCategory, searchQuery, priceRange, isVegetarianOnly, isGlutenFreeOnly, sortBy]);

  const handleAddToCart = (item) => {
    addToCart({
      id: item.id,
      name: item.name,
      price: parseFloat(item.price),
      image: item.image,
      type: 'menu_item'
    });
  };

  const filterSidebar = (
    <div className="space-y-8">
      {/* Categories */}
      <div>
        <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Category</h3>
        <div className="space-y-1.5">
          {categories.map((cat) => {
            const count = cat.id === 'all' 
              ? menuItems.length 
              : menuItems.filter(i => i.category_id === cat.id).length;
            return (
              <button
                key={cat.id}
                onClick={() => {
                  setActiveCategory(cat.id);
                  setShowMobileFilters(false);
                }}
                className={`w-full flex items-center justify-between px-4 py-2.5 rounded-xl text-sm transition-all ${
                  activeCategory === cat.id 
                    ? 'bg-primary text-white shadow-md shadow-primary/20 font-semibold' 
                    : 'text-gray-600 hover:bg-white hover:text-primary font-medium'
                }`}
              >
                <div className="flex items-center gap-3">
                  <span className="text-base">{cat.icon}</span>
                  <span>{cat.name}</span>
                </div>
                <span className={`px-2 py-0.5 rounded text-xs font-bold ${activeCategory === cat.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-dark text-sm">Max Price</h3>
          <span className="text-primary font-bold text-sm">${priceRange}</span>
        </div>
        <input 
          type="range" 
          min="1" 
          max="150" 
          value={priceRange} 
          onChange={(e) => setPriceRange(Number(e.target.value))}
          className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
        />
        <div className="flex justify-between text-[11px] text-gray-400 mt-1">
          <span>$1</span>
          <span>$150</span>
        </div>
      </div>

      {/* Dietary */}
      <div className="bg-white p-5 rounded-2xl shadow-sm border border-gray-100">
        <h3 className="font-bold text-dark text-sm mb-3">Dietary Options</h3>
        <div className="space-y-3">
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={isVegetarianOnly}
              onChange={(e) => setIsVegetarianOnly(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
            />
            <span className="text-sm text-gray-600 font-medium">Vegetarian</span>
          </label>
          <label className="flex items-center gap-3 cursor-pointer select-none">
            <input 
              type="checkbox"
              checked={isGlutenFreeOnly}
              onChange={(e) => setIsGlutenFreeOnly(e.target.checked)}
              className="w-4 h-4 rounded text-primary focus:ring-primary accent-primary"
            />
            <span className="text-sm text-gray-600 font-medium">Gluten Free</span>
          </label>
        </div>
      </div>

      {/* Reset Filter Button */}
      <button 
        onClick={resetFilters}
        className="w-full py-2.5 px-4 rounded-xl border border-gray-200 text-gray-600 hover:text-primary hover:border-primary text-xs font-bold transition-all flex items-center justify-center gap-2"
      >
        <RotateCcw size={14} />
        Reset All Filters
      </button>
    </div>
  );

  return (
    <div className="bg-light min-h-screen pb-20">
      {/* Search & Filters */}
      <div className="pt-8 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for pizza, pasta, desserts..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-10 py-3 bg-white border border-gray-100 rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none text-sm"
            />
            {searchQuery && (
              <button 
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
              >
                <X size={16} />
              </button>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setShowMobileFilters(true)}
              className="lg:hidden flex items-center gap-2 px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-primary hover:text-primary transition-colors shadow-sm"
            >
              <SlidersHorizontal size={18} />
              Filters
            </button>
            <select 
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="px-4 py-2.5 bg-white border border-gray-200 rounded-xl text-sm font-medium hover:border-primary focus:outline-none cursor-pointer shadow-sm"
            >
              <option value="recommended">Recommended</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="name">Name: A to Z</option>
            </select>
          </div>
        </div>
      </div>

      {/* Mobile Filters Modal */}
      {showMobileFilters && (
        <div className="fixed inset-0 bg-black/50 z-50 lg:hidden flex justify-end">
          <div className="bg-white w-80 h-full p-6 overflow-y-auto flex flex-col justify-between">
            <div>
              <div className="flex items-center justify-between pb-4 mb-6 border-b border-gray-100">
                <h2 className="text-lg font-bold text-dark">Filters</h2>
                <button onClick={() => setShowMobileFilters(false)} className="text-gray-400 hover:text-dark">
                  <X size={20} />
                </button>
              </div>
              {filterSidebar}
            </div>
            <button
              onClick={() => setShowMobileFilters(false)}
              className="w-full mt-6 bg-primary text-white py-3 rounded-xl font-bold shadow-md shadow-primary/20"
            >
              Apply Filters ({filteredItems.length})
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block">
            {filterSidebar}
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-dark">
                {activeCategory === 'all' 
                  ? 'All Menu Items' 
                  : categories.find(c => c.id === activeCategory)?.name || 'Menu Items'}
              </h2>
              <span className="text-sm text-gray-500 font-medium">
                {filteredItems.length} {filteredItems.length === 1 ? 'dish' : 'dishes'} found
              </span>
            </div>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MenuItemSkeleton count={6} />
              </div>
            ) : filteredItems.length === 0 ? (
              <div className="bg-white rounded-3xl p-12 text-center border border-gray-100 shadow-sm">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4 text-2xl">
                  🔍
                </div>
                <h3 className="text-xl font-bold text-dark mb-2">No dishes match your filters</h3>
                <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                  Try adjusting your search query, increasing your price range, or toggling dietary preferences.
                </p>
                <button
                  onClick={resetFilters}
                  className="px-6 py-2.5 bg-primary text-white text-sm font-bold rounded-xl hover:bg-primary-dark transition-all shadow-md shadow-primary/20"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredItems.map((item) => (
                  <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-100 flex flex-col justify-between">
                    <div>
                      <div className="relative h-48 rounded-2xl overflow-hidden mb-4 bg-gray-100">
                        <img 
                          src={item.image} 
                          alt={item.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          onError={(e) => {
                            e.target.src = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=500';
                          }}
                        />
                        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-xs px-2.5 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                          <Star size={13} className="text-amber-500 fill-amber-500" />
                          <span className="text-xs font-bold text-dark">4.8</span>
                        </div>
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                          {item.is_vegetarian && (
                            <span className="bg-green-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              Veg
                            </span>
                          )}
                          {item.is_gluten_free && (
                            <span className="bg-amber-600 text-white text-[10px] font-bold px-2 py-0.5 rounded-md uppercase tracking-wider shadow-sm">
                              Gluten Free
                            </span>
                          )}
                        </div>
                      </div>
                      
                      <div className="mb-4">
                        <h3 className="font-bold text-dark text-lg mb-1">{item.name}</h3>
                        <p className="text-gray-500 text-xs line-clamp-2 leading-relaxed">{item.description}</p>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between pt-2 border-t border-gray-50">
                      <span className="text-xl font-extrabold text-primary">${Number(item.price).toFixed(2)}</span>
                      <button 
                        onClick={() => handleAddToCart(item)}
                        className="w-10 h-10 rounded-xl bg-gray-50 text-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm hover:shadow-lg hover:shadow-primary/30 active:scale-95"
                        title="Add to Order"
                      >
                        <Plus size={20} />
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
