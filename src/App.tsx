import React, { useState } from 'react';
import { useEffect } from 'react';
import { Header } from './components/layout/Header';
import { Navigation } from './components/layout/Navigation';
import { Hero } from './components/sections/Hero';
import { Categories } from './components/sections/Categories';
import { FeaturedProducts } from './components/sections/FeaturedProducts';
import { Services } from './components/sections/Services';
import { Testimonials } from './components/sections/Testimonials';
import { Footer } from './components/layout/Footer';
import { CartSidebar } from './components/cart/CartSidebar';
import { ReservationForm } from './components/reservation/ReservationForm';
import { AdminLogin } from './components/admin/AdminLogin';
import { AdminDashboard } from './components/admin/AdminDashboard';
import { ProductDetail } from './components/product/ProductDetail';
import { Reservation } from './types';
import { useProducts, useCategories, createReservation } from './hooks/useSupabaseData';
import { getCurrentUser } from './lib/supabase';
import { useCart } from './hooks/useCart';

type View = 'home' | 'products' | 'product-detail' | 'admin';

function App() {
  const [currentView, setCurrentView] = useState<View>('home');
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isReservationFormOpen, setIsReservationFormOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);
  const [forceUpdate, setForceUpdate] = useState(0);

  // Use Supabase data instead of mock data
  const { products } = useProducts();
  const { categories } = useCategories();
  const { items: cartItems, getItemCount } = useCart();

  // Debug: Log when products are loaded
  useEffect(() => {
    console.log('Products loaded:', products.length);
    console.log('Cart items in App:', cartItems.length);
    console.log('Cart count in App:', getItemCount());
  }, [products, cartItems, getItemCount]);

  // Force re-render when cart changes
  useEffect(() => {
    setForceUpdate(prev => prev + 1);
  }, [cartItems]);

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
    setSelectedCategory(categorySlug === 'all' ? null : categorySlug);
    setCurrentView('products');
  };

  const handleProductView = (productId: string) => {
    setSelectedProductId(productId);
    setCurrentView('product-detail');
  };

  const handleExploreProducts = () => {
    setSelectedCategory(null);
    setCurrentView('products');
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

  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleAdminAccess = () => {
    setCurrentView('admin');
  };

  const handleAdminLogin = () => {
    setIsAuthenticated(true);
  };

  const handleAdminLogout = () => {
    setIsAuthenticated(false);
    setCurrentView('home');
  };

  // Show loading while checking auth
  if (isCheckingAuth) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show admin interface
  if (currentView === 'admin') {
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

      {/* Navigation */}
      {currentView === 'home' && (
        <Navigation onCategorySelect={handleCategorySelect} />
      )}

      {/* Main Content */}
      <main>
        {currentView === 'home' && (
          <>
            <Hero onExploreProducts={handleExploreProducts} />
            
            <div id="categories">
              <Categories 
                onCategorySelect={handleCategorySelect}
                categories={categories}
              />
            </div>
            
            <div id="featured-products">
              <FeaturedProducts 
                products={products}
                onViewProduct={handleProductView}
                onViewAllProducts={handleExploreProducts}
              />
            </div>
            
            <div id="services">
              <Services />
            </div>
            
            <div id="testimonials">
              <Testimonials />
            </div>
          </>
        )}

        {currentView === 'products' && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h1 className="text-3xl font-bold text-gray-900">
                  {selectedCategory ? 
                    `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Products` : 
                    'All Products'
                  }
                </h1>
                <p className="text-gray-600 mt-2">
                  Discover our comprehensive range of technology products
                </p>
              </div>
              
              <button
                onClick={() => setCurrentView('home')}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                ← Back to Home
              </button>
            </div>

            {/* Products would be rendered here with filtering logic */}
            <div className="text-center py-20">
              <h2 className="text-2xl font-semibold text-gray-900 mb-4">
                Product Catalog Coming Soon
              </h2>
              <p className="text-gray-600">
                The full product catalog with advanced filtering is being developed.
              </p>
            </div>
          </div>
        )}

        {currentView === 'product-detail' && (
          <>
            {selectedProductId && (
              <ProductDetail
                product={products.find(p => p.id === selectedProductId)!}
                onBack={() => setCurrentView('home')}
              />
            )}
          </>
        )}
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

export default App;