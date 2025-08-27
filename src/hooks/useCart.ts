import { useState, useCallback, useEffect, useRef } from 'react';
import { CartItem, Product } from '../types';

const CART_STORAGE_KEY = 'techhub_cart';
const CART_SESSION_KEY = 'techhub_cart_session';
const CART_BACKUP_KEY = 'techhub_cart_backup';

// In-memory cache for faster access
let memoryCache: CartItem[] = [];
let cacheTimestamp = 0;
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

export function useCart() {
  const [items, setItems] = useState<CartItem[]>([]);
  const [updateTrigger, setUpdateTrigger] = useState(0);
  const [isUpdating, setIsUpdating] = useState(false);
  const isInitialized = useRef(false);
  const saveTimeout = useRef<NodeJS.Timeout>();

  // Enhanced cache management
  const getCachedCart = useCallback((): CartItem[] => {
    const now = Date.now();
    
    // Check memory cache first (fastest)
    if (memoryCache.length > 0 && (now - cacheTimestamp) < CACHE_DURATION) {
      console.log('🚀 Using memory cache for cart data');
      return memoryCache;
    }

    // Try sessionStorage (faster than localStorage)
    try {
      const sessionData = sessionStorage.getItem(CART_SESSION_KEY);
      if (sessionData) {
        const parsed = JSON.parse(sessionData);
        if (Array.isArray(parsed) && parsed.length > 0) {
          console.log('⚡ Using session storage for cart data');
          memoryCache = parsed;
          cacheTimestamp = now;
          return parsed;
        }
      }
    } catch (error) {
      console.warn('⚠️ Session storage read failed:', error);
    }

    // Try localStorage (persistent)
    try {
      const localData = localStorage.getItem(CART_STORAGE_KEY);
      if (localData) {
        const parsed = JSON.parse(localData);
        if (Array.isArray(parsed)) {
          console.log('💾 Using local storage for cart data');
          memoryCache = parsed;
          cacheTimestamp = now;
          // Sync to session storage
          sessionStorage.setItem(CART_SESSION_KEY, localData);
          return parsed;
        }
      }
    } catch (error) {
      console.warn('⚠️ Local storage read failed:', error);
    }

    // Try backup storage
    try {
      const backupData = localStorage.getItem(CART_BACKUP_KEY);
      if (backupData) {
        const parsed = JSON.parse(backupData);
        if (Array.isArray(parsed)) {
          console.log('🔄 Using backup storage for cart data');
          memoryCache = parsed;
          cacheTimestamp = now;
          return parsed;
        }
      }
    } catch (error) {
      console.warn('⚠️ Backup storage read failed:', error);
    }

    console.log('📭 No cached cart found, starting fresh');
    return [];
  }, []);

  // Enhanced save with multiple storage layers
  const saveCartToCache = useCallback((cartItems: CartItem[]) => {
    const cartData = JSON.stringify(cartItems);
    const now = Date.now();

    // Update memory cache immediately
    memoryCache = [...cartItems];
    cacheTimestamp = now;

    // Debounced save to storage
    if (saveTimeout.current) {
      clearTimeout(saveTimeout.current);
    }

    saveTimeout.current = setTimeout(() => {
      try {
        // Save to localStorage (primary)
        localStorage.setItem(CART_STORAGE_KEY, cartData);
        console.log('💾 Cart saved to localStorage');

        // Save to sessionStorage (faster access)
        sessionStorage.setItem(CART_SESSION_KEY, cartData);
        console.log('⚡ Cart saved to sessionStorage');

        // Save backup
        localStorage.setItem(CART_BACKUP_KEY, cartData);
        console.log('🔄 Cart backup saved');

        // Trigger update
        setUpdateTrigger(prev => prev + 1);
        console.log('✅ Cart cache updated successfully');
      } catch (error) {
        console.error('❌ Failed to save cart to cache:', error);
        
        // Try alternative storage if main fails
        try {
          localStorage.setItem(CART_BACKUP_KEY, cartData);
          console.log('🆘 Cart saved to backup storage only');
        } catch (backupError) {
          console.error('❌ Backup save also failed:', backupError);
        }
      }
    }, 100); // 100ms debounce
  }, []);

  // Load cart from cache on mount
  useEffect(() => {
    if (!isInitialized.current) {
      console.log('🔄 Initializing cart from cache...');
      const cachedCart = getCachedCart();
      setItems(cachedCart);
      isInitialized.current = true;
      console.log('✅ Cart initialized with', cachedCart.length, 'items');
    }
  }, [getCachedCart]);

  // Save cart whenever items change
  useEffect(() => {
    if (isInitialized.current) {
      console.log('💾 Saving cart changes to cache:', items.length, 'items');
      saveCartToCache(items);
    }
  }, [items, saveCartToCache]);

  // Clear cache timeout on unmount
  useEffect(() => {
    return () => {
      if (saveTimeout.current) {
        clearTimeout(saveTimeout.current);
      }
    };
  }, []);

  const addItem = useCallback((product: Product, quantity: number = 1, notes?: string) => {
    console.log('🛒 ADD TO CART - Product:', product.name, 'Quantity:', quantity);
    console.log('🛒 Product details:', { id: product.id, price: product.price, stock: product.stock });
    console.log('🛒 Current cart state before adding:', items.length, 'items');
    
    setIsUpdating(true);
    
    // Validate product
    if (!product || !product.id) {
      console.error('❌ Invalid product data:', product);
      alert('Invalid product data');
      setIsUpdating(false);
      return;
    }
    
    // Check stock
    if (product.stock <= 0) {
      console.warn('⚠️ Product out of stock:', product.name);
      alert('This product is out of stock');
      setIsUpdating(false);
      return;
    }
    
    setItems(prev => {
      console.log('🛒 Processing add to cart...');
      console.log('🛒 Previous cart items:', prev.length);
      
      const existingIndex = prev.findIndex(item => item.product.id === product.id);
      console.log('🔍 Existing item index:', existingIndex);
      
      let newItems: CartItem[];
      
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
      
      console.log('✅ New cart state:', newItems.length, 'items');
      console.log('✅ Total items in cart:', newItems.reduce((sum, item) => sum + item.quantity, 0));
      
      // Immediate memory cache update
      memoryCache = [...newItems];
      cacheTimestamp = Date.now();
      
      // Force trigger update
      setTimeout(() => {
        setUpdateTrigger(prev => prev + 1);
        setIsUpdating(false);
        console.log('🔔 Cart update trigger fired');
      }, 100);
      
      return newItems;
    });
  }
  )

  const updateItem = useCallback((productId: string, updates: Partial<Pick<CartItem, 'quantity' | 'notes'>>) => {
    console.log('🔄 Updating cart item:', productId, updates);
    setIsUpdating(true);
    setItems(prev => {
      const updated = prev.map(item => 
        item.product.id === productId 
          ? { ...item, ...updates }
          : item
      );
      console.log('✅ Cart after update:', updated);
      setTimeout(() => {
        setUpdateTrigger(prev => prev + 1);
        setIsUpdating(false);
      }, 100);
      return updated;
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    console.log('🗑️ Removing item from cart:', productId);
    setIsUpdating(true);
    setItems(prev => {
      const filtered = prev.filter(item => item.product.id !== productId);
      console.log('✅ Cart after removal:', filtered);
      setTimeout(() => {
        setUpdateTrigger(prev => prev + 1);
        setIsUpdating(false);
      }, 100);
      return filtered;
    });
  }, []);

  const clearCart = useCallback(() => {
    console.log('🧹 Clearing cart and all caches');
    setItems([]);
    
    // Clear all caches
    memoryCache = [];
    cacheTimestamp = 0;
    
    try {
      localStorage.removeItem(CART_STORAGE_KEY);
      localStorage.removeItem(CART_BACKUP_KEY);
      sessionStorage.removeItem(CART_SESSION_KEY);
      console.log('✅ All cart caches cleared');
    } catch (error) {
      console.error('❌ Failed to clear some caches:', error);
    }
  }, []);

  const refreshCart = useCallback(() => {
    console.log('🔄 Refreshing cart from cache...');
    const cachedCart = getCachedCart();
    setItems(cachedCart);
    setUpdateTrigger(prev => prev + 1);
    console.log('✅ Cart refreshed with', cachedCart.length, 'items');
  }, [getCachedCart]);

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

  // Cache status for debugging
  const getCacheStatus = useCallback(() => {
    const now = Date.now();
    return {
      memoryCache: memoryCache.length,
      memoryCacheAge: now - cacheTimestamp,
      isMemoryCacheValid: (now - cacheTimestamp) < CACHE_DURATION,
      localStorage: !!localStorage.getItem(CART_STORAGE_KEY),
      sessionStorage: !!sessionStorage.getItem(CART_SESSION_KEY),
      backup: !!localStorage.getItem(CART_BACKUP_KEY)
    };
  }, []);

  return {
    items,
    updateTrigger,
    isUpdating,
    addItem,
    updateItem,
    removeItem,
    clearCart,
    refreshCart,
    getItemCount,
    getTotalAmount,
    getItem,
    getCacheStatus // For debugging
  };
}