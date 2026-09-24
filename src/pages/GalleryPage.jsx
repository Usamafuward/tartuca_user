import { useState, useEffect } from 'react';
import { Instagram, Sparkles, Camera, ChevronDown } from 'lucide-react';
import { fetchGallery, API_URL } from '../services/api';
import { GallerySkeleton } from '../components/common/Skeleton';

function GalleryPage() {
  const [activeTab, setActiveTab] = useState('All');
  const [images, setImages] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadGallery = async () => {
      try {
        const startTime = Date.now();
        const data = await fetchGallery().catch(() => []);
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 600) {
          await new Promise(resolve => setTimeout(resolve, 600 - elapsedTime));
        }
        
        setImages(data.map(img => ({
          id: img.id,
          category: img.category || 'Atmosphere',
          src: img.has_image ? `${API_URL}/gallery/${img.id}/image` : img.image_url,
          alt: img.alt_text || 'Tartuca Experience'
        })));
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  const tabs = ['All', ...new Set(images.map(img => img.category).filter(Boolean))];

  const filteredImages = activeTab === 'All' 
    ? images 
    : images.filter(img => img.category === activeTab);

  return (
    <div className="min-h-screen pt-8 sm:pt-10 pb-20 sm:pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs font-bold uppercase tracking-wider mb-4">
            <Camera size={13} /> Visual Storytelling
          </div>
          <h1 className="text-4xl sm:text-5xl font-serif font-bold text-white tracking-tight mb-4">
            The Tartuca Gallery
          </h1>
          <p className="text-slate-400 text-sm leading-relaxed mb-6">
            An intimate glimpse into our woodfire kitchen, botanical patio, wine cellar, and masterfully plated creations.
          </p>
          
          <a 
            href="https://instagram.com" 
            target="_blank" 
            rel="noreferrer"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-white/[0.04] border border-white/10 text-xs font-bold uppercase tracking-wider text-slate-200 hover:text-amber-400 hover:border-amber-500/30 transition-all shadow-sm group"
          >
            <Instagram size={16} className="group-hover:scale-110 transition-transform" />
            <span>Follow @TartucaDining on Instagram</span>
          </a>
        </div>

        {loading ? (
          <GallerySkeleton count={9} />
        ) : (
          <>
            {/* Filter Tabs */}
            {/* Mobile Filter Tabs Dropdown */}
            <div className="sm:hidden mb-8 max-w-xs mx-auto">
              <label htmlFor="mobile-gallery-filter" className="sr-only">Filter Gallery by Category</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-amber-500">
                  <Sparkles size={15} />
                </div>
                <select
                  id="mobile-gallery-filter"
                  value={activeTab}
                  onChange={(e) => setActiveTab(e.target.value)}
                  className="w-full appearance-none pl-10 pr-10 py-3 bg-stone-100/90 dark:bg-[#0F1117] border border-stone-300/80 dark:border-white/10 rounded-2xl text-xs font-bold uppercase tracking-wider text-stone-900 dark:text-slate-200 focus:outline-none focus:border-amber-500 focus:ring-1 focus:ring-amber-500 shadow-sm cursor-pointer transition-colors"
                >
                  {tabs.map((tab) => (
                    <option key={tab} value={tab} className="bg-white dark:bg-[#0E1015] text-stone-900 dark:text-white">
                      {tab === 'All' ? 'All Gallery Photos' : tab}
                    </option>
                  ))}
                </select>
                <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-stone-500 dark:text-slate-400">
                  <ChevronDown size={16} />
                </div>
              </div>
            </div>

            {/* Desktop & Tablet Filter Tabs */}
            <div className="hidden sm:flex justify-center gap-2 mb-12 flex-wrap">
              {tabs.map((tab) => (
                <button
                  type="button"
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`px-6 py-2 rounded-full text-xs font-bold uppercase tracking-wider transition-all duration-200 border ${
                    activeTab === tab 
                      ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-lg shadow-amber-500/25' 
                      : 'bg-white/80 dark:bg-white/[0.03] text-stone-600 dark:text-slate-300 border-stone-200/80 dark:border-white/10 hover:border-amber-400/50 hover:text-stone-900 dark:hover:text-white'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            {/* Gallery Columns Layout */}
            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
              {filteredImages.map((image) => (
                <div 
                  key={image.id} 
                  className="break-inside-avoid rounded-3xl overflow-hidden group relative cursor-pointer glass-card border border-white/10 shadow-lg hover:border-amber-500/40 transition-all duration-300"
                >
                  <img 
                    src={image.src || 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800'} 
                    alt={image.alt} 
                    className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" 
                    onError={(e) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?w=800';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/95 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6 z-10">
                    <div>
                      <span className="!text-amber-400 text-amber-400 text-[9px] font-extrabold uppercase tracking-widest bg-black/70 backdrop-blur-md border border-amber-500/40 px-2.5 py-1 rounded-md mb-2 inline-block">
                        {image.category || 'Experience'}
                      </span>
                      <h3 className="!text-white text-white font-serif font-bold text-lg drop-shadow-md">{image.alt}</h3>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

      </div>
    </div>
  );
}

export default GalleryPage;
