import React, { useState, useEffect } from 'react';
import { Menu, Phone, MapPin, Clock } from 'lucide-react';
import { useSiteSettings } from '../../hooks/useSiteSettings';
import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  onMenuOpen: () => void;
  onAdminAccess: () => void;
}

export function Header({ onMenuOpen, onAdminAccess }: HeaderProps) {
  const navigate = useNavigate();
  const { settings } = useSiteSettings();

  const siteData = settings || {
    siteName: 'Cortec batna ',
    siteTagline: 'Your Complete Technology Solution',
    address: '123 Tech Street, Digital City, DC 12345',
    phone: '+1 (555) 123-4567',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
    logoUrl: undefined,
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
              <span className="sm:hidden">مفتوح الإثنين-السبت</span>
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
          {/* 🔹 زر السلة تم إزالته */}
        </div>
      </div>
    </header>
  );
}
