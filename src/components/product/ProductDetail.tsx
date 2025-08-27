import React, { useState } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Shield, Truck, RotateCcw, Check, Minus, Plus } from 'lucide-react';
import { Button } from '../ui/Button';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addItem, getItem, updateItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
  
  const cartItem = getItem(product.id);
  const discountPercent = product.originalPrice 
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleAddToCart = () => {
    console.log('Adding to cart from detail:', product.name, 'quantity:', quantity); // Debug log
    if (cartItem) {
      updateItem(product.id, { quantity: cartItem.quantity + quantity });
    } else {
      addItem(product, quantity);
    }
    
    // Add visual feedback with animation
    const addButton = document.querySelector('[data-add-to-cart]') as HTMLElement;
    if (addButton) {
      addButton.classList.add('animate-pulse');
      addButton.style.transform = 'scale(1.05)';
      addButton.style.transition = 'all 0.3s ease';
      
      setTimeout(() => {
        addButton.classList.remove('animate-pulse');
        addButton.style.transform = '';
      }, 1000);
    }
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button
        onClick={onBack}
        className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200"
      >
        <ArrowLeft className="w-5 h-5 mr-2" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          {/* Main Image */}
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden">
            <img
              src={product.images[selectedImageIndex]}
              alt={product.name}
              className="w-full h-full object-cover"
            />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discountPercent}%
              </div>
            )}
          </div>

          {/* Thumbnail Images */}
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${
                    selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image}
                    alt={`${product.name} ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Header */}
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">{product.brand}</span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            
            {/* Rating */}
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} 
                  />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">(4.2) • 127 reviews</span>
            </div>

            <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
          </div>

          {/* Price */}
          <div className="border-t border-b border-gray-200 py-6">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">
                ${product.price.toLocaleString()}
              </span>
              {product.originalPrice && (
                <span className="text-xl text-gray-500 line-through">
                  ${product.originalPrice.toLocaleString()}
                </span>
              )}
              {discountPercent > 0 && (
                <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">
                  Save {discountPercent}%
                </span>
              )}
            </div>
            
            {/* Stock Status */}
            <div className="mt-3">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600">
                  <Check className="w-5 h-5 mr-2" />
                  <span className="font-medium">In Stock ({product.stock} available)</span>
                </div>
              ) : (
                <div className="flex items-center text-red-600">
                  <Minus className="w-5 h-5 mr-2" />
                  <span className="font-medium">Out of Stock</span>
                </div>
              )}
            </div>
          </div>

          {/* Quantity & Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => handleQuantityChange(quantity - 1)}
                  disabled={quantity <= 1}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button
                  onClick={() => handleQuantityChange(quantity + 1)}
                  disabled={quantity >= product.stock}
                  className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button
                data-add-to-cart
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                icon={ShoppingCart}
                size="lg"
                className="flex-1 transition-all duration-300 hover:scale-105"
              >
                {cartItem ? `Update Cart (${cartItem.quantity})` : 'Add to Cart'}
              </Button>
            </div>
          </div>

          {/* Features */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-6 border-t border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <Shield className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Warranty</p>
                <p className="text-sm text-gray-600">{product.warranty || '1 Year'}</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Truck className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Free Shipping</p>
                <p className="text-sm text-gray-600">Same day delivery</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <RotateCcw className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="font-medium text-gray-900">Returns</p>
                <p className="text-sm text-gray-600">30-day policy</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Product Details Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews (127)' }
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>

        <div className="py-8">
          {activeTab === 'description' && (
            <div className="prose max-w-none">
              <p className="text-gray-700 leading-relaxed text-lg">
                {product.description || product.shortDescription}
              </p>
            </div>
          )}

          {activeTab === 'specifications' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {Object.entries(product.specifications || {}).map(([key, value]) => (
                <div key={key} className="flex justify-between py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-900">{key}</span>
                  <span className="text-gray-600">{value}</span>
                </div>
              ))}
              {Object.keys(product.specifications || {}).length === 0 && (
                <p className="text-gray-500 col-span-2">No specifications available.</p>
              )}
            </div>
          )}

          {activeTab === 'reviews' && (
            <div className="space-y-6">
              <div className="text-center py-12">
                <p className="text-gray-500">Reviews feature coming soon!</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}