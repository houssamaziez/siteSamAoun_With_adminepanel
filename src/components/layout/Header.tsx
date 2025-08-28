import React, { useState, useEffect } from 'react';
import { ShoppingCart, Menu, Phone, MapPin, Clock } from 'lucide-react';
import { useCart } from '../../hooks/useCart';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onCartOpen: () => void;
  onMenuOpen: () => void;
  onAdminAccess: () => void;
}

export function Header({ onCartOpen, onMenuOpen, onAdminAccess }: HeaderProps) {
  const navigate = useNavigate();
  const { getItemCount, items, updateTrigger, getCacheStatus, refreshCart, isUpdating } = useCart();
  const { settings } = useSiteSettings();
  const [cartAnimation, setCartAnimation] = useState(false);

  const siteData = settings || {
    siteName: 'Cortec batna ',
    siteTagline: 'Your Complete Technology Solution',
    address: '123 Tech Street, Digital City, DC 12345',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
    logoUrl: undefined,
  };

  const cartCount = getItemCount();

  useEffect(() => {
    if (cartCount > 0) {
      setCartAnimation(true);
      setTimeout(() => setCartAnimation(false), 1000);
    }
  }, [items, updateTrigger, cartCount, getCacheStatus]);

  const handleCartClick = () => {
    refreshCart();
    onCartOpen();
  };

  const handleLogoClick = () => {
    navigate('/');
  };

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-soft">
      {/* Top Bar */}
      <div className="bg-gradient-to-r from-gray-900 to-gray-800 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6 animate-fade-in-left">
              <div className="flex items-center hover-scale">
                <Phone className="w-4 h-4 mr-2" />
                <span>{siteData.phone}</span>
              </div>
              <div className="hidden md:flex items-center hover-scale">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{siteData.address}</span>
              </div>
            </div>
            <div className="flex items-center animate-fade-in-right">
              <Clock className="w-4 h-4 mr-2" />
              <span className="hidden sm:inline">{siteData.hours}</span>
              <span className="sm:hidden">Open Mon-Sat</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center cursor-pointer" onClick={handleLogoClick}>
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={onMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div className="flex-shrink-0 ml-4 md:ml-0 animate-fade-in">
              <div className="flex items-center space-x-3">
                {siteData.logoUrl && (
                  <img
                    src={siteData.logoUrl}
                    alt={siteData.siteName}
                    className="h-10 w-auto"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold gradient-text hover-scale">
                    {siteData.siteName}
                  </h1>
                  <p className="text-sm text-gray-600 hidden sm:block opacity-80">
                    {siteData.siteTagline}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 animate-fade-in-right">
            {/* Cart */}
            <button
              onClick={handleCartClick}
              className={`relative p-3 text-gray-600 hover:text-gray-900 transition-all duration-300 group hover-scale hover-glow rounded-full ${
                cartAnimation || isUpdating ? 'animate-bounce' : ''
              }`}
              disabled={isUpdating}
            >
              <ShoppingCart
                className={`w-6 h-6 group-hover:animate-wiggle transition-transform duration-300 ${
                  cartAnimation || isUpdating ? 'animate-pulse text-green-600' : ''
                }`}
              />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-medium transition-all duration-300 ${
                    cartAnimation || isUpdating
                      ? 'animate-ping'
                      : 'animate-cart-bounce'
                  }`}
                  style={{
                    animation:
                      cartAnimation || isUpdating
                        ? 'ping 1s cubic-bezier(0, 0, 0.2, 1)'
                        : 'cart-bounce 0.8s ease-in-out, pulse-glow 2s ease-in-out infinite',
                  }}
                >
                  {cartCount}
                </span>
              )}
              {(cartAnimation || isUpdating) && (
                <div className="absolute -top-3 -right-3 w-4 h-4 bg-green-500 rounded-full animate-ping"></div>
              )}
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}
