import React, { useState, useEffect } from 'react';
import { Search, ShoppingCart, Menu, X, Phone, MapPin, Clock } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onCartOpen: () => void;
  onMenuOpen: () => void;
  onAdminAccess: () => void;
}

export function Header({ onCartOpen, onMenuOpen, onAdminAccess }: HeaderProps) {
  const { getItemCount, items, updateTrigger, getCacheStatus, refreshCart, isUpdating } = useCart();
  const { settings } = useSiteSettings();
  const [searchQuery, setSearchQuery] = useState('');
  const [cartAnimation, setCartAnimation] = useState(false);
  const navigate = useNavigate(); // ⬅ لاستخدام التنقل

  // بيانات الموقع من قاعدة البيانات أو القيم الافتراضية
  const siteData = settings || {
    siteName: 'Cortec Batna',
    siteTagline: 'Your Complete Technology Solution',
    address: '123 Tech Street, Digital City, DC 12345',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
    logoUrl: undefined,
  };

  // الحصول على عدد العناصر في السلة
  const cartCount = getItemCount();

  // تفعيل الأنيميشن عند تحديث السلة
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

  // الحصول على التاريخ الحالي
  const today = new Date();
  const formattedDate = today.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'long',
    year: 'numeric',
  });

  return (
    <header className="bg-white/95 backdrop-blur-md border-b border-gray-200 sticky top-0 z-50 shadow-soft">
      {/* شريط علوي */}
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

      {/* الهيدر الرئيسي */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* الشعار */}
          <div className="flex items-center">
            <button
              className="md:hidden p-2 rounded-md text-gray-600 hover:text-gray-900 hover:bg-gray-100"
              onClick={onMenuOpen}
            >
              <Menu className="w-6 h-6" />
            </button>
            <div
              className="flex-shrink-0 ml-4 md:ml-0 animate-fade-in cursor-pointer"
              onClick={() => navigate('/')} // ⬅ التوجيه للصفحة الرئيسية عند الضغط على الشعار
            >
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

          {/* شريط البحث */}
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

          {/* أيقونات الإجراءات */}
          <div className="flex items-center space-x-4 animate-fade-in-right">
            {/* بحث للجوال */}
            <button className="md:hidden p-2 text-gray-600 hover:text-gray-900 hover-scale">
              <Search className="w-6 h-6" />
            </button>

            {/* أيقونة السلة */}
            <button
              onClick={handleCartClick}
              className={`relative p-3 text-gray-600 hover:text-gray-900 transition-all duration-300 group hover-scale hover-glow rounded-full ${
                cartAnimation || isUpdating ? 'animate-bounce' : ''
              }`}
              disabled={isUpdating}
            >
              <ShoppingCart className={`w-6 h-6 group-hover:animate-wiggle transition-transform duration-300 ${
                cartAnimation || isUpdating ? 'animate-pulse text-green-600' : ''
              }`} />
              {cartCount > 0 && (
                <span
                  key={cartCount}
                  className={`absolute -top-1 -right-1 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs rounded-full h-6 w-6 flex items-center justify-center font-bold shadow-medium transition-all duration-300 ${
                    cartAnimation || isUpdating ? 'animate-ping' : 'animate-cart-bounce'
                  }`}
                  style={{
                    animation: (cartAnimation || isUpdating) ? 'ping 1s cubic-bezier(0, 0, 0.2, 1)' : 'cart-bounce 0.8s ease-in-out, pulse-glow 2s ease-in-out infinite'
                  }}
                >
                  {cartCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* شريط البحث للجوال */}
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

      {/* قسم عرض التاريخ وشرحه */}
      <div className="bg-blue-50 border-t border-gray-200 py-4">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h2 className="text-lg font-semibold text-gray-900">📅 تاريخ اليوم: {formattedDate}</h2>
          <p className="text-sm text-gray-600 mt-1">
            يُستخدم هذا التاريخ لمعالجة طلباتك وتحديد مواعيد التسليم بدقة.
          </p>
        </div>
      </div>
    </header>
  );
}
