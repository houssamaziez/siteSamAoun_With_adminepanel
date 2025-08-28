import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, ShoppingCart, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { Product } from "../../types";
import { useCart } from "../../hooks/useCart";
import { createClient } from "@supabase/supabase-js";

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
    customerName: "",
    customerPhone: "",
    customerWhatsApp: "",
    pickupBranch: "main-store",
    proposedDate: "",
    proposedTime: "",
    notes: "",
  });
  const [loading, setLoading] = useState(false);

  // ✅ Toast state
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  // ✅ مرجع للفورم للتحكم بالتمرير
  const reservationFormRef = useRef<HTMLFormElement | null>(null);

  const cartItem = getItem(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(
        ((product.originalPrice - product.price) / product.originalPrice) * 100
      )
    : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id]);

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleAddToCart = () => {
    if (cartItem) {
      updateItem(product.id, { quantity: cartItem.quantity + quantity });
    } else {
      addItem(product, quantity);
    }

    // ✅ Show toast on success
    setToast({ message: "✅ تمت إضافة المنتج إلى السلة بنجاح 🎉", type: "success" });

    const btn = document.querySelector("[data-add-to-cart]") as HTMLElement;
    if (btn) {
      btn.classList.add("animate-pulse");
      setTimeout(() => btn.classList.remove("animate-pulse"), 600);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  useEffect(() => {
    if (showReservationForm) {
      const now = new Date();
      const yyyy = now.getFullYear();
      const mm = String(now.getMonth() + 1).padStart(2, "0");
      const dd = String(now.getDate()).padStart(2, "0");
      const hh = String(now.getHours()).padStart(2, "0");
      const min = String(now.getMinutes()).padStart(2, "0");

      setFormData((prev) => ({
        ...prev,
        proposedDate: `${yyyy}-${mm}-${dd}`,
        proposedTime: `${hh}:${min}`,
      }));

      // ✅ Scroll to form on open
      setTimeout(() => {
        reservationFormRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
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
        total_amount: product.price * quantity,
      };

      const { error } = await supabase
        .from("reservations")
        .insert([reservationData]);
      if (error) throw error;

      // ✅ Toast for success
      setToast({ message: "📩 تم إرسال طلب الحجز بنجاح ✅", type: "success" });

      setShowReservationForm(false);
      setFormData({
        customerName: "",
        customerPhone: "",
        customerWhatsApp: "",
        pickupBranch: "main-store",
        proposedDate: "",
        proposedTime: "",
        notes: "",
      });
    } catch (err) {
      console.error(err);
      // ❌ Toast for error
      setToast({ message: "❌ حدث خطأ أثناء إرسال طلب الحجز", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ Auto-hide toast
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Toast */}
      {toast && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white font-semibold text-lg z-50 transition-all duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* Back button */}
      <div className="flex items-center gap-3 mb-6 animate-fadeIn">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-1" />
          Back
        </Button>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">
          {product.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Product Images */}
        <div className="transition-transform duration-500 ease-in-out">
          <img
            src={product.images[selectedImageIndex]}
            alt={product.name}
            className="rounded-2xl shadow-2xl w-full h-96 object-cover transform hover:scale-105 transition-all duration-500"
          />
          <div className="flex gap-3 mt-5">
            {product.images.map((img, idx) => (
              <img
                key={idx}
                src={img}
                alt={`Image ${idx + 1}`}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-24 h-24 rounded-xl cursor-pointer border-2 transition-all duration-300 hover:scale-110 hover:shadow-lg ${
                  selectedImageIndex === idx
                    ? "border-blue-600"
                    : "border-gray-300"
                }`}
              />
            ))}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6 animate-slideUp">
          <p className="text-gray-600 leading-relaxed text-lg">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-600 drop-shadow-md">
              {product.price} DZD
            </span>
            {product.originalPrice && (
              <span className="line-through text-gray-400 text-lg">
                {product.originalPrice} DZD
              </span>
            )}
            {discountPercent > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm shadow-md animate-bounce">
                -{discountPercent}%
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="flex items-center gap-6">
            <Button onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
            <span className="text-xl font-semibold">{quantity}</span>
            <Button onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-4">
            <Button
              data-add-to-cart
              onClick={handleAddToCart}
              className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              icon={ShoppingCart}
            >
              Add to Cart
            </Button>
            <Button
              variant="secondary"
              onClick={() => setShowReservationForm(true)}
              className="flex-1 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              icon={Calendar}
            >
              Reserve Now
            </Button>
          </div>
        </div>
      </div>

      {/* Reservation Form */}
      {showReservationForm && (
        <form
          ref={reservationFormRef}
          onSubmit={handleReservationSubmit}
          className="mt-10 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 transition-all duration-500 ease-in-out animate-slideUp"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">
            📝 Reservation
          </h2>
          <p className="text-gray-500 mb-6 text-lg">
            Fill the details below to reserve your product.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleFormChange}
              placeholder="Full Name"
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleFormChange}
              placeholder="Phone Number"
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              name="customerWhatsApp"
              value={formData.customerWhatsApp}
              onChange={handleFormChange}
              placeholder="WhatsApp Number (optional)"
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
            <input
              type="date"
              name="proposedDate"
              value={formData.proposedDate}
              onChange={handleFormChange}
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            />
            <input
              type="time"
              name="proposedTime"
              value={formData.proposedTime}
              onChange={handleFormChange}
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            placeholder="Write any additional instructions here..."
            className="p-4 rounded-xl border mt-6 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <Button
            type="submit"
            disabled={loading}
            className="mt-8 w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {loading ? "Submitting Reservation..." : "✅ Confirm Reservation"}
          </Button>
        </form>
      )}
    </div>
  );
}
