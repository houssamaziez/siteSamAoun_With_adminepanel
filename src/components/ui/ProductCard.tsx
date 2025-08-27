import React from 'react';
import { Product } from '../../types';
import { Button } from './Button';
import { ShoppingCart, Eye, Heart, Star } from 'lucide-react';
import { useCart } from '../../hooks/useCart';

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { addItem, getItem } = useCart();
  const cartItem = getItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    console.log('Adding to cart:', product.name); // Debug log
   
   // Validate product data
   if (!product || !product.id) {
     console.error('Invalid product data:', product);
     return;
   }
   
   // Check stock
   if (product.stock <= 0) {
     console.warn('Product out of stock:', product.name);
     return;
   }
   
    addItem(product, 1);
   
   // Show visual feedback
   const button = e.target as HTMLElement;
   const buttonElement = button.closest('button');
   if (buttonElement) {
     const originalText = buttonElement.textContent;
     buttonElement.textContent = '✓ Added!';
     buttonElement.style.backgroundColor = '#10b981';
     buttonElement.style.borderColor = '#10b981';
     buttonElement.style.color = 'white';
     
     setTimeout(() => {
       if (buttonElement) {
         buttonElement.textContent = originalText || 'Add to Cart';
         buttonElement.style.backgroundColor = '';
         buttonElement.style.borderColor = '';
         buttonElement.style.color = '';
       }
     }, 2000);
   }
  };

  const handleBuyNow = (e: React.MouseEvent) => {
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    onViewDetails?.();
  };

  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div 
      className="group bg-white rounded-xl shadow-soft hover:shadow-strong card-hover cursor-pointer overflow-hidden border border-gray-100 animate-fade-in-up"
      onClick={onViewDetails}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gradient-to-br from-gray-50 to-gray-100">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-gradient-to-r from-red-500 to-red-600 text-white text-xs font-bold px-3 py-1 rounded-full shadow-medium animate-wiggle">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-60 flex items-center justify-center backdrop-blur-sm">
            <span className="text-white font-semibold text-lg animate-pulse">Out of Stock</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-all duration-300 transform translate-x-2 group-hover:translate-x-0">
          <button className="p-2 bg-white rounded-full shadow-medium hover:bg-gray-50 hover-scale glass">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
          <button 
            onClick={handleViewDetails}
            className="p-2 bg-white rounded-full shadow-medium hover:bg-gray-50 hover-scale glass"
          >
            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-6">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="font-medium">{product.brand}</span>
          <span>{product.category.name}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating (mock) */}
        <div className="flex items-center mb-4">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2 font-medium">(4.2)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900 gradient-text">
              {product.price.toLocaleString()} د.ج
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                {product.originalPrice.toLocaleString()} د.ج
              </span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-orange-600 font-bold bg-orange-100 px-2 py-1 rounded-full animate-pulse">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2 items-center">
          <Button
            variant="primary"
            size="sm"
            icon={ShoppingCart}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1 text-sm font-semibold hover-lift btn-primary shadow-medium"
          >
            {cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="px-4 hover-lift hover-glow"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}