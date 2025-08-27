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
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 mb-4">
              Featured Products
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Our product catalog is being updated. Please check back soon!
            </p>
            <Button
              size="lg"
              onClick={onViewAllProducts}
            >
              Browse All Products
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
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-6 gradient-text">
            Featured Products
          </h2>
          <p className="text-xl lg:text-2xl text-gray-600 max-w-4xl mx-auto leading-relaxed">
            Discover our handpicked selection of the latest and most popular tech products, 
            carefully chosen for their performance, reliability, and value.
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
            <p className="text-xl text-gray-600 mb-8">No featured products available at the moment.</p>
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
            View All Products
          </Button>
        </div>
      </div>
    </section>
  );
}