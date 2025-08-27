import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'techhub_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [version, setVersion] = useState(0);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart);
        console.log('Loading cart from localStorage:', parsedCart);
        setItems(parsedCart);
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  // Save cart to localStorage whenever items change (but only after initial load)
  useEffect(() => {
    if (isLoaded) {
      try {
        console.log('Saving cart to localStorage:', items);
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
        // Force version update to trigger re-renders
        setVersion(prev => prev + 1);
      } catch (error) {
        console.error('Failed to save cart to localStorage:', error);
      }
    }
  }, [items, isLoaded]);

  const addItem = useCallback((product: Product, quantity: number = 1, notes?: string) => {
    console.log('useCart addItem called:', product.name, 'quantity:', quantity);
    
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      let newItems;
      
      if (existingIndex >= 0) {
        console.log('Item exists, updating quantity');
        newItems = [...prev];
        newItems[existingIndex] = {
          ...newItems[existingIndex],
          quantity: newItems[existingIndex].quantity + quantity,
          notes: notes || newItems[existingIndex].notes
        };
      } else {
        console.log('Adding new item to cart');
        const newItem: CartItem = { product, quantity, notes };
        newItems = [...prev, newItem];
      }
      
      console.log('New cart state:', newItems);
      return newItems;
    });
  }, []);

  const updateItem = useCallback((productId: string, updates: Partial<Pick<CartItem, 'quantity' | 'notes'>>) => {
    console.log('Updating cart item:', productId, updates);
    setItems(prev => {
      const updated = prev.map(item => 
        item.product.id === productId 
          ? { ...item, ...updates }
          : item
      );
      console.log('Cart after update:', updated);
      return updated;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    console.log('Removing item from cart:', productId);
    setItems(prev => {
      const filtered = prev.filter(item => item.product.id !== productId);
      console.log('Cart after removal:', filtered);
      return filtered;
    });
  }, []);

  const clearCart = useCallback(() => {
    console.log('Clearing cart');
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    const count = items.reduce((total, item) => total + item.quantity, 0);
    console.log('Cart item count:', count);
    return count;
  }, [items]);

  const getTotalAmount = useCallback(() => {
    const total = items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
    console.log('Cart total amount:', total);
    return total;
  }, [items]);

  const getItem = useCallback((productId: string) => {
    return items.find(item => item.product.id === productId);
  }, [items]);

  return {
    items,
    itemCount: getItemCount(),
    version, // Expose version for components that need to track changes
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemCount,
    getTotalAmount,
    getItem,
    isLoaded
  };
}