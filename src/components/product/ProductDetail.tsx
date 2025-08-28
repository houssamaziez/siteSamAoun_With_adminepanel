import React, { useState, useEffect } from 'react';
import {
  ArrowLeft,
  ShoppingCart,
  Calendar,
} from 'lucide-react';
import { Button } from '../ui/Button';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import { createClient } from '@supabase/supabase-js';

// Supabase setup
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

  // Scroll to top when product changes
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [product.id]);

  // Handle quantity changes
  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  // Add product to cart
  const handleAddToCart = () => {
    if (cartItem) {
      updateItem(product.id, { quantity: cartItem.quantity + quantity });
    } else {
      addItem(product, quantity);
    }

    const btn = document.querySelector('[data-add-to-cart]') as HTMLElement;
    if (btn) {
      btn.classList.add('animate-pulse');
      setTimeout(() => btn.classList.remove('animate-pulse'), 600);
    }
  };

  // Handle reservation form input changes
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Fill current date and time automatically when form is opened
  useEffect(() => {
    if (showReservationForm) {
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
    }
  }, [showReservationForm]);

  // Submit reservation to Supabase
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

      alert('✅ Reservation submitted successfully!');
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
      alert('❌ Error occurred while submitting reservation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Back button */}
      <div className="flex items-center gap-3 mb-4">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <h1 className="text-2xl font-bold">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Images */}
        <div>
          <img
            src={product.images[selectedImageIndex]}
            alt={product.name}
            className="rounded-2xl shadow-lg w-full h-96 object-cover"
          />
          <div className="flex gap-3 mt-3">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-20 h-20 rounded-lg cursor-pointer border-2 ${
                  selectedImageIndex === idx ? 'border-blue-600' : 'border-gray-300'
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-5">
          <p className="text-gray-600">{product.description}</p>
          <div className="flex items-center gap-3">
            <span className="text-2xl font-bold text-green-600">{product.price} DZD</span>
            {product.originalPrice && (
              <span className="line-through text-gray-400">{product.originalPrice} DZD</span>
            )}
            {discountPercent > 0 && (
              <span className="bg-red-500 text-white px-2 py-1 rounded-lg text-sm">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Product Quantity */}
          <div className="flex items-center gap-4">
            <Button onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
            <span className="text-xl">{quantity}</span>
            <Button onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              data-add-to-cart
              onClick={handleAddToCart}
              className="flex-1"
              icon={ShoppingCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowReservationForm(true)}
              className="flex-1"
              icon={Calendar}
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </div>

      {/* Reservation Form */}
      {showReservationForm && (
        <form onSubmit={handleReservationSubmit} className="mt-8 p-5 bg-gray-100 rounded-2xl shadow">
          {/* Reservation Title */}
          <h2 className="text-2xl font-bold mb-4">📝 Reservation Information</h2>
          <p className="text-gray-600 mb-6">
            Please fill in the details below to reserve your selected product.
          </p>

          {/* Contact Details */}
          <h3 className="text-lg font-semibold mb-2">👤 Contact Details</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleFormChange}
              placeholder="Full Name"
              className="p-3 rounded-lg border"
              required
            />
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleFormChange}
              placeholder="Phone Number"
              className="p-3 rounded-lg border"
              required
            />
            <input
              type="tel"
              name="customerWhatsApp"
              value={formData.customerWhatsApp}
              onChange={handleFormChange}
              placeholder="WhatsApp Number (optional)"
              className="p-3 rounded-lg border"
            />
          </div>

          {/* Pickup Preferences */}
          <h3 className="text-lg font-semibold mt-6 mb-2">📍 Pickup Preferences</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="date"
              name="proposedDate"
              value={formData.proposedDate}
              onChange={handleFormChange}
              className="p-3 rounded-lg border"
            />
            <input
              type="time"
              name="proposedTime"
              value={formData.proposedTime}
              onChange={handleFormChange}
              className="p-3 rounded-lg border"
            />
          </div>

          {/* Additional Notes */}
          <h3 className="text-lg font-semibold mt-6 mb-2">🗒️ Additional Notes</h3>
          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            placeholder="Write any additional instructions here..."
            className="p-3 rounded-lg border mt-3 w-full"
          />

          {/* Submit Button */}
          <Button
            type="submit"
            disabled={loading}
            className="mt-6 w-full"
          >
            {loading ? 'Submitting Reservation...' : '✅ Confirm Reservation'}
          </Button>
        </form>
      )}
    </div>
  );
}
