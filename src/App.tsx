import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Footer } from './components/layout/Footer';
import { CartSidebar } from './components/cart/CartSidebar';
import { ReservationForm } from './components/reservation/ReservationForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { HomePage } from './components/pages/HomePage';
import { ProductsPage } from './components/pages/ProductsPage';
import { ProductDetailPage } from './components/pages/ProductDetailPage';
import { NotFoundPage } from './components/pages/NotFoundPage';
import { Reservation } from './types';
import { createReservation } from './hooks/useSupabaseData';
import { getCurrentUser } from './lib/supabase';

function AppContent() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const { user } = await getCurrentUser();
      setIsAuthenticated(!!user);
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setIsCheckingAuth(false);
    }
  };

  const handleCategorySelect = (categorySlug: string) => {
    const path = categorySlug === 'all' ? '/products' : `/products/${categorySlug}`;
    navigate(path);
  };

  const handleProductView = (productId: string) => {
    navigate(`/product/${productId}`);
  };

  const handleExploreProducts = () => {
    navigate('/products');
  };

  const handleReservationSubmit = async (reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) => {
    const result = await createReservation(reservation);
    
    if (result.success) {
      alert(`Reservation submitted successfully! Your reference number is ${reservation.referenceNumber}. We'll contact you within 24 hours to confirm your pickup appointment.`);
    } else {
      alert(`Failed to submit reservation: ${result.error}`);
      throw new Error(result.error);
    }
  };

  const handleAdminAccess = () => {
    navigate('/admin');
  };

  const handleAdminLogin = () => {
    setIsAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    navigate('/');
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Check if we're on admin route
  const isAdminRoute = location.pathname.startsWith('/admin');

  // Show admin interface
  if (isAdminRoute) {
    if (!isAuthenticated) {
      return <AdminLogin onLogin={handleAdminLogin} />;
    }
    return <AdminDashboard onLogout={handleAdminLogout} />;
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <Header 
        onCartOpen={() => setIsCartOpen(true)}
        onMenuOpen={() => setIsMenuOpen(true)}
        onAdminAccess={handleAdminAccess}
      />

      {/* Navigation - only show on home page */}
      {location.pathname === '/' && (
        <Navigation onCategorySelect={handleCategorySelect} />
      )}

      {/* Main Content */}
      <main>
        <Routes>
          <Route 
            path="/" 
            element={
              <HomePage
                onCategorySelect={handleCategorySelect}
                onProductView={handleProductView}
                onExploreProducts={handleExploreProducts}
              />
            } 
          />
          <Route path="/products" element={<ProductsPage />} />
          <Route path="/products/:category" element={<ProductsPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="*" element={<NotFoundPage />} />
        </Routes>
      </main>

      {/* Footer */}
      <Footer />

      {/* Cart Sidebar */}
      <CartSidebar
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={() => setIsReservationFormOpen(true)}
      />

      {/* Reservation Form */}
      <ReservationForm
        isOpen={isReservationFormOpen}
        onClose={() => setIsReservationFormOpen(false)}
        onSubmit={handleReservationSubmit}
      />
    </div>
  );
}

function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;