import { useState, useCallback, useEffect } from 'react';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'techhub_cart';

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);

  // Load cart from localStorage on mount
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY);
      if (savedCart) {
        setItems(JSON.parse(savedCart));
      }
    } catch (error) {
      console.error('Failed to load cart from localStorage:', error);
    }
  }, []);

  // Save cart to localStorage whenever items change
  useEffect(() => {
    try {
      localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save cart to localStorage:', error);
    }
  }, [items]);

  const addItem = useCallback((product: Product, quantity: number = 1, notes?: string) => {
    console.log('useCart addItem called:', product.name, quantity); // Debug log
    setItems(prev => {
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      
      if (existingIndex >= 0) {
        console.log('Item exists, updating quantity'); // Debug log
        const updated = [...prev];
        updated[existingIndex] = {
          ...updated[existingIndex],
          quantity: updated[existingIndex].quantity + quantity,
          notes: notes || updated[existingIndex].notes
        };
        console.log('Updated cart:', updated); // Debug log
        return updated;
      }
      
      console.log('Adding new item to cart'); // Debug log
      const newCart = [...prev, { product, quantity, notes }];
      console.log('New cart:', newCart); // Debug log
      return newCart;
    });
  }, []);

  const updateItem = useCallback((productId: string, updates: Partial<Pick<CartItem, 'quantity' | 'notes'>>) => {
    setItems(prev => prev.map(item => 
      item.product.id === productId 
        ? { ...item, ...updates }
        : item
    ));
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems(prev => prev.filter(item => item.product.id !== productId));
  }, []);

  const clearCart = useCallback(() => {
    setItems([]);
  }, []);

  const getItemCount = useCallback(() => {
    return items.reduce((total, item) => total + item.quantity, 0);
  }, [items]);

  const getTotalAmount = useCallback(() => {
    return items.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  }, [items]);

  const getItem = useCallback((productId: string) => {
    return items.find(item => item.product.id === productId);
  }, [items]);

  return {
    items,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    getItemCount,
    getTotalAmount,
    getItem
  };
}