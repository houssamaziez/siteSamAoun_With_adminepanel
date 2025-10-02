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
  const { addItem, getItem, isUpdating } = useCart();
  const cartItem = getItem(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent any form submission or page refresh
    console.log('🛒 ProductCard: Adding to cart clicked for:', product.name);
    console.log('🛒 ProductCard: Current cart items before add:', getItem(product.id));
   
   // Validate product data
   if (!product || !product.id) {
     console.error('❌ ProductCard: Invalid product data:', product);
     return;
   }
   
   // Check stock
   if (product.stock <= 0) {
     console.warn('⚠️ ProductCard: Product out of stock:', product.name);
     alert('This product is out of stock');
     return;
   }
   
    console.log('🛒 ProductCard: Calling addItem with product:', {
      id: product.id,
      name: product.name,
      price: product.price,
      stock: product.stock
    });
    
    console.log('🛒 ProductCard: About to call addItem...');
    addItem(product, 1);
    console.log('🛒 ProductCard: addItem called successfully');
   
   // Enhanced visual feedback with professional animations
   const button = e.currentTarget as HTMLButtonElement;
   if (button) {
     console.log('✅ ProductCard: Showing enhanced visual feedback');
     
     // Add success animation classes
     button.classList.add('animate-pulse', 'bg-green-500', 'border-green-500', 'text-white');
     
     // Create floating success indicator
     const successIndicator = document.createElement('div');
     successIndicator.innerHTML = '✓ Added to Cart!';
     successIndicator.className = 'absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-bounce z-50 pointer-events-none';
     button.style.position = 'relative';
     button.appendChild(successIndicator);
     
     // Reset after animation
     setTimeout(() => {
       button.classList.remove('animate-pulse', 'bg-green-500', 'border-green-500', 'text-white');
       if (successIndicator.parentNode) {
         successIndicator.remove();
       }
     }, 2000);
   }
    
    // Additional check after adding
    setTimeout(() => {
      const updatedItem = getItem(product.id);
      console.log('🔍 ProductCard: Item after add attempt:', updatedItem);
    }, 100);
  };

  const handleBuyNow = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
  };

  const handleViewDetails = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
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
        <h3 className="font-bold text-lg text-gray-900 mb-3 line-clamp-2 group-hover:text-blue-600 transition-colors duration-300" dir="rtl">
          {product.name}
        </h3>

        {/* Description */}
        <p className="text-sm text-gray-600 mb-3 line-clamp-2" dir="rtl">
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
              متبقي {product.stock} فقط
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
            disabled={product.stock === 0 || isUpdating}
            loading={isUpdating}
            className="flex-1 text-sm font-semibold hover-lift btn-primary shadow-medium"
          >
            {isUpdating ? 'جاري الإضافة...' : cartItem ? `في السلة (${cartItem.quantity})` : 'أضف للسلة'}
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