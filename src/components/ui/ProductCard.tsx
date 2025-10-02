import React, { useState } from "react";
import { Product } from "../../types";
import { Button } from "./Button";
import { Eye, Heart, Star, Calendar } from "lucide-react";
import { useCart } from "../../hooks/useCart";
import { ReserveDialog } from "./ReserveDialog"; // 👈 استدعاء الديالوغ

interface ProductCardProps {
  product: Product;
  onViewDetails?: () => void;
}

export function ProductCard({ product, onViewDetails }: ProductCardProps) {
  const { getItem, isUpdating } = useCart();
  const cartItem = getItem(product.id);
  const [isReserveOpen, setReserveOpen] = useState(false); // 👈 state للديالوغ

  const discountPercent = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <>
      <div
        className="group bg-white rounded-xl shadow-soft hover:shadow-strong card-hover cursor-pointer overflow-hidden border border-gray-100 animate-fade-in-up"
        onClick={onViewDetails}
      >
        {/* باقي الكود مثلما عندك ... */}

        {/* الأزرار */}
        <div className="flex gap-2 items-center">
          <Button
            variant="primary"
            size="sm"
            icon={Calendar}
            onClick={(e) => {
              e.stopPropagation();
              setReserveOpen(true); // 👈 يفتح ديالوغ الحجز
            }}
            disabled={product.stock === 0 || isUpdating}
            loading={isUpdating}
            className="flex-1 text-sm font-semibold hover-lift btn-primary shadow-medium"
          >
            {isUpdating ? "...جاري الحجز" : cartItem ? `محجوز (${cartItem.quantity})` : "Reserve Now"}
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={(e) => {
              e.stopPropagation();
              onViewDetails?.();
            }}
            className="px-4 hover-lift hover-glow"
          >
            <Eye className="w-4 h-4" />
          </Button>
        </div>
      </div>

      {/* نفس ديالوغ الحجز */}
      <ReserveDialog
        isOpen={isReserveOpen}
        onClose={() => setReserveOpen(false)}
        productName={product.name}
      />
    </>
  );
}
