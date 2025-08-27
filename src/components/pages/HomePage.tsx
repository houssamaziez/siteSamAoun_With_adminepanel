import React from 'react';
import { Hero } from '../sections/Hero';
import { Categories } from '../sections/Categories';
import { FeaturedProducts } from '../sections/FeaturedProducts';
import { Services } from '../sections/Services';
import { Testimonials } from '../sections/Testimonials';
import { useProducts, useCategories } from '../../hooks/useSupabaseData';

interface HomePageProps {
  onCategorySelect: (categorySlug: string) => void;
  onProductView: (productId: string) => void;
  onExploreProducts: () => void;
}

export function HomePage({ onCategorySelect, onProductView, onExploreProducts }: HomePageProps) {
  const { products } = useProducts();
  const { categories } = useCategories();

  return (
    <>
      <Hero onExploreProducts={onExploreProducts} />
      
      <div id="categories">
        <Categories 
          onCategorySelect={onCategorySelect}
          categories={categories}
        />
      </div>
      
      <div id="featured-products">
        <FeaturedProducts 
          products={products}
          onViewProduct={onProductView}
          onViewAllProducts={onExploreProducts}
        />
      </div>
      
      <div id="services">
        <Services />
      </div>
      
      <div id="testimonials">
        <Testimonials />
      </div>
    </>
  );
}