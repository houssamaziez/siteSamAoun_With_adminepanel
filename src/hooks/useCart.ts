import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'techhub_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      console.log('🔄 Loading cart from localStorage:', savedCart);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('📦 Parsed cart data:', parsedCart);
        if (Array.isArray(parsedCart)) {
          setItems(parsedCart);
          console.log('✅ Cart loaded successfully:', parsedCart.length, 'items');
        } else {
          console.warn('⚠️ Invalid cart data format, resetting cart');
          setItems([]);
        }
      } else {
        console.log('📭 No saved cart found, starting with empty cart');
        setItems([]);
      }
    } catch (error) {
      console.error('❌ Failed to load cart from localStorage:', error);
      setItems([]);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      console.log('💾 Saving cart to localStorage:', items);
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
      // Trigger update to notify components
      setUpdateTrigger(prev => prev + 1);
      console.log('✅ Cart saved successfully, trigger updated to:', updateTrigger + 1);
    } catch (error) {
      console.error('❌ Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1, notes?: string) => {
    console.log('🛒 ADD TO CART - Product:', product.name, 'Quantity:', quantity);
    console.log('🛒 Product details:', { id: product.id, price: product.price, stock: product.stock });
    console.log('🛒 Current cart state before adding:', items);
    
    // Validate product
    if (!product || !product.id) {
      console.error('❌ Invalid product data:', product);
      return;
    }
    
    // Check stock
    if (product.stock <= 0) {
      console.warn('⚠️ Product out of stock:', product.name);
      alert('This product is out of stock');
      return;
    }
    
    setItems(prev => {
      console.log('🛒 Current cart items:', prev);
      console.log('🛒 Cart is empty:', prev.length === 0);
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      console.log('🔍 Existing item index:', existingIndex);
      let newItems;
      
      if (existingIndex >= 0) {
        console.log('🔄 Item exists, updating quantity from', prev[existingIndex].quantity, 'to', prev[existingIndex].quantity + quantity);
        newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
          notes: notes || newItems[existingIndex].notes
        };
      } else {
        console.log('➕ Adding new item to cart');
        const newItem: CartItem = { product, quantity, notes };
        console.log('📦 New item created:', newItem);
        newItems = [...prev, newItem];
      }
      
      console.log('✅ New cart state:', newItems);
      console.log('✅ Total items in cart:', newItems.reduce((sum, item) => sum + item.quantity, 0));
      
      // Force immediate localStorage save
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(newItems));
        console.log('💾 Immediate save to localStorage completed');
      } catch (error) {
        console.error('❌ Failed immediate save:', error);
      }
      
      return newItems;
    });
  }, []);

  const updateItem = useCallback((productId: string, updates: Partial<Pick<CartItem, 'quantity' | 'notes'>>) => {
    console.log('🔄 Updating cart item:', productId, updates);
    setItems(prev => {
      const updated = prev.map(item => 
        item.product.id === productId 
          ? { ...item, ...updates }
          : item
      );
      console.log('✅ Cart after update:', updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    console.log('🗑️ Removing item from cart:', productId);
    setItems(prev => {
      const filtered = prev.filter(item => item.product.id !== productId);
      console.log('✅ Cart after removal:', filtered);
      return filtered;
    });
  }, []);

  const clearCart = useCallback(() => {
    console.log('🧹 Clearing cart');
    setItems([]);
    localStorage.removeItem(CART_STORAGE_KEY);
    console.log('✅ Cart cleared and localStorage cleaned');
  }, []);

  const getItemCount = useCallback(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    console.log('📊 Cart item count:', count);
    return count;
  }, [items]);

  const getTotalAmount = useCallback(() => {
    const total = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    console.log('💰 Cart total amount:', total);
    return total;
  }, [items]);

  const getItem = useCallback((productId: string) => {
    return items.find(item => item.product.id === productId);
  }, [items]);

  return {
    items,
    updateTrigger, // Expose update trigger for components that need to track changes
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemCount,
    getTotalAmount,
    getItem
  };
}