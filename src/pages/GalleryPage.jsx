import { useState, useEffect } from 'react';
import { Instagram } from 'lucide-react';
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
        const data = await fetchGallery();
        const elapsedTime = Date.now() - startTime;
        if (elapsedTime < 1000) {
           await new Promise(resolve => setTimeout(resolve, 1000 - elapsedTime));
        }
        
        setImages(data.map(img => ({
          id: img.id,
          category: img.category,
          src: img.has_image ? `${API_URL}/gallery/${img.id}/image` : img.image_url,
          alt: img.alt_text
        })));
      } catch (error) {
        console.error('Failed to load gallery:', error);
      } finally {
        setLoading(false);
      }
    };
    loadGallery();
  }, []);

  const tabs = ['All', ...new Set(images.map(img => img.category))];

  const filteredImages = activeTab === 'All' 
    ? images 
    : images.filter(img => img.category === activeTab);

  return (
    <div className="bg-light min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-dark mb-4">Our Gallery</h1>
          <p className="text-gray-500 max-w-2xl mx-auto">
            Take a look inside our restaurant and explore our delicious dishes. Follow us on Instagram for more updates.
          </p>
          
          <a href="#" className="inline-flex items-center gap-2 text-primary font-bold mt-4 hover:text-primary-dark transition-colors">
            <Instagram size={20} />
            @Tartuca
          </a>
        </div>

        {loading ? (
          <GallerySkeleton count={9} />
        ) : (
        <>
        {/* Filter Tabs */}
        <div className="flex justify-center gap-2 mb-12 flex-wrap">
          {tabs.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-6 py-2 rounded-full text-sm font-bold transition-all ${
                activeTab === tab 
                  ? 'bg-primary text-white shadow-lg shadow-primary/25' 
                  : 'bg-white text-gray-500 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Masonry Grid Layout (Simplified with Columns) */}
        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {filteredImages.map((image) => (
            <div key={image.id} className="break-inside-avoid rounded-3xl overflow-hidden group relative cursor-pointer">
              <img 
                src={image.src} 
                alt={image.alt} 
                className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-110" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-6">
                <div>
                  <span className="text-primary text-xs font-bold uppercase tracking-wider bg-white/90 px-2 py-1 rounded mb-2 inline-block">
                    {image.category}
                  </span>
                  <h3 className="text-white font-bold text-lg">{image.alt}</h3>
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
