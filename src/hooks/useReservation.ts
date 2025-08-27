import { useState } from 'react';
import { Product } from '../types';

export function useReservation() {
  const [reservations, setReservations] = useState<{ product: Product; quantity: number }[]>([]);

  const addReservation = (product: Product, quantity: number) => {
    setReservations((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + quantity }
            : item
        );
      }
      return [...prev, { product, quantity }];
    });
  };

  const removeReservation = (productId: string) => {
    setReservations((prev) => prev.filter((item) => item.product.id !== productId));
  };

  const updateReservation = (productId: string, quantity: number) => {
    setReservations((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );
  };

  const getReservationItem = (productId: string) => {
    return reservations.find((item) => item.product.id === productId);
  };

  const getReservationCount = () => {
    return reservations.reduce((sum, item) => sum + item.quantity, 0);
  };

  return {
    reservations,
    addReservation,
    removeReservation,
    updateReservation,
    getReservationItem,
    getReservationCount,
  };
}
