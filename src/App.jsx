import { BrowserRouter, Routes, Route } from 'react-router-dom';
import ScrollToTop from './components/common/ScrollToTop';
import Layout from './components/layout/Layout';
import AuthLayout from './components/layout/AuthLayout';
import HomePage from './pages/HomePage';
import MenuPage from './pages/MenuPage';
import CheckoutPage from './pages/CheckoutPage';
import BookTablePage from './pages/BookTablePage';
import GalleryPage from './pages/GalleryPage';
import ReviewsPage from './pages/ReviewsPage';
import DeliveryPage from './pages/DeliveryPage';
import AboutPage from './pages/AboutPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import ProfilePage from './pages/ProfilePage';
import { PrivacyPage, TermsPage } from './pages/LegalPages';

function App() {
  return (
    <BrowserRouter>
      <ScrollToTop />
      <Routes>
        <Route element={<Layout />}>
          <Route path="/" element={<HomePage />} />
          <Route path="/menu" element={<MenuPage />} />
          <Route path="/cart" element={<CheckoutPage />} />
          <Route path="/book-table" element={<BookTablePage />} />
          <Route path="/book-a-table" element={<BookTablePage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/gallery" element={<GalleryPage />} />
          <Route path="/reviews" element={<ReviewsPage />} />
          <Route path="/delivery" element={<DeliveryPage />} />
          <Route path="/about" element={<AboutPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/terms" element={<TermsPage />} />
        </Route>
        
        <Route element={<AuthLayout />}>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
