import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Minus,
  Plus,
  BookmarkPlus,
  X,
  Check
} from 'lucide-react';
import { Button } from '../ui/Button';
import CartSidebar from '../cart/CartSidebar';

// Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface Product {
  id: number;
  name: string;
  brand: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  shortDescription: string;
  category?: { name: string };
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

interface CartItem {
  product: Product;
  quantity: number;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= product.stock) setQuantity(newQty);
  };

  const addToCart = () => {
    if (product.stock <= 0) {
      alert('هذا المنتج غير متوفر في المخزون!');
      return;
    }

    setCartItems(prev => {
      const existing = prev.find(item => item.product.id === product.id);
      if (existing) {
        return prev.map(item =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });

    setShowCartSidebar(true);
  };

  const updateCartItem = (productId: number, newQty: number) => {
    setCartItems(prev =>
      prev.map(item =>
        item.product.id === productId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const removeCartItem = (productId: number) => {
    setCartItems(prev => prev.filter(item => item.product.id !== productId));
  };

  const cartQuantity = cartItems.find(item => item.product.id === product.id)?.quantity || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="w-5 h-5 mr-2"/> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* الصور */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            <img src={product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover"/>
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">
                -{discountPercent}%
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((img,i)=>(
                <button key={i} onClick={()=>setSelectedImageIndex(i)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${i===selectedImageIndex?'border-blue-500':'border-gray-200 hover:border-gray-300'}`}>
                  <img src={img} alt="" className="w-full h-full object-cover"/>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* تفاصيل المنتج */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">{product.brand}</span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_,i)=><Star key={i} className={`w-5 h-5 ${i<4?'text-yellow-400':'text-gray-300'}`}/>)}
            </div>
            <p className="text-gray-600">{product.shortDescription}</p>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">الكمية:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={()=>handleQuantityChange(quantity-1)} disabled={quantity<=1}><Minus className="w-4 h-4"/></button>
                <span className="px-4">{quantity}</span>
                <button onClick={()=>handleQuantityChange(quantity+1)} disabled={quantity>=product.stock}><Plus className="w-4 h-4"/></button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={addToCart} disabled={product.stock===0} icon={ShoppingCart} className="flex-1 relative">
                إضافة إلى السلة {cartQuantity>0 && `(${cartQuantity})`}
              </Button>
              <Button onClick={()=>setShowReservationForm(true)} disabled={product.stock===0} icon={BookmarkPlus} className="flex-1 bg-purple-600 text-white">
                حجز الآن
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCartSidebar && (
        <CartSidebar
          cartItems={cartItems}
          onClose={()=>setShowCartSidebar(false)}
          onUpdateItem={updateCartItem}
          onRemoveItem={removeCartItem}
        />
      )}
    </div>
  );
}
