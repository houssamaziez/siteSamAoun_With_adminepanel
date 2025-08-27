import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface HeaderProps {
  onCartOpen: () => void;
  onMenuOpen: () => void;
  onAdminAccess?: () => void;
}

export function Header({ onCartOpen, onMenuOpen, onAdminAccess }: HeaderProps) {
  const { getItemCount, items, forceUpdate } = useCart();
  const { settings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState('');

  // Use settings from database or fallback to defaults
  const siteData = settings || {
    siteName: 'TechHub Pro',
    siteTagline: 'Your Complete Technology Solution',
    address: '123 Tech Street, Digital City, DC 12345',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
    logoUrl: undefined, // fallback: avoids undefined property
  };

  // Get current cart count
  const cartCount = getItemCount();
  
  // Log cart changes for debugging
  useEffect(() => {
    console.log('Header: Cart updated, count:', cartCount, 'items:', items.length);
  }, [items, forceUpdate, cartCount]);

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
          <div className="flex items-center">
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
                  <h1 className="text-2xl font-bold gradient-text hover-scale">{siteData.siteName}</h1>
                  <p className="text-sm text-gray-600 hidden sm:block opacity-80">{siteData.siteTagline}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8 animate-fade-in">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-glow transition-all duration-300"
                placeholder="Search products, brands, or categories..."
              />
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center"
                >
                  <X className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                </button>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4 animate-fade-in-right">
            {/* Mobile Search */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover-scale">
              <Search className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative p-3 text-gray-600 hover:text-gray-900 transition-all duration-300 group hover-scale hover-glow rounded-full"
            >
              <ShoppingCart className="w-6 h-6 group-hover:animate-wiggle transition-transform duration-300" />
              {cartCount > 0 && (
                <span 
                  key={cartCount}
                  className="absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-medium animate-cart-bounce transition-all duration-300"
                  style={{
                    animation: 'cart-bounce 0.8s ease-in-out, pulse-glow 2s ease-in-out infinite'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <div className="hidden sm:block">
              <Button size="sm" onClick={onAdminAccess} className="hover-lift btn-primary">
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t border-gray-200 px-4 py-3 bg-gray-50/50">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent hover-glow"
            placeholder="Search products..."
          />
        </div>
      </div>
    </header>
  );
}
