import React from 'react';
import { ArrowRight } from 'lucide-react';
import { ProductCard } from '../ui/ProductCard';
import { Button } from '../ui/Button';
import { Product } from '../../types';

interface FeaturedProductsProps {
  products: Product[];
  onViewProduct: (productId: string) => void;
  onViewAllProducts: () => void;
}

export function FeaturedProducts({ products, onViewProduct, onViewAllProducts }: FeaturedProductsProps) {
  const featuredProducts = products.filter(product => product.featured);

  // Don't render the section if no products are available
  if (products.length === 0) {
    return (
      <section className="py-16 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4" dir="rtl">
              المنتجات المميزة
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8" dir="rtl">
              يتم تحديث كتالوج منتجاتنا. يرجى المراجعة قريباً!
            </p>
            <Button
              size="lg"
              onClick={onViewAllProducts}
            >
              تصفح جميع المنتجات
            </Button>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="py-20 bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16 animate-fade-in-up">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 gradient-text" dir="rtl">
            المنتجات المميزة
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed" dir="rtl">
            اكتشف مجموعتنا المختارة بعناية من أحدث وأشهر المنتجات التقنية،
            المختارة بعناية لأدائها وموثوقيتها وقيمتها.
          </p>
        </div>

        {/* Products Grid */}
        {featuredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mb-16">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onViewDetails={() => onViewProduct(product.id)}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-16 mb-16 animate-fade-in">
            <p className="text-xl text-gray-600 mb-8" dir="rtl">لا توجد منتجات مميزة متاحة في الوقت الحالي.</p>
          </div>
        )}

        {/* View All Button */}
        <div className="text-center animate-fade-in-up">
          <Button
            size="lg"
            icon={ArrowRight}
            iconPosition="right"
            onClick={onViewAllProducts}
            className="hover-lift btn-primary shadow-medium px-10 py-4 text-lg"
          >
            عرض جميع المنتجات
          </Button>
        </div>
      </div>
    </section>
  );
}