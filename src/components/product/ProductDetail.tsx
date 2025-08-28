import React, { useState, useEffect } from 'react';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, BookmarkPlus, X } from 'lucide-react';
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

  // ⬇️⬇️ هذه الإضافة المهمة لعمل Scroll لأعلى الصفحة عند الدخول ⬇️⬇️
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, []);

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
      {/* باقي الكود كما هو */}
    </div>
  );
}
