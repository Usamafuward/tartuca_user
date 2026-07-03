// TEMPLATE: How to Add Loading States to Your Pages

// ============================================
// OPTION 1: Using Skeleton Loaders (Recommended)
// ============================================

import { useState, useEffect } from 'react';
import { MenuItemSkeleton, HeroSkeleton, GallerySkeleton } from '../components/common/Skeleton';
import { fetchYourData } from '../services/api';

function YourPage() {
  const [isLoading, setIsLoading] = useState(true);
  const [data, setData] = useState([]);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const result = await fetchYourData();
      setData(result);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div>
      {isLoading ? (
        <MenuItemSkeleton count={6} />
      ) : (
        <div className="grid gap-6">
          {data.map(item => (
            <div key={item.id}>
              {/* Your item rendering */}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default YourPage;

// ============================================
// OPTION 2: Using Loading Spinner
// ============================================

import { LoadingSpinner } from '../components/common/Loading';

function YourPage() {
  const [isLoading, setIsLoading] = useState(true);

  if (isLoading) {
    return <LoadingSpinner text="Loading items..." size="lg" />;
  }

  return (
    // Your page content
  );
}

// ============================================
// OPTION 3: Using useDataLoading Hook
// ============================================

import { useDataLoading } from '../hooks/useDataLoading';
import { MenuItemSkeleton } from '../components/common/Skeleton';
import { fetchYourData } from '../services/api';

function YourPage() {
  const { isLoading, error, data, fetchData } = useDataLoading();

  useEffect(() => {
    fetchData(fetchYourData);
  }, []);

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-800">Error loading data: {error}</p>
      </div>
    );
  }

  return (
    <div>
      {isLoading ? (
        <MenuItemSkeleton count={6} />
      ) : (
        // Your content
      )}
    </div>
  );
}

// ============================================
// OPTION 4: Using Overlay Loader
// ============================================

import { LoadingOverlay } from '../components/common/Loading';

function YourPage() {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSubmit = async () => {
    setIsProcessing(true);
    try {
      // Your async operation
      await someAsyncTask();
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div>
      <LoadingOverlay isVisible={isProcessing} text="Processing..." />
      <button onClick={handleSubmit}>Submit</button>
    </div>
  );
}

// ============================================
// APPLY TO EACH PAGE
// ============================================

// HomePage - Add this to FeaturedItems/Categories
// MenuPage ✅ (Already done! See MenuPage.jsx)
// GalleryPage - Use GallerySkeleton
// BookTablePage - Use LoadingOverlay for form submission
// CheckoutPage - Use LoadingWithAnimation during payment
// ReviewsPage - Use MenuItemSkeleton for loading reviews
// DeliveryPage - Use LoadingSpinner while fetching delivery info
// AboutPage - Use HeroSkeleton for hero section
// LoginPage/RegisterPage - Use LoadingOverlay for authentication

// ============================================
// COMMON PATTERNS
// ============================================

// Pattern 1: Filter and Search
const handleSearch = (query) => {
  setIsLoading(true);
  setSearchQuery(query);
  // Debounce the API call
  clearTimeout(searchTimeout);
  searchTimeout = setTimeout(async () => {
    const results = await fetchSearchResults(query);
    setResults(results);
    setIsLoading(false);
  }, 300);
};

// Pattern 2: Category Switching
const handleCategoryChange = (categoryId) => {
  setIsLoading(true);
  setActiveCategory(categoryId);
  
  fetchDataByCategory(categoryId).then(data => {
    setItems(data);
    setIsLoading(false);
  });
};

// Pattern 3: Pagination
const handlePageChange = (pageNum) => {
  setIsLoading(true);
  fetchPageData(pageNum).then(data => {
    setItems(data);
    setCurrentPage(pageNum);
    setIsLoading(false);
  });
};

// Pattern 4: Multiple Data Sources
const loadAllData = async () => {
  setIsLoading(true);
  try {
    const [items, categories, offers] = await Promise.all([
      fetchMenuItems(),
      fetchCategories(),
      fetchSpecialOffers()
    ]);
    setMenuItems(items);
    setCategories(categories);
    setOffers(offers);
  } finally {
    setIsLoading(false);
  }
};
