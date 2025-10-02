import React, { useState, useEffect, useRef } from "react";
import { ArrowLeft, Calendar } from "lucide-react";
import { Button } from "../ui/Button";
import { Product } from "../../types";
import { useCart } from "../../hooks/useCart";
import { createClient } from "@supabase/supabase-js";

// ✅ إعداد Supabase
const supabaseUrl = import.meta.env.VITE_SUPABASE_URL!;
const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY!;
const supabase = createClient(supabaseUrl, supabaseKey);

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
    deliveryPlace: "bureau", // ✅ مكان التسليم
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

  const handleQuantityChange = (newQty: number) => {
    if (newQty >= 1 && newQty <= product.stock) {
      setQuantity(newQty);
    }
  };

  const handleFormChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  // ✅ ملء التاريخ والوقت تلقائياً عند فتح الفورم
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

      setTimeout(() => {
        reservationFormRef.current?.scrollIntoView({ behavior: "smooth" });
      }, 300);
    }
  }, [showReservationForm]);

  // ✅ إرسال الحجز
  const handleReservationSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const finalNotes = `[Lieu choisi: ${formData.deliveryPlace}]\n${formData.notes}`;

      const reservationData = {
        reference_number: `REF-${Date.now()}`,
        customer_name: formData.customerName,
        customer_phone: formData.customerPhone,
        customer_whatsapp: formData.customerWhatsApp,
        pickup_branch: formData.pickupBranch,
        proposed_date: formData.proposedDate,
        proposed_time: formData.proposedTime,
        notes: finalNotes, // ✅ إدماج مكان التسليم
        items: [{ product, quantity }],
        total_amount: product.price * quantity,
      };

      const { error } = await supabase.from("reservations").insert([reservationData]);
      if (error) throw error;

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
        deliveryPlace: "bureau",
      });
    } catch (err) {
      console.error(err);
      setToast({ message: "❌ حدث خطأ أثناء إرسال طلب الحجز", type: "error" });
    } finally {
      setLoading(false);
    }
  };

  // ✅ إخفاء التوست تلقائياً
  useEffect(() => {
    if (toast) {
      const timer = setTimeout(() => setToast(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [toast]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* ✅ توست */}
      {toast && (
        <div
          className={`fixed top-10 left-1/2 transform -translate-x-1/2 px-6 py-3 rounded-xl shadow-xl text-white font-semibold text-lg z-50 transition-all duration-300 ${
            toast.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {toast.message}
        </div>
      )}

      {/* زر الرجوع */}
      <div className="flex items-center gap-3 mb-6 animate-fadeIn">
        <Button variant="ghost" size="sm" onClick={onBack}>
          <ArrowLeft className="w-5 h-5 mr-1" />
          رجوع
        </Button>
        <h1 className="text-3xl font-extrabold text-gray-900 tracking-tight">{product.name}</h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* صور المنتج */}
        <div>
          {/* ✅ الصورة الكبيرة - تظهر كاملة */}
          <div className="w-full h-[600px] bg-white flex items-center justify-center rounded-2xl shadow-2xl overflow-hidden">
  <img
    src={product.images[selectedImageIndex]}
    alt={product.name}
    className="w-full h-full object-cover"
  />
</div>


          {/* ✅ الصور الصغيرة */}
          <div className="flex gap-3 mt-5">
            {product.images.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setSelectedImageIndex(idx)}
                className={`w-24 h-24 rounded-xl cursor-pointer border-2 flex items-center justify-center bg-white transition-all duration-300 ${
                  selectedImageIndex === idx ? "border-blue-600" : "border-gray-300"
                }`}
              >
                <img
                  src={img}
                  alt={`صورة ${idx + 1}`}
                  className="max-w-full max-h-full object-contain"
                />
              </div>
            ))}
          </div>
        </div>

        {/* تفاصيل المنتج */}
        <div className="space-y-6 animate-slideUp">
          <p className="text-gray-600 leading-relaxed text-lg whitespace-pre-line">
            {product.description}
          </p>

          <div className="flex items-center gap-3">
            <span className="text-3xl font-bold text-green-600">{product.price} دج</span>
            {product.originalPrice && (
              <span className="line-through text-gray-400 text-lg">{product.originalPrice} دج</span>
            )}
            {discountPercent > 0 && (
              <span className="bg-red-500 text-white px-3 py-1 rounded-lg text-sm">-{discountPercent}%</span>
            )}
          </div>

          {/* الكمية */}
          <div className="flex items-center gap-6">
            <Button onClick={() => handleQuantityChange(quantity - 1)}>-</Button>
            <span className="text-xl font-semibold">{quantity}</span>
            <Button onClick={() => handleQuantityChange(quantity + 1)}>+</Button>
          </div>

          {/* زر الحجز */}
          <div className="flex gap-4">
            <Button
              variant="secondary"
              onClick={() => setShowReservationForm(true)}
              className="flex-1 shadow-lg"
              icon={Calendar}
            >
              حجز الآن
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
              className="p-4 rounded-xl border"
              required
            />
            <input
              type="tel"
              name="customerPhone"
              value={formData.customerPhone}
              onChange={handleFormChange}
              placeholder="رقم الهاتف"
              className="p-4 rounded-xl border"
              required
            />
            <input
              type="text"
              name="customerWhatsApp"
              value={formData.customerWhatsApp}
              onChange={handleFormChange}
              placeholder="الولاية"
              className="p-4 rounded-xl border"
            />
          </div>

          {/* ✅ اختيار مكان التسليم */}
          <div className="mt-6">
            <label className="block text-gray-700 font-medium mb-2">مكان التسليم</label>
            <select
              name="deliveryPlace"
              value={formData.deliveryPlace}
              onChange={handleFormChange}
              className="p-4 rounded-xl border w-full"
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
            className="p-4 rounded-xl border mt-6 w-full"
          />

          <Button type="submit" disabled={loading} className="mt-8 w-full">
            {loading ? "جاري إرسال طلب الحجز..." : "✅ تأكيد الحجز"}
          </Button>
        </form>
      )}
    </div>
  );
}
