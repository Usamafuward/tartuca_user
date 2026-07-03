import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ArrowRight, Star, Sandwich, Salad, CakeSlice, 
  Martini, Utensils, Plus, ChevronLeft, ChevronRight, Quote 
} from 'lucide-react';
import { 
  fetchCategories, fetchMenuItems, fetchSpecialOffers, 
  fetchReviews, fetchGallery, API_URL 
} from '../services/api';
import { Skeleton, CategorySkeleton, MenuItemSkeleton } from '../components/common/Skeleton';
import { useCart } from '../context/CartContext';

function HomePage() {
  const { addToCart } = useCart();
  
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
            fetchCategories(),
            fetchMenuItems(),
            fetchSpecialOffers(),
            fetchReviews(),
            fetchGallery()
        ]);
        
        // Icon mapping
        const getIcon = (slug) => {
            if (slug.includes('pizza') || slug.includes('fast')) return Sandwich;
            if (slug.includes('salad') || slug.includes('healthy')) return Salad;
            if (slug.includes('dessert') || slug.includes('sweet')) return CakeSlice;
            if (slug.includes('drink')) return Martini;
            return Utensils;
        };

        // Colors for categories
        const colors = ['bg-orange-100 text-orange-600', 'bg-green-100 text-green-600', 'bg-blue-100 text-blue-600', 'bg-yellow-100 text-yellow-600', 'bg-purple-100 text-purple-600'];

        setCategories(cats.map((cat, index) => ({
            ...cat,
            icon: getIcon(cat.slug),
            color: colors[index % colors.length],
            count: items.filter(i => i.category_id === cat.id).length + ' Items'
        })));
        setCategoriesLoading(false);

        setSpecialOffers(offers.map(offer => ({
            id: offer.id,
            name: offer.title,
            description: offer.description,
            price: parseFloat(offer.price),
            image: offer.image_url,
            badge: offer.badge_text,
            badgeColor: offer.badge_color || 'bg-red-500',
            rating: 4.8, // Dummy rating
            reviews: 120 // Dummy reviews
        })));
        setOffersLoading(false);

        setTestimonials(reviews.slice(0, 3).map(r => ({
            name: r.author_name,
            rating: r.rating,
            content: r.comment,
            avatar: `https://ui-avatars.com/api/?name=${r.author_name}&background=random`
        })));
        setTestimonialsLoading(false);

        setAtmosphereImages(gallery.map(img => ({ src: img.image_url, alt: img.alt_text })).slice(0, 3));

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
  };

  return (
    <>
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-light pt-12 pb-24 lg:pt-12 lg:pb-36 w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
            {/* Left Content */}
            <div className="text-center lg:text-left z-10 flex flex-col items-center lg:items-start">
              <span className="inline-block bg-[#FFE5E0] text-primary px-4 py-1.5 rounded-full text-xs font-bold tracking-wide uppercase mb-8">
                Best In Town
              </span>
              
              <h1 className="text-5xl sm:text-6xl lg:text-7xl font-bold text-dark leading-[1.1] mb-8">
                Taste the <span className="relative inline-block text-dark after:content-[''] after:absolute after:bottom-2 after:left-0 after:w-full after:h-4 after:bg-[#FFE5E0] after:-z-10 after:rounded-full">Passion</span>
                <br />
                in Every Bite.
              </h1>
              
              <p className="text-gray-500 text-lg mb-10 max-w-lg mx-auto lg:mx-0 leading-relaxed">
                Experience a symphony of flavors crafted with fresh ingredients and authentic recipes. Delivered hot to your door or enjoyed in our cozy ambiance.
              </p>

              <div className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start mb-12">
                <Link
                  to="/menu"
                  className="bg-primary text-white px-8 py-4 rounded-xl font-bold hover:bg-primary-dark transition-all shadow-lg shadow-primary/30 flex items-center justify-center gap-2"
                >
                  Order Now <ArrowRight size={20} />
                </Link>
                <Link
                  to="/book-table"
                  className="bg-white text-dark border border-gray-200 px-8 py-4 rounded-xl font-bold hover:border-primary hover:text-primary transition-all flex items-center justify-center shadow-sm"
                >
                  Book a Table
                </Link>
              </div>

              {/* Social Proof */}
              <div className="flex items-center justify-center lg:justify-start gap-4">
                <div className="flex -space-x-4">
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="w-10 h-10 rounded-full border-2 border-white bg-gray-200 flex items-center justify-center overflow-hidden">
                       <span className="text-xl">{['👩', '👨', '🧑'][i-1]}</span>
                    </div>
                  ))}
                  <div className="w-10 h-10 rounded-full border-2 border-white bg-dark text-white text-xs flex items-center justify-center font-bold">
                    +2k
                  </div>
                </div>
                <div>
                  <div className="flex gap-0.5 text-secondary">
                    {[1, 2, 3, 4, 5].map((i) => (
                      <Star key={i} size={16} fill="currentColor" strokeWidth={0} />
                    ))}
                  </div>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">Happy Customers</p>
                </div>
              </div>
            </div>

            {/* Right Visual */}
            <div className="relative flex justify-center lg:justify-end">
              <div className="relative w-85 h-85 sm:w-112.5 sm:h-112.5 lg:w-137.5 lg:h-137.5">
                {/* Main Circle Image */}
                <div className="absolute inset-0 rounded-full overflow-hidden border-8 border-white shadow-2xl bg-dark">
                   <img 
                      src="https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&q=80&w=1000" 
                      alt="Delicious Salad Bowl" 
                      className="w-full h-full object-cover"
                   />
                </div>

                {/* Floating Badge */}
                <div className="absolute bottom-12 -left-4 sm:left-0 bg-white p-3 pr-6 rounded-2xl shadow-xl flex items-center gap-3 animate-bounce duration-3000">
                  <div className="w-12 h-12 bg-[#ECFDF5] rounded-full flex items-center justify-center text-accent">
                    <span className="text-2xl">🏷️</span>
                  </div>
                  <div>
                     <p className="font-bold text-dark text-lg">30% Off</p>
                     <p className="text-xs text-gray-500 font-medium">On first order</p>
                  </div>
                </div>
              </div>
              
              {/* Background Blob */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[120%] h-[120%] bg-primary/5 rounded-full blur-3xl -z-10"></div>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      {categoriesLoading ? (
        <section className="py-16 bg-white w-full">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
                <div className="text-center mb-12 flex justify-center">
                    <Skeleton className="h-10 w-64 rounded-lg" />
                </div>
                <CategorySkeleton count={4} />
            </div>
        </section>
      ) : (
        <section className="py-16 bg-white w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-12">
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-3">
                Browse by Category
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  to={`/menu?category=${cat.id}`}
                  className="group flex flex-col items-center justify-center p-10 rounded-3xl bg-gray-light hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 border border-transparent hover:border-gray-100 relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-bl from-white/50 to-transparent rounded-bl-full z-0"></div>
                  
                  <div className={`w-20 h-20 ${cat.color} rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-sm z-10 relative`}>
                    <cat.icon size={32} />
                  </div>
                  <h3 className="text-xl font-bold text-dark mb-1 z-10 relative">{cat.name}</h3>
                  <p className="text-gray text-sm z-10 relative">{cat.count}</p>
                </Link>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Featured Items Section */}
      {offersLoading ? (
        <section className="py-16 lg:py-24 bg-light w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row items-center md:justify-between mb-12 gap-6 md:gap-0">
              <div className="text-center md:text-left space-y-2">
                 <div className="h-4 bg-gray-200 w-32 rounded animate-pulse mx-auto md:mx-0" />
                 <div className="h-10 bg-gray-200 w-48 rounded animate-pulse mx-auto md:mx-0" />
              </div>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
               <MenuItemSkeleton count={4} />
            </div>
          </div>
        </section>
      ) : (
        <section className="py-16 lg:py-24 bg-light w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="flex flex-col md:flex-row items-center md:justify-between mb-12 gap-6 md:gap-0">
              <div className="text-center md:text-left">
                <span className="text-primary font-bold text-xs uppercase tracking-wider mb-2 block">
                  Menu Highlights
                </span>
                <h2 className="text-3xl lg:text-4xl font-bold text-dark">
                  Special Offers
                </h2>
              </div>
              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-full bg-white border border-gray-200 flex items-center justify-center text-dark hover:bg-primary hover:border-primary hover:text-white transition-colors">
                  <ChevronLeft size={20} />
                </button>
                <button className="w-10 h-10 rounded-full bg-primary flex items-center justify-center text-white hover:bg-primary-dark transition-colors">
                  <ChevronRight size={20} />
                </button>
              </div>
            </div>

            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {specialOffers.map((item) => (
                <div
                  key={item.id}
                  className="bg-white rounded-3xl overflow-hidden shadow-sm hover:shadow-xl transition-shadow duration-300 group border border-gray-100"
                >
                  {/* Image */}
                  <div className="relative h-48 bg-gray-50 flex items-center justify-center overflow-hidden">
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                    {item.badge && (
                      <span className={`absolute top-4 left-4 ${item.badgeColor} text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-wide shadow-md`}>
                        {item.badge}
                      </span>
                    )}
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="font-bold text-dark text-lg leading-tight flex-1 pr-2">
                        {item.name}
                      </h3>
                      <span className="font-bold text-primary text-lg">
                        ${item.price.toFixed(2)}
                      </span>
                    </div>
                    
                    <p className="text-gray-500 text-xs mb-4 line-clamp-2 min-h-[2.5em] leading-relaxed">
                      {item.description}
                    </p>

                    <div className="flex items-center justify-between pt-2">
                      <div className="flex items-center gap-1.5">
                        <Star size={14} className="text-secondary fill-secondary" />
                        <span className="text-sm font-bold text-dark">{item.rating}</span>
                        <span className="text-xs text-gray-400">({item.reviews})</span>
                      </div>
                      
                      <button 
                        onClick={() => handleAddOfferToCart(item)}
                        className="w-8 h-8 rounded-lg bg-gray-100 text-dark flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                    >
                        <Plus size={18} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
      
      {/* Testimonials Section */}
      {!testimonialsLoading && testimonials.length > 0 && (
        <section className="py-16 lg:py-24 bg-[#FFF5F2] w-full">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="text-center mb-16">
              <span className="text-primary font-bold text-xs uppercase tracking-wider mb-2 block">
                Testimonials
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-dark mb-4">
                What Our Customers Say
              </h2>
              <p className="text-gray max-w-xl mx-auto">
                We take pride in serving the best food with the best service. But don't just take our word for it.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {testimonials.map((testimonial, index) => (
                <div
                  key={index}
                  className="bg-white rounded-xl p-8 shadow-sm hover:shadow-xl transition-shadow duration-300 relative border-b-4 border-transparent hover:border-primary group"
                >
                  <div className="flex items-center gap-4 mb-6">
                    <div className="w-14 h-14 rounded-full bg-gray-100 overflow-hidden border-2 border-white shadow-sm">
                      <img src={testimonial.avatar} alt={testimonial.name} className="w-full h-full object-cover" />
                    </div>
                    <div>
                      <h4 className="font-bold text-dark text-lg">{testimonial.name}</h4>
                      <div className="flex gap-1 mt-1">
                        {Array.from({ length: testimonial.rating }).map((_, i) => (
                          <Star key={i} size={14} className="text-secondary fill-secondary" />
                        ))}
                      </div>
                    </div>
                    <Quote size={40} className="ml-auto text-gray-100 group-hover:text-primary/10 transition-colors" />
                  </div>

                  <p className="text-gray text-sm italic leading-relaxed">
                    "{testimonial.content}"
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* Atmosphere Section */}
      <section className="py-16 lg:py-24 bg-white w-full">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-4">
            <div>
              <span className="text-primary font-bold text-xs uppercase tracking-wider mb-2 block">
                Gallery
              </span>
              <h2 className="text-3xl lg:text-4xl font-bold text-dark">
                Our Atmosphere
              </h2>
            </div>
            <Link to="/gallery" className="text-primary font-semibold hover:text-primary-dark transition-colors flex items-center gap-2 group">
              View Full Gallery <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 h-150 md:h-125 lg:h-150">
            {/* Left Column - Large Image */}
            <div className="relative rounded-3xl overflow-hidden group h-full">
              <div className="absolute inset-0 bg-gray-200">
                {atmosphereImages[0] ? (
                  <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${atmosphereImages[0].src}')` }}></div>
                ) : (
                  <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                )}
              </div>
            </div>

            {/* Right Column - Two Stacked Images */}
            <div className="flex flex-col gap-6 h-full">
              <div className="relative flex-1 rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gray-200">
                  {atmosphereImages[1] ? (
                    <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${atmosphereImages[1].src}')` }}></div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
              </div>
              <div className="relative flex-1 rounded-3xl overflow-hidden group">
                <div className="absolute inset-0 bg-gray-200">
                  {atmosphereImages[2] ? (
                    <div className="w-full h-full bg-cover bg-center group-hover:scale-105 transition-transform duration-700" style={{ backgroundImage: `url('${atmosphereImages[2].src}')` }}></div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">No image</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

export default HomePage;
