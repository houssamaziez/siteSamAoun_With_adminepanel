import React from 'react';
import { Wrench, Shield, Truck, Headphones as HeadphonesIcon, Settings, Award } from 'lucide-react';
import { Button } from '../ui/Button';
import { store } from '../../data/mockData';
import { useSiteSettings } from '../../hooks/useSiteSettings';

const serviceIcons = [
  { icon: Wrench, color: 'text-blue-600 bg-blue-100' },
  { icon: Shield, color: 'text-green-600 bg-green-100' },
  { icon: Settings, color: 'text-purple-600 bg-purple-100' },
  { icon: Truck, color: 'text-orange-600 bg-orange-100' },
  { icon: HeadphonesIcon, color: 'text-red-600 bg-red-100' },
  { icon: Award, color: 'text-indigo-600 bg-indigo-100' }
];

export function Services() {
  const { settings } = useSiteSettings();
  
  const siteData = settings || {
    servicesTitle: 'Professional Services',
    servicesDescription: 'Beyond just selling products, we provide comprehensive technology services to ensure you get the most out of your investment.'
  };
  
  return (
    <section className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
            {settings?.servicesTitle || siteData.servicesTitle}
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto" dir="rtl">
            {settings?.servicesDescription || siteData.servicesDescription}
          </p>
        </div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {store.services.map((service, index) => {
            const { icon: IconComponent, color } = serviceIcons[index % serviceIcons.length];
            
            return (
              <div key={service} className="group text-center">
                <div className={`w-16 h-16 ${color} rounded-full flex items-center justify-center mx-auto mb-4 group-hover:scale-110 transition-transform duration-200`}>
                  <IconComponent className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2" dir="rtl">{service}</h3>
                <p className="text-gray-600" dir="rtl">
                  خدمات {service.toLowerCase()} احترافية من قبل فنيين معتمدين
                  بسنوات من الخبرة.
                </p>
              </div>
            );
          })}
        </div>

        {/* CTA Section */}
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-8 text-center text-white">
          <h3 className="text-2xl font-bold mb-4" dir="rtl">تحتاج مساعدة احترافية؟</h3>
          <p className="text-lg mb-6 opacity-90" dir="rtl">
            فنيونا المعتمدون مستعدون للمساعدة في التركيب والصيانة والدعم.
          </p>
       
        </div>
      </div>
    </section>
  );
}