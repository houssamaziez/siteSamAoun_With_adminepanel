import React, { useState } from 'react';
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
  const { getItemCount, items } = useCart();
  const { settings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState('');

  // Debug cart state in header
  useEffect(() => {
    console.log('Header: Cart items changed:', items);
    console.log('Header: Item count:', getItemCount());
  }, [items, getItemCount]);

  // Use settings from database or fallback to defaults
  const siteData = settings || {
    siteName: 'TechHub Pro',
    siteTagline: 'Your Complete Technology Solution',
    address: '123 Tech Street, Digital City, DC 12345',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM'
  };
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-sm">
      {/* Top Bar */}
      <div className="bg-gray-900 text-white text-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-6">
              <div className="flex items-center">
                <Phone className="w-4 h-4 mr-2" />
                <span>{siteData.phone}</span>
              </div>
              <div className="hidden md:flex items-center">
                <MapPin className="w-4 h-4 mr-2" />
                <span>{siteData.address}</span>
              </div>
            </div>
            <div className="flex items-center">
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
            <div className="flex-shrink-0 ml-4 md:ml-0">
              <div className="flex items-center space-x-3">
                {siteData.logoUrl && (
                  <img
                    src={siteData.logoUrl}
                    alt={siteData.siteName}
                    className="h-10 w-auto"
                  />
                )}
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{siteData.siteName}</h1>
                  <p className="text-sm text-gray-600 hidden sm:block">{siteData.siteTagline}</p>
                </div>
              </div>
            </div>
          </div>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-lg mx-8">
            <div className="w-full relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
                <Search className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
              <Search className="w-6 h-6" />
            </button>

            {/* Cart */}
            <button
              onClick={onCartOpen}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
            >
              <ShoppingCart className="w-6 h-6" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-blue-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-semibold animate-pulse">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* CTA Button */}
            <div className="hidden sm:block">
              <Button size="sm" onClick={onAdminAccess}>
                Admin
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Search Bar */}
      <div className="md:hidden border-t border-gray-200 px-4 py-3">
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="Search products..."
          />
        </div>
      </div>
    </header>
  );
}