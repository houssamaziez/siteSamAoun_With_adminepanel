import React from 'react';
import { ArrowRight } from 'lucide-react';
import * as Icons from 'lucide-react';
import { ProductCategory } from '../../types';

interface CategoriesProps {
  onCategorySelect: (categorySlug: string) => void;
  categories: ProductCategory[];
}

export function Categories({ onCategorySelect, categories }: CategoriesProps) {
  return (
    <section className="py-20 bg-gradient-to-b from-white to-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 gradient-text" dir="rtl">
            تسوق حسب الفئة
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed" dir="rtl">
            اعثر على ما تحتاجه بالضبط مع مجموعتنا الشاملة من فئات التكنولوجيا،
            من معدات الألعاب عالية الأداء إلى مكونات محطات العمل المهنية.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {categories.map((category, index) => {
            const IconComponent = Icons[category.icon as keyof typeof Icons] as React.ElementType;
            
            return (
              <div
                key={category.id}
                onClick={() => onCategorySelect(category.slug)}
                className={`group relative bg-white rounded-3xl shadow-soft hover:shadow-strong card-hover cursor-pointer overflow-hidden border border-gray-100 animate-fade-in-up stagger-${(index % 6) + 1}`}
              >
                {/* Background Image */}
                <div className="aspect-[4/3] overflow-hidden relative">
                  <img
                    src={category.image}
                    alt={category.name}
                    className="w-full h-full object-cover group-hover:scale-115 transition-transform duration-700"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/90 transition-all duration-500"></div>
                </div>

                {/* Content */}
                <div className="absolute inset-0 flex flex-col justify-end p-8">
                  <div className="flex items-center justify-between text-white">
                    <div className="flex items-center space-x-4">
                      {IconComponent && (
                        <div className="w-14 h-14 glass rounded-full flex items-center justify-center animate-float hover-glow">
                          <IconComponent className="w-7 h-7" />
                        </div>
                      )}
                      <div>
                        <h3 className="text-2xl font-bold mb-1">{category.name}</h3>
                        <p className="text-sm text-gray-200 opacity-90">{category.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-7 h-7 opacity-70 group-hover:opacity-100 group-hover:translate-x-2 transition-all duration-300 animate-float stagger-2" />
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-600/0 to-purple-600/0 group-hover:from-blue-600/20 group-hover:to-purple-600/20 transition-all duration-500"></div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}