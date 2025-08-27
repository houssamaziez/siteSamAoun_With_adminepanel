import React, { useState, useEffect } from 'react';
import { X, Plus, Minus, ShoppingBag, ArrowRight } from 'lucide-react';
import { Button } from '../ui/Button';
import { useCart } from '../../hooks/useCart';

interface CartSidebarProps {
  isOpen: boolean;
  onClose: () => void;
  onCheckout: () => void;
}

export function CartSidebar({ isOpen, onClose, onCheckout }: CartSidebarProps) {
  const { items, updateItem, removeItem, getTotalAmount, getItemCount, updateTrigger, refreshCart, getCacheStatus, isUpdating: cartIsUpdating } = useCart();
  const [localUpdating, setLocalUpdating] = useState(false);
  const [lastUpdated, setLastUpdated] = useState(Date.now());
  
  // Get current values directly
  const cartCount = getItemCount();
  const cartTotal = getTotalAmount();
  const isUpdating = cartIsUpdating || localUpdating;

  // Debug: Log cart items
  useEffect(() => {
    console.log('🛒 CartSidebar: Cart updated');
    console.log('🛒 CartSidebar: Items:', items.length);
    console.log('🛒 CartSidebar: Count:', cartCount);
    console.log('🛒 CartSidebar: Total:', cartTotal);
    console.log('🛒 CartSidebar: Cache status:', getCacheStatus());
    setLastUpdated(Date.now());
  }, [items, updateTrigger, cartCount, cartTotal, getCacheStatus]);

  // Auto-refresh cart when sidebar opens
  useEffect(() => {
    if (isOpen) {
      console.log('🔄 CartSidebar: Refreshing cart on open');
      refreshCart();
    }
  }, [isOpen, refreshCart]);

  if (!isOpen) return null;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setLocalUpdating(true);
    if (newQuantity <= 0) {
      removeItem(productId);
    } else {
      updateItem(productId, { quantity: newQuantity });
    }
    setTimeout(() => setLocalUpdating(false), 300);
  };

  const handleCheckout = () => {
    onClose();
    onCheckout();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black bg-opacity-50" onClick={onClose} />
      
      {/* Sidebar */}
      <div className="absolute right-0 top-0 h-full w-full max-w-md bg-white/95 backdrop-blur-md shadow-strong transform transition-all duration-500 ease-in-out animate-slide-in">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 relative">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-7 h-7 text-blue-600 animate-float" />
            <h2 className="text-2xl font-bold gradient-text">
              <span className={`transition-all duration-300 ${isUpdating ? 'animate-pulse' : ''}`}>
                Cart ({cartCount})
              </span>
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setLocalUpdating(true);
                refreshCart();
                setTimeout(() => setLocalUpdating(false), 500);
              }}
              className="p-2 hover:bg-gray-100 rounded-full hover-scale transition-colors duration-200 text-gray-500 hover:text-blue-600"
              title="Refresh cart"
            >
              <svg className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full hover-scale transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
          
          {/* Update indicator */}
          {isUpdating && (
            <div className="absolute top-2 right-2 w-2 h-2 bg-blue-500 rounded-full animate-ping"></div>
          )}
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6" style={{ height: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-20 animate-fade-in">
              <ShoppingBag className="w-20 h-20 text-gray-300 mx-auto mb-6 animate-float" />
              <h3 className="text-xl font-bold text-gray-900 mb-3">Your cart is empty</h3>
              <p className="text-gray-500 text-lg">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-6">
              {items.map((item) => (
                <div 
                  key={item.product.id} 
                  className={`flex items-center space-x-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-xl p-5 card-hover animate-fade-in glass transition-all duration-300 ${
                    isUpdating ? 'opacity-75 scale-98' : 'opacity-100 scale-100'
                  }`}
                >
                  <img
                    src={item.product.images?.[0] || '/placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-20 h-20 object-cover rounded-xl shadow-medium hover-scale"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement;
                      target.src = 'https://images.pexels.com/photos/18105/pexels-photo.jpg?auto=compress&cs=tinysrgb&w=200';
                    }}
                  />
                
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-sm text-gray-600 mb-2">{item.product.brand}</p>
                    <p className="text-xl font-bold gradient-text">
                      {item.product.price.toLocaleString()} د.ج
                    </p>
                  </div>

                  <div className="flex flex-col items-end space-y-2">
                    {/* Quantity Controls */}
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-red-200 rounded-full hover-scale shadow-soft transition-all duration-200"
                        disabled={isUpdating}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className={`w-10 text-center font-bold text-lg transition-all duration-300 ${
                        isUpdating ? 'animate-pulse' : ''
                      }`}>
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="w-10 h-10 flex items-center justify-center bg-gray-200 hover:bg-green-200 rounded-full hover-scale shadow-soft transition-all duration-200"
                        disabled={isUpdating}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>

                    {/* Remove Button */}
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 text-sm font-medium hover-scale bg-red-50 hover:bg-red-100 px-3 py-1 rounded-full transition-all duration-200"
                      disabled={isUpdating}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 relative">
            {/* Total */}
            <div className={`flex items-center justify-between text-xl font-bold transition-all duration-300 ${
              isUpdating ? 'animate-pulse' : ''
            }`}>
              <span className="text-gray-900">Total:</span>
              <span className="gradient-text animate-pulse-glow text-2xl">{cartTotal.toLocaleString()} د.ج</span>
            </div>

            {/* Last updated indicator */}
            <div className="text-xs text-gray-500 text-center">
              Last updated: {new Date(lastUpdated).toLocaleTimeString()}
            </div>

            {/* Note */}
            <p className="text-sm text-gray-600 text-center bg-yellow-50 p-3 rounded-lg border border-yellow-200">
              This is a reservation. Final payment will be made in-store.
            </p>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              size="lg"
              disabled={isUpdating}
              icon={ArrowRight}
              iconPosition="right"
              className={`w-full hover-lift btn-primary shadow-medium text-lg py-4 transition-all duration-300 ${
                isUpdating ? 'opacity-75 cursor-not-allowed' : ''
              }`}
            >
              {isUpdating ? 'Updating...' : 'Make Reservation'}
            </Button>
            
            {/* Additional Reservation Info */}
            <div className="text-center mt-3">
              <p className="text-xs text-gray-500">
                Click to proceed with your reservation request
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
