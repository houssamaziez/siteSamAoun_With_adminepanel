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
     buttonElement.textContent = 'Added!';
     buttonElement.classList.add('bg-green-500', 'hover:bg-green-600');
     buttonElement.classList.remove('bg-blue-600', 'hover:bg-blue-700');
     
     setTimeout(() => {
       if (buttonElement && buttonElement.textContent === 'Added!') {
         buttonElement.textContent = originalText;
         buttonElement.classList.remove('bg-green-500', 'hover:bg-green-600');
         buttonElement.classList.add('bg-blue-600', 'hover:bg-blue-700');
       }
     }, 2000);
   }
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
      className="group bg-white rounded-xl shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1 cursor-pointer overflow-hidden border border-gray-100"
      onClick={onViewDetails}
    >
      {/* Image Container */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        <img
          src={product.images[0]}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          loading="lazy"
        />
        
        {/* Discount Badge */}
        {discountPercent > 0 && (
          <div className="absolute top-3 left-3 bg-red-500 text-white text-xs font-bold px-2 py-1 rounded-full">
            -{discountPercent}%
          </div>
        )}

        {/* Stock Status */}
        {product.stock === 0 && (
          <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
            <span className="text-white font-semibold text-lg">Out of Stock</span>
          </div>
        )}

        {/* Quick Actions */}
        <div className="absolute top-3 right-3 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
          <button className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200">
            <Heart className="w-5 h-5 text-gray-600 hover:text-red-500" />
          </button>
          <button 
            onClick={handleViewDetails}
            className="p-2 bg-white rounded-full shadow-lg hover:bg-gray-50 transition-colors duration-200"
          >
            <Eye className="w-5 h-5 text-gray-600 hover:text-blue-500" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        {/* Brand & Category */}
        <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
          <span className="font-medium">{product.brand}</span>
          <span>{product.category.name}</span>
        </div>

        {/* Product Name */}
        <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2 group-hover:text-blue-600 transition-colors duration-200">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2">
          {product.shortDescription}
        </p>

        {/* Rating (mock) */}
        <div className="flex items-center mb-3">
          <div className="flex items-center">
            {[...Array(5)].map((_, i) => (
              <Star 
                key={i} 
                className={`w-4 h-4 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
              />
            ))}
          </div>
          <span className="text-sm text-gray-500 ml-2">(4.2)</span>
        </div>

        {/* Price */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-bold text-gray-900">
              ${product.price.toLocaleString()}
            </span>
            {product.originalPrice && (
              <span className="text-sm text-gray-500 line-through">
                ${product.originalPrice.toLocaleString()}
              </span>
            )}
          </div>
          {product.stock <= 5 && product.stock > 0 && (
            <span className="text-xs text-orange-600 font-medium">
              Only {product.stock} left
            </span>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button
            variant="primary"
            size="sm"
            icon={ShoppingCart}
            onClick={handleAddToCart}
            disabled={product.stock === 0}
            className="flex-1"
          >
            {cartItem ? `In Cart (${cartItem.quantity})` : 'Add to Cart'}
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={handleViewDetails}
            className="px-3"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
}