import React from 'react';
import { ArrowRight, Play, Shield, Truck, HeadphonesIcon } from 'lucide-react';
import { Button } from '../ui/Button';
import { useSiteSettings } from '../../hooks/useSiteSettings';

interface HeroProps {
  onExploreProducts: () => void;
}

export function Hero({ onExploreProducts }: HeroProps) {
  const { settings } = useSiteSettings();
  
  // Use settings from database or fallback to defaults
  const siteData = settings || {
    siteDescription: 'Professional computer and technology store offering the latest hardware, components, and expert services.'
  };
  return (
    <section className="relative bg-gradient-to-br from-gray-900 via-blue-900 to-indigo-900 overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 lg:pb-24">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="text-white">
            <h1 className="text-4xl lg:text-6xl font-bold leading-tight mb-6">
              Your Complete{' '}
              <span className="bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
                Technology
              </span>{' '}
              Solution
            </h1>
            
            <p className="text-xl lg:text-2xl text-gray-300 mb-8 leading-relaxed">
              {siteData.siteDescription} From cutting-edge laptops to custom builds, we've got everything you need.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Button 
                size="lg" 
                onClick={onExploreProducts}
                icon={ArrowRight}
                iconPosition="right"
                className="text-lg px-8 py-4"
              >
                Explore Products
              </Button>
              
              <Button 
                variant="outline" 
                size="lg"
                icon={Play}
                className="text-lg px-8 py-4 border-white text-white hover:bg-white hover:text-gray-900"
              >
                Watch Demo
              </Button>
            </div>

            {/* Features */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-blue-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Shield className="w-6 h-6 text-blue-400" />
                </div>
                <div>
                  <h3 className="font-semibold">3-Year Warranty</h3>
                  <p className="text-sm text-gray-400">On all products</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-emerald-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <Truck className="w-6 h-6 text-emerald-400" />
                </div>
                <div>
                  <h3 className="font-semibold">Free Delivery</h3>
                  <p className="text-sm text-gray-400">Same-day available</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0 w-12 h-12 bg-purple-500 bg-opacity-20 rounded-full flex items-center justify-center">
                  <HeadphonesIcon className="w-6 h-6 text-purple-400" />
                </div>
                <div>
                  <h3 className="font-semibold">24/7 Support</h3>
                  <p className="text-sm text-gray-400">Expert assistance</p>
                </div>
              </div>
            </div>
          </div>

          {/* Hero Image/Animation */}
          <div className="relative">
            <div className="relative z-10">
              <img
                src="https://images.pexels.com/photos/2582937/pexels-photo-2582937.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Professional Tech Setup"
                className="w-full rounded-2xl shadow-2xl"
              />
              
              {/* Floating Elements */}
              <div className="absolute -top-6 -right-6 w-20 h-20 bg-blue-500 rounded-full opacity-80 animate-pulse"></div>
              <div className="absolute -bottom-4 -left-4 w-16 h-16 bg-emerald-500 rounded-full opacity-60 animate-bounce"></div>
              
              {/* Stats Card */}
              <div className="absolute bottom-6 left-6 bg-white bg-opacity-90 backdrop-blur-sm rounded-xl p-4 shadow-xl">
                <div className="flex items-center space-x-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">500+</div>
                    <div className="text-sm text-gray-600">Products</div>
                  </div>
                  <div className="w-px h-12 bg-gray-300"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">99%</div>
                    <div className="text-sm text-gray-600">Satisfaction</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Background Decorations */}
            <div className="absolute inset-0 -z-10">
              <div className="absolute top-1/4 right-0 w-72 h-72 bg-blue-500 rounded-full opacity-10 blur-3xl"></div>
              <div className="absolute bottom-1/4 left-0 w-64 h-64 bg-emerald-500 rounded-full opacity-10 blur-3xl"></div>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Wave */}
      <div className="absolute bottom-0 left-0 right-0">
        <svg viewBox="0 0 1440 120" fill="none" className="w-full h-auto">
          <path
            d="M0 120L48 105C96 90 192 60 288 45C384 30 480 30 576 37.5C672 45 768 60 864 67.5C960 75 1056 75 1152 67.5C1248 60 1344 45 1392 37.5L1440 30V120H1392C1344 120 1248 120 1152 120C1056 120 960 120 864 120C768 120 672 120 576 120C480 120 384 120 288 120C192 120 96 120 48 120H0V120Z"
            fill="currentColor"
            className="text-white"
          />
        </svg>
      </div>
    </section>
  );
}