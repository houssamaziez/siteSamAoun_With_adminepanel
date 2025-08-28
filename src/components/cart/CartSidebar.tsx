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

  const cartCount = getItemCount();
  const cartTotal = getTotalAmount();
  const isUpdating = cartIsUpdating || localUpdating;

  // Refresh cart when sidebar opens
  useEffect(() => {
    if (isOpen) refreshCart();
  }, [isOpen, refreshCart]);

  if (!isOpen) return null;

  const handleQuantityChange = (productId: string, newQuantity: number) => {
    setLocalUpdating(true);
    if (newQuantity <= 0) removeItem(productId);
    else updateItem(productId, { quantity: newQuantity });
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
      <div className="absolute right-0 top-0 h-full w-full sm:max-w-md bg-white/95 backdrop-blur-md shadow-lg transform transition-transform duration-500 ease-in-out animate-slide-in flex flex-col">
        
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-purple-50 relative">
          <div className="flex items-center space-x-2">
            <ShoppingBag className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600 animate-float" />
            <h2 className="text-xl sm:text-2xl font-bold gradient-text">
              Cart ({cartCount})
            </h2>
          </div>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => {
                setLocalUpdating(true);
                refreshCart();
                setTimeout(() => setLocalUpdating(false), 500);
              }}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200 text-gray-500 hover:text-blue-600"
              title="Refresh Cart"
            >
              <svg className={`w-5 h-5 ${isUpdating ? 'animate-spin' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-full transition-colors duration-200"
            >
              <X className="w-6 h-6 text-gray-500" />
            </button>
          </div>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6" style={{ height: 'calc(100vh - 200px)' }}>
          {items.length === 0 ? (
            <div className="text-center py-20">
              <ShoppingBag className="w-16 h-16 sm:w-20 sm:h-20 text-gray-300 mx-auto mb-4 animate-float" />
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-2">Your cart is empty</h3>
              <p className="text-gray-500 text-sm sm:text-lg">Add some products to get started!</p>
            </div>
          ) : (
            <div className="space-y-4 sm:space-y-6">
              {items.map((item) => (
                <div 
                  key={item.product.id}
                  className="flex items-center space-x-3 sm:space-x-4 bg-gradient-to-r from-gray-50 to-blue-50/30 rounded-lg sm:rounded-xl p-3 sm:p-5 shadow-sm"
                >
                  <img
                    src={item.product.images?.[0] || '/placeholder-image.jpg'}
                    alt={item.product.name}
                    className="w-16 h-16 sm:w-20 sm:h-20 object-cover rounded-lg sm:rounded-xl shadow"
                  />

                  <div className="flex-1">
                    <h3 className="font-bold text-base sm:text-lg text-gray-900 line-clamp-2 mb-1">
                      {item.product.name}
                    </h3>
                    <p className="text-xs sm:text-sm text-gray-600 mb-1">{item.product.brand}</p>
                    <p className="text-lg sm:text-xl font-bold gradient-text">
                      {item.product.price.toLocaleString()} DZD
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity - 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-200 hover:bg-red-200 rounded-full shadow transition-all duration-200"
                        disabled={isUpdating}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="w-8 sm:w-10 text-center font-bold text-base sm:text-lg">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => handleQuantityChange(item.product.id, item.quantity + 1)}
                        className="w-8 h-8 sm:w-10 sm:h-10 flex items-center justify-center bg-gray-200 hover:bg-green-200 rounded-full shadow transition-all duration-200"
                        disabled={isUpdating}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <button
                      onClick={() => removeItem(item.product.id)}
                      className="text-red-500 hover:text-red-700 text-xs sm:text-sm font-medium bg-red-50 hover:bg-red-100 px-2 sm:px-3 py-1 rounded-full transition-all duration-200"
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
          <div className="border-t border-gray-200 p-4 sm:p-6 space-y-3 sm:space-y-6 bg-gradient-to-r from-blue-50 to-purple-50 sticky bottom-0">
            {/* Total */}
            <div className="flex items-center justify-between text-lg sm:text-xl font-bold">
              <span className="text-gray-900">Total:</span>
              <span className="gradient-text text-xl sm:text-2xl">{cartTotal.toLocaleString()} DZD</span>
            </div>

            {/* Checkout Button */}
            <Button
              onClick={handleCheckout}
              size="lg"
              disabled={isUpdating}
              icon={ArrowRight}
              iconPosition="right"
              className="w-full shadow btn-primary text-base sm:text-lg py-3 sm:py-4"
            >
              {isUpdating ? 'Processing...' : 'Proceed to Reservation'}
            </Button>

            {/* Additional Info */}
            <div className="text-center mt-2">
              <p className="text-xs sm:text-sm text-gray-500">
                Click to confirm your reservation request
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
