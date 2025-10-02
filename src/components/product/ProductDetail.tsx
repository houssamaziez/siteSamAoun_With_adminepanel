"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { useCart } from "@/contexts/CartContext";
import { supabase } from "@/lib/supabaseClient";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
}

interface ProductDetailProps {
  product: Product;
  onBack: () => void;
}

export function ProductDetail({ product, onBack }: ProductDetailProps) {
  const { getItem } = useCart();
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
    deliveryPlace: "bureau", // 👈 مكان التسليم (بداية Bureau)
  });
  const [loading, setLoading] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);
  const reservationFormRef = useRef<HTMLFormElement | null>(null);

  const cartItem = getItem(product.id);
  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [product.id]);

  // تحديث البيانات عند التغيير
  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // إرسال طلب الحجز
  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      // ندمج مكان التسليم مع الملاحظات
      const finalNotes = `[Lieu choisi: ${formData.deliveryPlace}]\n${formData.notes}`;

      const reservationData = {
        reference_number: `REF-${Date.now()}`,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_whatsapp: formData.customerWhatsApp,
        pickup_branch: formData.pickupBranch,
        proposed_date: formData.proposedDate,
        proposed_time: formData.proposedTime,
        notes: finalNotes, // ✅ مكان التسليم صار جزء من الملاحظات
        items: [{ product, quantity }],
        total_amount: product.price * quantity,
      };

      const { error } = await supabase.from("reservations").insert([reservationData]);
      if (error) throw error;

      setToast({ message: "📩 تم إرسال طلب الحجز بنجاح ✅", type: "success" });

      // إعادة تهيئة البيانات
      setShowReservationForm(false);
      setFormData({
        customerName: "",
        customerPhone: "",
        customerWhatsApp: "",
        pickupBranch: "main-store",
        proposedDate: "",
        proposedTime: "",
        notes: "",
        deliveryPlace: "bureau",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ حدث خطأ أثناء إرسال طلب الحجز", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ✅ إشعار (توست) */}
      {toast && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white font-semibold text-lg z-50 transition-all duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* صور المنتج */}
      <div className="flex flex-col md:flex-row gap-8">
        <div className="flex-1">
          <Image
            src={product.images[selectedImageIndex]}
            alt={product.name}
            width={600}
            height={400}
            className="rounded-2xl shadow-lg"
          />
          <div className="flex gap-2 mt-4">
            {product.images.map((img, index) => (
              <button
                key={index}
                onClick={() => setSelectedImageIndex(index)}
                className={`border-2 rounded-lg overflow-hidden ${
                  selectedImageIndex === index ? "border-blue-500" : "border-gray-200"
                }`}
              >
                <Image src={img} alt="" width={80} height={60} />
              </button>
            ))}
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
          <p className="mt-4 text-gray-600">{product.description}</p>

          <div className="mt-6 flex items-center gap-4">
            <span className="text-2xl font-bold text-blue-600">{product.price} DA</span>
            {product.originalPrice && (
              <>
                <span className="text-lg text-gray-400 line-through">{product.originalPrice} DA</span>
                <span className="text-sm text-green-600">-{discountPercent}%</span>
              </>
            )}
          </div>

          <div className="mt-8 flex gap-4">
            <Button
              onClick={() => setShowReservationForm(true)}
              className="px-6 py-3 bg-blue-600 text-white rounded-xl shadow hover:bg-blue-700 transition"
            >
              Reserve Now
            </Button>
            <Button variant="outline" onClick={onBack}>
              ← العودة
            </Button>
          </div>
        </div>
      </div>

      {/* ✅ فورم الحجز */}
      {showReservationForm && (
        <form
          ref={reservationFormRef}
          onSubmit={handleReservationSubmit}
          className="mt-10 p-6 bg-white rounded-3xl shadow-2xl border border-gray-100 animate-slideUp"
        >
          <h2 className="text-3xl font-bold mb-4 text-gray-800">📝 الحجز</h2>
          <p className="text-gray-500 mb-6 text-lg">يرجى ملء البيانات أدناه لإتمام عملية الحجز.</p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <input
              type="text"
              name="customerName"
              value={formData.customerName}
              onChange={handleFormChange}
              placeholder="الاسم الكامل"
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleFormChange}
              placeholder="رقم الهاتف"
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
            <input
              type="tel"
              name="customerWhatsApp"
              value={formData.customerWhatsApp}
              onChange={handleFormChange}
              placeholder="الولاية"
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          {/* ✅ اختيار مكان التسليم */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">مكان التسليم</label>
            <select
              name="deliveryPlace"
              value={formData.deliveryPlace}
              onChange={handleFormChange}
              className="p-4 rounded-xl border focus:ring-2 focus:ring-blue-500 outline-none w-full"
            >
              <option value="bureau">📍 Bureau</option>
              <option value="domicile">🏠 À domicile</option>
            </select>
          </div>

          <textarea
            name="notes"
            value={formData.notes}
            onChange={handleFormChange}
            placeholder="اكتب أي ملاحظات إضافية..."
            className="p-4 rounded-xl border mt-6 w-full focus:ring-2 focus:ring-blue-500 outline-none"
          />

          <Button
            type="submit"
            disabled={loading}
            className="mt-8 w-full shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            {loading ? "جاري إرسال طلب الحجز..." : "✅ تأكيد الحجز"}
          </Button>
        </form>
      )}
    </div>
  );
}
