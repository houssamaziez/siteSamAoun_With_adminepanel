import React from 'react';
import { Star, Quote } from 'lucide-react';
import { testimonials } from '../../data/mockData';
import { useSiteSettings } from '../../hooks/useSiteSettings';

export function Testimonials() {
  const { settings } = useSiteSettings();
  
  const siteData = settings || {
    testimonialsTitle: 'What Our Customers Say',
    testimonialsDescription: 'Don\'t just take our word for it. Here\'s what real customers have to say about their experience with TechHub Pro.',
    statCustomersCount: '1000+',
    statSatisfactionRate: '99%',
    statProductsCount: '500+',
    statSupportAvailability: '24/7'
  };
  
  return (
    <section className="py-16 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
            {settings?.testimonialsTitle || siteData.testimonialsTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" dir="rtl">
            {settings?.testimonialsDescription || siteData.testimonialsDescription}
          </p>
        </div>

        {/* Testimonials Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial) => (
            <div
              key={testimonial.id}
              className="bg-white rounded-xl shadow-lg p-6 relative hover:shadow-xl transition-shadow duration-300"
            >
              {/* Quote Icon */}
              <div className="absolute top-4 right-4 text-blue-100">
                <Quote className="w-8 h-8" />
              </div>

              {/* Rating */}
              <div className="flex items-center mb-4">
                {[...Array(testimonial.rating)].map((_, i) => (
                  <Star key={i} className="w-5 h-5 text-yellow-400 fill-current" />
                ))}
              </div>

              {/* Testimonial Text */}
              <p className="text-gray-700 mb-6 leading-relaxed" dir="rtl">
                "{testimonial.text}"
              </p>

              {/* Customer Info */}
              <div className="flex items-center">
                <img
                  src={testimonial.avatar}
                  alt={testimonial.name}
                  className="w-12 h-12 rounded-full object-cover mr-4"
                />
                <div>
                  <h4 className="font-semibold text-gray-900">{testimonial.name}</h4>
                  <p className="text-sm text-gray-600">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          <div className="text-center">
            <div className="text-4xl font-bold text-blue-600 mb-2">{settings?.statCustomersCount || siteData.statCustomersCount}</div>
            <div className="text-gray-600" dir="rtl">عميل سعيد</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-green-600 mb-2">{settings?.statSatisfactionRate || siteData.statSatisfactionRate}</div>
            <div className="text-gray-600" dir="rtl">معدل الرضا</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-purple-600 mb-2">{settings?.statProductsCount || siteData.statProductsCount}</div>
            <div className="text-gray-600" dir="rtl">منتج متاح</div>
          </div>
          <div className="text-center">
            <div className="text-4xl font-bold text-orange-600 mb-2">{settings?.statSupportAvailability || siteData.statSupportAvailability}</div>
            <div className="text-gray-600" dir="rtl">دعم متاح</div>
          </div>
        </div>
      </div>
    </section>
  );
}