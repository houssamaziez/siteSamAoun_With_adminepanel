import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Shield, Truck, RotateCcw, Check, Minus, Plus, BookmarkPlus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { createClient } from '@supabase/supabase-js';

// Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addItem, getItem, updateItem } = useCart();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [activeTab, setActiveTab] = useState<'description' | 'specifications' | 'reviews'>('description');
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

  const cartItem = getItem(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= product.stock) setQuantity(newQty);
  };

  const handleAddToCart = () => {
    if (cartItem) updateItem(product.id, { quantity: cartItem.quantity + quantity });
    else addItem(product, quantity);

    const addButton = document.querySelector('[data-add-to-cart]') as HTMLElement;
    if (addButton) {
      addButton.classList.add('animate-pulse');
      setTimeout(() => addButton.classList.remove('animate-pulse'), 800);
    }
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fill date and time automatically
  useEffect(() => {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    const hh = String(now.getHours()).padStart(2, '0');
    const min = String(now.getMinutes()).padStart(2, '0');

    setFormData(prev => ({
      ...prev,
      proposedDate: `${yyyy}-${mm}-${dd}`,
      proposedTime: `${hh}:${min}`
    }));
  }, [showReservationForm]);

  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const reservationData = {
        reference_number: `REF-${Date.now()}`,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_whatsapp: formData.customerWhatsApp,
        pickup_branch: formData.pickupBranch,
        proposed_date: formData.proposedDate,
        proposed_time: formData.proposedTime,
        notes: formData.notes,
        items: [{ product, quantity }],
        total_amount: product.price * quantity
      };

      const { error } = await supabase.from('reservations').insert([reservationData]);
      if (error) throw error;
      alert('Reservation submitted successfully!');
      setShowReservationForm(false);
      setFormData({
        customerName: '',
        customerPhone: '',
        customerWhatsApp: '',
        pickupBranch: 'main-store',
        proposedDate: '',
        proposedTime: '',
        notes: ''
      });
    } catch (err) {
      console.error(err);
      alert('An error occurred while submitting the reservation!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back Button */}
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="w-5 h-5 mr-2" /> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative shadow-md">
            <img src={product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover" />
            {discountPercent > 0 && (
              <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full shadow">
                -{discountPercent}%
              </div>
            )}
          </div>
          {product.images.length > 1 && (
            <div className="flex space-x-2 overflow-x-auto">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImageIndex(i)}
                  className={`flex-shrink-0 w-20 h-20 rounded-lg overflow-hidden border-2 ${
                    i === selectedImageIndex ? 'border-blue-500' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">{product.brand}</span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"><Heart className="w-5 h-5" /></button>
                <button className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"><Share2 className="w-5 h-5" /></button>
              </div>
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-4">{product.name}</h1>
            <div className="flex items-center mb-4">
              {[...Array(5)].map((_, i) => <Star key={i} className={`w-5 h-5 ${i < 4 ? 'text-yellow-400' : 'text-gray-300'}`} />)}
            </div>
            <p className="text-gray-600 text-lg leading-relaxed">{product.shortDescription}</p>
          </div>

          {/* Quantity & Actions */}
          <div className="space-y-4">
            <div className="flex items-center space-x-4">
              <span className="text-sm font-medium text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button onClick={() => handleQuantityChange(quantity - 1)} disabled={quantity <= 1}><Minus className="w-4 h-4" /></button>
                <span className="px-4 py-2 font-medium">{quantity}</span>
                <button onClick={() => handleQuantityChange(quantity + 1)} disabled={quantity >= product.stock}><Plus className="w-4 h-4" /></button>
              </div>
            </div>

            <div className="flex space-x-4">
              <Button data-add-to-cart onClick={handleAddToCart} disabled={product.stock === 0} icon={ShoppingCart} className="flex-1">
                {cartItem ? `Update Cart (${cartItem.quantity})` : 'Add to Cart'}
              </Button>

              <Button onClick={() => setShowReservationForm(true)} disabled={product.stock === 0} icon={BookmarkPlus} className="flex-1 bg-purple-600 text-white">
                Reserve Now
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Product Tabs */}
      <div className="mt-16">
        <div className="border-b border-gray-200">
          <nav className="flex space-x-8">
            {[
              { id: 'description', label: 'Description' },
              { id: 'specifications', label: 'Specifications' },
              { id: 'reviews', label: 'Reviews (127)' }
            ].map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id ? 'border-blue-500 text-blue-600' : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
        <div className="py-8">
          {activeTab === 'description' && <p className="text-gray-700">{product.shortDescription}</p>}
          {activeTab === 'specifications' && <p className="text-gray-700">No specifications available.</p>}
          {activeTab === 'reviews' && <p className="text-gray-500 text-center py-12">Reviews coming soon!</p>}
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6 shadow-lg">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Reservation Form</h2>
              <button onClick={() => setShowReservationForm(false)}><X className="w-6 h-6 text-gray-500"/></button>
            </div>
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <input name="customerName" placeholder="Full Name" value={formData.customerName} onChange={handleFormChange} className="w-full border rounded px-3 py-2"/>
              <input name="customerPhone" placeholder="Phone Number" value={formData.customerPhone} onChange={handleFormChange} className="w-full border rounded px-3 py-2"/>
              <input name="customerWhatsApp" placeholder="WhatsApp" value={formData.customerWhatsApp} onChange={handleFormChange} className="w-full border rounded px-3 py-2"/>
              <input name="proposedDate" type="date" value={formData.proposedDate} onChange={handleFormChange} className="w-full border rounded px-3 py-2"/>
              <input name="proposedTime" type="time" value={formData.proposedTime} onChange={handleFormChange} className="w-full border rounded px-3 py-2"/>
              <textarea name="notes" placeholder="Notes" value={formData.notes} onChange={handleFormChange} className="w-full border rounded px-3 py-2"/>
              <Button type="submit" disabled={loading} className="w-full bg-purple-600 text-white">{loading ? 'Submitting...' : 'Submit Reservation'}</Button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}