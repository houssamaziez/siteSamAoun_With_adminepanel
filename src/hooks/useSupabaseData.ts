import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Product, ProductCategory, Reservation } from '../types';

export function useProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const { data, error } = await supabase
        .from('products')
        .select(`
          *,
          category:categories(*)
        `)
        .eq('status', 'active')
        .order('created_at', { ascending: false });

      if (error) throw error;

      // Handle case where no products exist
      if (!data || data.length === 0) {
        setProducts([]);
        setError(null);
        return;
      }

      const formattedProducts: Product[] = data.map(item => ({
        id: item.id,
        sku: item.sku,
        name: item.name,
        slug: item.slug,
        brand: item.brand,
        price: item.price,
        originalPrice: item.original_price,
        currency: item.currency,
        images: item.images,
        category: item.category ? {
          id: item.category.id,
          name: item.category.name,
          slug: item.category.slug,
          description: item.category.description || '',
          image: item.category.image || '',
          icon: item.category.icon || '',
          parentId: item.category.parent_id
        } : {
          id: 'unknown',
          name: 'Unknown Category',
          slug: 'unknown',
          description: '',
          image: '',
          icon: 'Package'
        },
        shortDescription: item.short_description || '',
        description: item.description || '',
        specifications: item.specifications,
        stock: item.stock,
        status: item.status,
        featured: item.featured,
        warranty: item.warranty || '',
        condition: item.condition,
        createdAt: item.created_at
      }));

      setProducts(formattedProducts);
    } catch (err) {
      console.error('Products fetch error:', err);
      setError(err instanceof Error ? err.message : 'Failed to fetch products');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  return { products, loading, error, refetch: fetchProducts };
}

export function useCategories() {
  const [categories, setCategories] = useState<ProductCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .order('name');

      if (error) throw error;

      const formattedCategories: ProductCategory[] = data.map(item => ({
        id: item.id,
        name: item.name,
        slug: item.slug,
        description: item.description || '',
        image: item.image || '',
        icon: item.icon || '',
        parentId: item.parent_id
      }));

      setCategories(formattedCategories);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch categories');
    } finally {
      setLoading(false);
    }
  };

  return { categories, loading, error, refetch: fetchCategories };
}

export function useReservations() {
  const [reservations, setReservations] = useState<Reservation[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('reservations')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      const formattedReservations: Reservation[] = data.map(item => ({
        id: item.id,
        referenceNumber: item.reference_number,
        customerName: item.customer_name,
        customerPhone: item.customer_phone,
        customerWhatsApp: item.customer_whatsapp,
        pickupBranch: item.pickup_branch,
        proposedDate: item.proposed_date,
        proposedTime: item.proposed_time,
        items: item.items,
        totalAmount: item.total_amount,
        notes: item.notes,
        status: item.status,
        createdAt: item.created_at
      }));

      setReservations(formattedReservations);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch reservations');
    } finally {
      setLoading(false);
    }
  };

  const updateReservationStatus = async (id: string, status: Reservation['status']) => {
    try {
      const { error } = await supabase
        .from('reservations')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      
      await fetchReservations(); // Refresh the list
      return { success: true };
    } catch (err) {
      return { 
        success: false, 
        error: err instanceof Error ? err.message : 'Failed to update reservation' 
      };
    }
  };

  return { reservations, loading, error, refetch: fetchReservations, updateReservationStatus };
}

export async function createReservation(reservation: Omit<Reservation, 'id' | 'createdAt' | 'status'>) {
  try {
    const { data, error } = await supabase
      .from('reservations')
      .insert({
        reference_number: reservation.referenceNumber,
        customer_name: reservation.customerName,
        customer_phone: reservation.customerPhone,
        customer_whatsapp: reservation.customerWhatsApp,
        pickup_branch: reservation.pickupBranch,
        proposed_date: reservation.proposedDate,
        proposed_time: reservation.proposedTime,
        items: reservation.items,
        total_amount: reservation.totalAmount,
        notes: reservation.notes,
        status: 'pending'
      })
      .select()
      .single();

    if (error) throw error;
    
    return { success: true, data };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Failed to create reservation' 
    };
  }
}