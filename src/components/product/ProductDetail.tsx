import React, { useState } from "react";
import { useCart } from "@/hooks/useCart";
import ReservationForm from "@/components/reservation/ReservationForm";
import { Button } from "@/components/ui/button";

interface ProductDetailProps {
  product: any;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const { addItem, updateItem, getItem } = useCart();
  const cartItem = getItem(product.id);
  const [quantity, setQuantity] = useState(1);
  const [isReservationOpen, setIsReservationOpen] = useState(false);

  const handleAddToCart = () => {
    if (cartItem) {
      updateItem(product.id, { quantity: cartItem.quantity + quantity });
    } else {
      addItem(product, quantity);
    }

    // Open reservation modal after adding to cart
    setIsReservationOpen(true);
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      {/* Product Image */}
      <div className="flex flex-col md:flex-row gap-6">
        <div className="flex-1">
          <img
            src={product.image}
            alt={product.name}
            className="w-full rounded-xl shadow-md object-cover"
          />
        </div>

        {/* Product Details */}
        <div className="flex-1">
          <h1 className="text-3xl font-bold text-gray-800">{product.name}</h1>
          <p className="mt-2 text-lg text-gray-600">{product.description}</p>
          <p className="mt-4 text-2xl font-semibold text-blue-600">
            {product.price} DZD
          </p>

          {/* Quantity Selector */}
          <div className="mt-6 flex items-center gap-4">
            <label className="text-gray-700 font-medium">Quantity:</label>
            <div className="flex items-center border rounded-lg">
              <button
                onClick={() =>
                  setQuantity((prev) => (prev > 1 ? prev - 1 : prev))
                }
                className="px-3 py-2 text-xl text-gray-600 hover:text-blue-600"
              >
                -
              </button>
              <span className="px-4 text-lg">{quantity}</span>
              <button
                onClick={() => setQuantity((prev) => prev + 1)}
                className="px-3 py-2 text-xl text-gray-600 hover:text-blue-600"
              >
                +
              </button>
            </div>
          </div>

          {/* Add to Cart Button */}
          <div className="mt-8">
            <Button
              onClick={handleAddToCart}
              className="w-full py-3 text-lg font-semibold rounded-xl shadow-md"
            >
              Add to Cart & Reserve
            </Button>
          </div>
        </div>
      </div>

      {/* Reservation Modal */}
      {isReservationOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-lg relative animate-fadeIn">
            {/* Close Button */}
            <button
              onClick={() => setIsReservationOpen(false)}
              className="absolute top-3 right-3 text-gray-500 hover:text-gray-700 text-2xl"
            >
              ✕
            </button>

            {/* Reservation Form */}
            <h2 className="text-2xl font-bold mb-4 text-center">
              Complete Your Reservation
            </h2>
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
