import React, { useState } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Heart,
  Share2,
  Star,
  Shield,
  Truck,
  RotateCcw,
  Check,
  Minus,
  Plus,
  BookmarkPlus,
  Calendar,
  Clock,
  User,
  Phone,
  MapPin,
  MessageSquare,
  X
} from 'lucide-react';
import { Button } from '../ui/Button';

// تعريف نوع المنتج محلياً لتجنب مشاكل import
interface Product {
  id: number;
  name: string;
  brand: string;
  images: string[];
  price: number;
  originalPrice?: number;
  stock: number;
  warranty?: string;
  shortDescription: string;
}

// تعريف نوع الحجز محلياً
interface ReservationItem {
  product: Product;
  quantity: number;
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [showReservationForm, setShowReservationForm] = useState(false);
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerWhatsApp: '',
    pickupBranch: 'main-store',
    proposedDate: '',
    proposedTime: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [cart, setCart] = useState<{ [key: number]: number }>({});
  const [reservations, setReservations] = useState<ReservationItem[]>([]);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const branches = [
    { value: 'main-store', label: 'Main Store - Downtown' },
    { value: 'tech-plaza', label: 'Tech Plaza Branch' },
    { value: 'mall-location', label: 'Shopping Mall Location' }
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM',
    '5:00 PM', '6:00 PM'
  ];

  const handleAddToCart = () => {
    setCart(prev => ({
      ...prev,
      [product.id]: (prev[product.id] || 0) + quantity
    }));
  };

  const handleAddToReservation = () => {
    setReservations(prev => {
      const existing = prev.find(r => r.product.id === product.id);
      if (existing) {
        return prev.map(r =>
          r.product.id === product.id ? { ...r, quantity: r.quantity + quantity } : r
        );
      } else {
        return [...prev, { product, quantity }];
      }
    });
    setShowReservationForm(false);
  };

  const handleQuantityChange = (newQuantity: number) => {
    if (newQuantity >= 1 && newQuantity <= product.stock) {
      setQuantity(newQuantity);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleReservationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    handleAddToReservation();
    // Reset form
    setFormData({
      customerName: '',
      customerPhone: '',
      customerWhatsApp: '',
      pickupBranch: 'main-store',
      proposedDate: '',
      proposedTime: '',
      notes: ''
    });
    setLoading(false);
  };

  const cartItemQuantity = cart[product.id] || 0;
  const reservationItem = reservations.find(r => r.product.id === product.id);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-8 transition-colors duration-200">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* صور المنتج */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            <img src={product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover" />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discountPercent}%</div>
            )}
          </div>

          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((image, index) => (
                <button key={index} onClick={() => setSelectedImageIndex(index)} className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 transition-colors duration-200 ${selectedImageIndex === index ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'}`}>
                  <img src={image} alt={`${product.name} ${index + 1}`} className="w-full h-full object-cover" />
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
                <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50 transition-colors duration-200">
                  <Heart className="w-5 h-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50 transition-colors duration-200">
                  <Share2 className="w-5 h-5" />
                </button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              <div className="flex items-center">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400 fill-current' : 'text-gray-300'}`} />
                ))}
              </div>
              <span className="text-sm text-gray-600 ml-2">(4.2) • 127 reviews</span>
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
          </div>

          <div className="border-t border-b border-gray-200 py-6">
            <div className="flex items-center space-x-4">
              <span className="text-4xl font-bold text-gray-900">{product.price.toLocaleString()} د.ج</span>
              {product.originalPrice && <span className="text-xl text-gray-500 line-through">{product.originalPrice.toLocaleString()} د.ج</span>}
              {discountPercent > 0 && <span className="bg-red-100 text-red-800 text-sm font-medium px-2 py-1 rounded">وفر {discountPercent}%</span>}
            </div>
            <div className="mt-3">
              {product.stock > 0 ? (
                <div className="flex items-center text-green-600"><Check className="w-5 h-5 mr-2" /><span className="font-medium">متوفر ({product.stock} قطعة)</span></div>
              ) : (
                <div className="flex items-center text-red-600"><Minus className="w-5 h-5 mr-2" /><span className="font-medium">غير متوفر</span></div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">الكمية:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1} className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= product.stock} className="p-2 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button onClick={handleAddToCart} disabled={product.stock === 0} icon={ShoppingCart} size="lg" className="flex-1 transition-all duration-300 hover:scale-105">
                {cartItemQuantity ? `تحديث السلة (${cartItemQuantity})` : 'إضافة إلى السلة'}
              </Button>

              <Button onClick={() => setShowReservationForm(true)} disabled={product.stock === 0} icon={BookmarkPlus} size="lg" className="flex-1 bg-purple-600 hover:bg-purple-700 text-white transition-all duration-300 hover:scale-105">
                {reservationItem ? `تحديث الحجز (${reservationItem.quantity})` : 'إضافة إلى الحجوزات'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className
