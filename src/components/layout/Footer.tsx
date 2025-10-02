import React from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  Facebook, 
  Twitter, 
  Instagram, 
  Youtube,
  ArrowRight
} from 'lucide-react';
import { Button } from '../ui/Button';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export function Footer() {
  const { settings } = useSiteSettings();
  const currentYear = new Date().getFullYear();

  // Use settings from database or fallback to defaults
  const siteData = settings || {
    siteName: 'TechHub Pro',
    footerDescription: 'Professional computer and technology store offering the latest hardware, components, and expert services.',
    copyrightText: 'All rights reserved.',
    address: '123 Tech Street, Digital City, DC 12345',
    phone: '+1 (555) 123-4567',
    email: 'info@techhubpro.com',
    hours: 'Mon-Fri: 9AM-7PM, Sat: 10AM-6PM, Sun: 12PM-5PM',
    newsletterTitle: 'Stay Updated',
    newsletterDescription: 'Get the latest deals, product launches, and tech news delivered to your inbox.'
  };

  const services = ['Hardware Installation', 'System Maintenance', 'Custom Builds', 'Data Recovery', 'Technical Support', 'Warranty Service'];
  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div>
              <h3 className="text-2xl font-bold mb-2" dir="rtl">{settings?.newsletterTitle || siteData.newsletterTitle}</h3>
              <p className="text-gray-400" dir="rtl">
                {settings?.newsletterDescription || siteData.newsletterDescription}
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <input
                type="email"
                placeholder="أدخل عنوان بريدك الإلكتروني"
                className="flex-1 px-4 py-3 bg-gray-800 border border-gray-700 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-white placeholder-gray-400 text-right"
                dir="rtl"
              />
              <Button icon={ArrowRight} iconPosition="right">
                اشترك
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <h3 className="text-2xl font-bold mb-4" dir="rtl">{siteData.siteName}</h3>
            <p className="text-gray-400 mb-6 leading-relaxed" dir="rtl">
              {settings?.footerDescription || siteData.footerDescription}
            </p>
            
            {/* Social Links */}
            <div className="flex space-x-4">
              <a 
                href={settings?.facebookUrl || "#"} 
                target={settings?.facebookUrl ? "_blank" : "_self"}
                rel={settings?.facebookUrl ? "noopener noreferrer" : undefined}
                className="w-10 h-10 bg-gray-800 hover:bg-blue-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Facebook className="w-5 h-5" />
              </a>
              <a 
                href={settings?.twitterUrl || "#"} 
                target={settings?.twitterUrl ? "_blank" : "_self"}
                rel={settings?.twitterUrl ? "noopener noreferrer" : undefined}
                className="w-10 h-10 bg-gray-800 hover:bg-blue-400 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a 
                href={settings?.instagramUrl || "#"} 
                target={settings?.instagramUrl ? "_blank" : "_self"}
                rel={settings?.instagramUrl ? "noopener noreferrer" : undefined}
                className="w-10 h-10 bg-gray-800 hover:bg-pink-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Instagram className="w-5 h-5" />
              </a>
              <a 
                href={settings?.youtubeUrl || "#"} 
                target={settings?.youtubeUrl ? "_blank" : "_self"}
                rel={settings?.youtubeUrl ? "noopener noreferrer" : undefined}
                className="w-10 h-10 bg-gray-800 hover:bg-red-600 rounded-full flex items-center justify-center transition-colors duration-200"
              >
                <Youtube className="w-5 h-5" />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-semibold mb-6" dir="rtl">روابط سريعة</h4>
            <ul className="space-y-3">
              {['من نحن', 'المنتجات', 'الخدمات', 'الدعم', 'المدونة', 'الوظائف'].map((link) => (
                <li key={link}>
                  <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" dir="rtl">
                    {link}
                  </a>
                </li>
              ))}
            </ul>
          </div>

     

          {/* Contact Info */}
          <div>
            <h4 className="text-lg font-semibold mb-6" dir="rtl">معلومات الاتصال</h4>
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400" dir="rtl">{siteData.address}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">{siteData.phone}</span>
              </div>
              
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-blue-400 flex-shrink-0" />
                <span className="text-gray-400">{siteData.email}</span>
              </div>
              
              <div className="flex items-start space-x-3">
                <Clock className="w-5 h-5 text-blue-400 mt-1 flex-shrink-0" />
                <span className="text-gray-400" dir="rtl">{siteData.hours}</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <p className="text-gray-400 text-sm mb-4 md:mb-0" dir="rtl">
              © {currentYear} {siteData.siteName}. {settings?.copyrightText || siteData.copyrightText}
            </p>
            
            <div className="flex flex-wrap gap-6 text-sm">
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" dir="rtl">
                سياسة الخصوصية
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" dir="rtl">
                شروط الخدمة
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" dir="rtl">
                سياسة ملفات تعريف الارتباط
              </a>
              <a href="#" className="text-gray-400 hover:text-white transition-colors duration-200" dir="rtl">
                خريطة الموقع
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}