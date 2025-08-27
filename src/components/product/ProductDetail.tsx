import { useState } from "react";
import { useCart } from "@/hooks/useCart";
import ReservationForm from "@/components/reservation/ReservationForm";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";

export default function ProductDetail({ product }: { product: any }) {
  const { addItem, updateItem, getItem } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const cartItem = getItem(product.id);

  // دالة لإضافة المنتج إلى السلة
  const handleAddToCart = () => {
    if (cartItem) {
      updateItem(product.id, { quantity: cartItem.quantity + quantity });
    } else {
      addItem(product, quantity);
    }
  };

  // دالة عند الضغط على "إضافة إلى الحجوزات"
  const handleReservationClick = () => {
    handleAddToCart();             // يضيف المنتج للسلة
    setIsReservationOpen(true);    // يفتح نافذة الحجز
  };

  return (
    <div className="p-6 max-w-3xl mx-auto">
      {/* عنوان المنتج */}
      <h1 className="text-3xl font-bold mb-4">{product.name}</h1>

      {/* صورة المنتج */}
      <img
        src={product.image}
        alt={product.name}
        className="rounded-xl shadow-lg mb-6 w-full max-h-96 object-cover"
      />

      {/* السعر */}
      <p className="text-xl font-semibold mb-4">${product.price}</p>

      {/* الأزرار */}
      <div className="flex gap-4">
        {/* زر إضافة إلى السلة */}
        <Button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          icon={ShoppingCart}
          size="lg"
          className="flex-1 transition-all duration-300 hover:scale-105"
        >
          {cartItem ? `Update Cart (${cartItem.quantity})` : "Add to Cart"}
        </Button>

        {/* زر إضافة إلى الحجوزات */}
        <Button
          onClick={handleReservationClick}
          disabled={product.stock === 0}
          size="lg"
          className="flex-1 bg-green-600 hover:bg-green-700 text-white transition-all duration-300 hover:scale-105"
        >
          إضافة إلى الحجوزات
        </Button>
      </div>

      {/* نافذة الحجز */}
      {isReservationOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative">
            {/* زر الغلق */}
            <button
              onClick={() => setIsReservationOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-xl"
            >
              ✕
            </button>

            {/* عنوان النافذة */}
            <h2 className="text-2xl font-bold mb-4">Complete Your Reservation</h2>

            {/* استدعاء فورم الحجز */}
            <ReservationForm
              product={product}
              onClose={() => setIsReservationOpen(false)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
