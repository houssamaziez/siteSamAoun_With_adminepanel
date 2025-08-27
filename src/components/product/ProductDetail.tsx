import React, { useState } from 'react';
import { createClient } from '@supabase/supabase-js';
import { ArrowLeft, ShoppingCart, Heart, Share2, Star, Minus, Plus, BookmarkPlus, X } from 'lucide-react';
import { Button } from '../ui/Button';
import { Product } from '../../types';
import { useCart } from '../../hooks/useCart';
import CartSidebar from "../cart/CartSidebar";

// Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { addItem, getItem, isUpdating } = useCart();
  const cartItem = getItem(product.id);

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
  const [showCartSidebar, setShowCartSidebar] = useState(false);

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const branches = [
    { value: 'main-store', label: 'Main Store - Downtown' },
    { value: 'tech-plaza', label: 'Tech Plaza Branch' },
    { value: 'mall-location', label: 'Shopping Mall Location' }
  ];

  const timeSlots = ['9:00 AM','10:00 AM','11:00 AM','12:00 PM','1:00 PM','2:00 PM','3:00 PM','4:00 PM','5:00 PM','6:00 PM'];

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= product.stock) setQuantity(newQty);
  };

  // --- Add to cart like ProductCard ---
  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (product.stock <= 0) return alert('هذا المنتج غير متوفر في المخزون!');

    addItem(product, quantity);

    // تأثير بصري على الزر
    const btn = e.currentTarget;
    btn.classList.add('animate-pulse', 'bg-green-500', 'text-white');

    const successIndicator = document.createElement('div');
    successIndicator.innerHTML = '✓ تمت الإضافة!';
    successIndicator.className = 'absolute -top-2 left-1/2 transform -translate-x-1/2 bg-green-500 text-white text-xs px-3 py-1 rounded-full animate-bounce z-50 pointer-events-none';
    btn.style.position = 'relative';
    btn.appendChild(successIndicator);

    setTimeout(() => {
      btn.classList.remove('animate-pulse', 'bg-green-500', 'text-white');
      if (successIndicator.parentNode) successIndicator.remove();
    }, 2000);

    setShowCartSidebar(true);
  };

  const handleFormChange = (e: React.ChangeEvent<HTMLInputElement|HTMLTextAreaElement|HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

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
        items: JSON.stringify([{ productId: product.id, name: product.name, quantity, price: product.price }]),
        total_amount: product.price * quantity
      };
      const { error } = await supabase.from('reservations').insert([reservationData]);
      if (error) throw error;
      alert('تم إرسال الحجز بنجاح!');
      setShowReservationForm(false);
      setFormData({
        customerName: '', customerPhone: '', customerWhatsApp: '',
        pickupBranch: 'main-store', proposedDate: '', proposedTime: '', notes: ''
      });
    } catch (err) {
      console.error(err);
      alert('حدث خطأ أثناء إرسال الحجز!');
    } finally { setLoading(false); }
  };

  const cartQuantity = getItem(product.id)?.quantity || 0;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative">
      <button onClick={onBack} className="flex items-center text-gray-600 hover:text-gray-900 mb-8">
        <ArrowLeft className="w-5 h-5 mr-2"/> Back to Products
      </button>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        {/* Images */}
        <div className="space-y-4">
          <div className="aspect-square bg-gray-100 rounded-2xl overflow-hidden relative">
            <img src={product.images[selectedImageIndex]} alt={product.name} className="w-full h-full object-cover"/>
            {discountPercent > 0 && <div className="absolute top-4 left-4 bg-red-500 text-white text-sm font-bold px-3 py-1 rounded-full">-{discountPercent}%</div>}
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

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-blue-600">{product.brand}</span>
              <div className="flex items-center space-x-2">
                <button className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-50"><Heart className="w-5 h-5"/></button>
                <button className="p-2 text-gray-400 hover:text-blue-500 rounded-full hover:bg-blue-50"><Share2 className="w-5 h-5"/></button>
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
              <Button onClick={handleAddToCart} disabled={product.stock===0 || isUpdating} icon={ShoppingCart} className="flex-1 relative">
                {isUpdating ? 'Adding...' : `إضافة إلى السلة${cartQuantity>0 ? ` (${cartQuantity})` : ''}`}
              </Button>
              <Button onClick={()=>setShowReservationForm(true)} disabled={product.stock===0} icon={BookmarkPlus} className="flex-1 bg-purple-600 text-white">
                حجز الآن
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {showReservationForm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl w-full max-w-2xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-semibold">Reserve Your Items</h2>
              <button onClick={()=>setShowReservationForm(false)}><X className="w-6 h-6 text-gray-500"/></button>
            </div>
            <form onSubmit={handleReservationSubmit} className="space-y-4">
              <input name="customerName" value={formData.customerName} onChange={handleFormChange} required placeholder="Full Name" className="w-full border p-2 rounded"/>
              <input name="customerPhone" value={formData.customerPhone} onChange={handleFormChange} required placeholder="Phone" className="w-full border p-2 rounded"/>
              <input name="customerWhatsApp" value={formData.customerWhatsApp} onChange={handleFormChange} placeholder="WhatsApp (Optional)" className="w-full border p-2 rounded"/>
              <select name="pickupBranch" value={formData.pickupBranch} onChange={handleFormChange} className="w-full border p-2 rounded">
                {branches.map(b=><option key={b.value} value={b.value}>{b.label}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-4">
                <input type="date" name="proposedDate" value={formData.proposedDate} onChange={handleFormChange} min={new Date().toISOString().split('T')[0]} className="w-full border p-2 rounded" required/>
                <select name="proposedTime" value={formData.proposedTime} onChange={handleFormChange} className="w-full border p-2 rounded" required>
                  <option value="">Select</option>
                  {timeSlots.map(t=><option key={t} value={t}>{t}</option>)}
                </select>
              </div>
              <textarea name="notes" value={formData.notes} onChange={handleFormChange} rows={3} placeholder="Notes (Optional)" className="w-full border p-2 rounded"/>
              <div className="flex gap-4">
                <Button type="button" onClick={()=>setShowReservationForm(false)} className="flex-1">Cancel</Button>
                <Button type="submit" loading={loading} className="flex-1">Submit Reservation</Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCartSidebar && <CartSidebar cartItems={cartItems} onClose={()=>setShowCartSidebar(false)}/>}
    </div>
  );
}
