import { useState, useEffect } from 'react';
import { Search, Star, Filter, SlidersHorizontal, Plus } from 'lucide-react';
import { MenuItemSkeleton } from '../components/common/Skeleton';
import { fetchMenuItems, fetchCategories } from '../services/api';
import { useCart } from '../context/CartContext';

function MenuPage() {
  const [activeCategory, setActiveCategory] = useState('all');
  const [priceRange, setPriceRange] = useState(100);
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
        setMenuItems(itemsData);
        setCategories([
            { id: 'all', name: 'All Items', slug: 'all', count: itemsData.length, icon: '🍔' },
            ...catsData.map(c => ({...c, count: itemsData.filter(i => i.category_id === c.id).length, icon: '🍽️'}))
        ]);
      } catch (error) {
        console.error("Failed to load menu data", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadData();
  }, []);

  const filteredItems = activeCategory === 'all' 
    ? menuItems 
    : menuItems.filter(item => {
        const cat = categories.find(c => c.id === activeCategory);
        return item.category_id === cat?.id; // backend uses category_id
    });

  const handleAddToCart = (item) => {
    addToCart({
        id: item.id,
        name: item.name,
        price: parseFloat(item.price),
        image: item.image_url,
        type: 'menu_item'
    });
  };

  return (
    <div className="bg-light min-h-screen pb-20">
      {/* Search & Filters */}
      <div className="pt-8 pb-2">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="relative flex-1 max-w-lg">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input 
              type="text" 
              placeholder="Search for dishes, desserts..." 
              className="w-full pl-12 pr-4 py-3 bg-white border-none rounded-xl shadow-sm focus:ring-2 focus:ring-primary/20 focus:outline-none"
            />
          </div>
          
          <div className="flex items-center gap-4">
            <button className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-primary hover:text-primary transition-colors shadow-sm">
              <SlidersHorizontal size={18} />
              Filters
            </button>
            <select className="px-4 py-2 bg-white border border-gray-200 rounded-lg text-sm font-medium hover:border-primary focus:outline-none cursor-pointer shadow-sm">
              <option>Recommended</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Rating: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="hidden lg:block space-y-8">
            {/* Categories */}
            <div>
              <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4">Menu Category</h3>
              <div className="space-y-2">
                {categories.map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setActiveCategory(cat.id)}
                    className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all ${
                      activeCategory === cat.id 
                        ? 'bg-primary text-white shadow-lg shadow-primary/30' 
                        : 'text-gray-600 hover:bg-white hover:text-primary'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-lg">{cat.icon}</span>
                      <span className="font-medium">{cat.name}</span>
                    </div>
                    {activeCategory === cat.id && (
                      <span className="bg-white/20 px-2 py-0.5 rounded text-xs font-bold">{cat.count}</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Price Range */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <div className="flex items-center justify-between mb-4">
                <h3 className="font-bold text-dark">Price Range</h3>
                <span className="text-primary font-bold text-sm">$0 - ${priceRange}</span>
              </div>
              <input 
                type="range" 
                min="0" 
                max="100" 
                value={priceRange} 
                onChange={(e) => setPriceRange(e.target.value)}
                className="w-full h-2 bg-gray-100 rounded-lg appearance-none cursor-pointer accent-primary"
              />
            </div>

            {/* Dietary */}
            <div className="bg-white p-6 rounded-2xl shadow-sm">
              <h3 className="font-bold text-dark mb-4">Dietary</h3>
              <div className="space-y-3">
                {['Vegetarian', 'Vegan', 'Gluten Free'].map((option) => (
                  <label key={option} className="flex items-center gap-3 cursor-pointer group">
                    <div className="w-5 h-5 border-2 border-gray-200 rounded flex items-center justify-center group-hover:border-primary transition-colors">
                      {/* Checkbox logic would go here */}
                    </div>
                    <span className="text-gray-600 group-hover:text-dark transition-colors">{option}</span>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            <h2 className="text-2xl font-bold text-dark mb-6">Popular Dishes</h2>
            
            {isLoading ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                <MenuItemSkeleton count={6} />
              </div>
            ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-3xl p-4 shadow-sm hover:shadow-xl transition-all duration-300 group border border-transparent hover:border-gray-100">
                  <div className="relative h-48 rounded-2xl overflow-hidden mb-4">
                    <img 
                      src={item.image_url || 'https://via.placeholder.com/300'} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                    />
                    <div className="absolute top-3 right-3 bg-white px-2 py-1 rounded-lg flex items-center gap-1 shadow-sm">
                      <Star size={14} className="text-secondary fill-secondary" />
                      <span className="text-xs font-bold">{4.5}</span>
                    </div>
                    {item.is_vegetarian && (
                      <div className="absolute top-3 left-3 bg-green-500 text-white text-[10px] font-bold px-2 py-1 rounded-lg uppercase tracking-wide">
                        Veg
                      </div>
                    )}
                  </div>
                  
                  <div className="mb-4">
                    <h3 className="font-bold text-dark text-lg mb-1">{item.name}</h3>
                    <p className="text-gray-500 text-xs line-clamp-2">{item.description}</p>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-primary">${item.price}</span>
                    <button 
                        onClick={() => handleAddToCart(item)}
                        className="w-10 h-10 rounded-xl bg-gray-50 text-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors shadow-sm hover:shadow-lg hover:shadow-primary/30"
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
