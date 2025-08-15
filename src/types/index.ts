export interface Product {
  id: string;
  sku: string;
  name: string;
  slug: string;
  brand: string;
  price: number;
  originalPrice?: number;
  currency: string;
  images: string[];
  category: ProductCategory;
  shortDescription: string;
  description: string;
  specifications: Record<string, string>;
  stock: number;
  status: 'active' | 'inactive' | 'out_of_stock';
  featured: boolean;
  warranty: string;
  condition: 'new' | 'refurbished';
  createdAt: string;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  icon: string;
  parentId?: string;
  children?: ProductCategory[];
}

export interface CartItem {
  product: Product;
  quantity: number;
  notes?: string;
}

export interface Reservation {
  id: string;
  referenceNumber: string;
  customerName: string;
  customerPhone: string;
  customerWhatsApp?: string;
  pickupBranch: string;
  proposedDate: string;
  proposedTime: string;
  items: CartItem[];
  totalAmount: number;
  notes?: string;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  createdAt: string;
}

export interface Store {
  name: string;
  tagline: string;
  description: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  services: string[];
}

export interface Filters {
  category?: string;
  brand?: string[];
  priceRange?: [number, number];
  condition?: 'new' | 'refurbished' | 'all';
  inStock?: boolean;
  search?: string;
}

export interface SiteSettings {
  id: string;
  siteName: string;
  siteTagline: string;
  siteDescription: string;
  logoUrl?: string;
  address: string;
  phone: string;
  whatsapp: string;
  email: string;
  hours: string;
  createdAt: string;
  updatedAt: string;
}