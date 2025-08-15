export interface Database {
  public: {
    Tables: {
      categories: {
        Row: {
          id: string;
          name: string;
          slug: string;
          description: string | null;
          image: string | null;
          icon: string | null;
          parent_id: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          slug: string;
          description?: string | null;
          image?: string | null;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          slug?: string;
          description?: string | null;
          image?: string | null;
          icon?: string | null;
          parent_id?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
      products: {
        Row: {
          id: string;
          sku: string;
          name: string;
          slug: string;
          brand: string;
          price: number;
          original_price: number | null;
          currency: string;
          images: string[];
          category_id: string;
          short_description: string | null;
          description: string | null;
          specifications: Record<string, any>;
          stock: number;
          status: 'active' | 'inactive' | 'out_of_stock';
          featured: boolean;
          warranty: string | null;
          condition: 'new' | 'refurbished';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          sku: string;
          name: string;
          slug: string;
          brand: string;
          price: number;
          original_price?: number | null;
          currency?: string;
          images?: string[];
          category_id: string;
          short_description?: string | null;
          description?: string | null;
          specifications?: Record<string, any>;
          stock?: number;
          status?: 'active' | 'inactive' | 'out_of_stock';
          featured?: boolean;
          warranty?: string | null;
          condition?: 'new' | 'refurbished';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          sku?: string;
          name?: string;
          slug?: string;
          brand?: string;
          price?: number;
          original_price?: number | null;
          currency?: string;
          images?: string[];
          category_id?: string;
          short_description?: string | null;
          description?: string | null;
          specifications?: Record<string, any>;
          stock?: number;
          status?: 'active' | 'inactive' | 'out_of_stock';
          featured?: boolean;
          warranty?: string | null;
          condition?: 'new' | 'refurbished';
          created_at?: string;
          updated_at?: string;
        };
      };
      reservations: {
        Row: {
          id: string;
          reference_number: string;
          customer_name: string;
          customer_phone: string;
          customer_whatsapp: string | null;
          pickup_branch: string;
          proposed_date: string;
          proposed_time: string;
          items: any[];
          total_amount: number;
          notes: string | null;
          status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          reference_number: string;
          customer_name: string;
          customer_phone: string;
          customer_whatsapp?: string | null;
          pickup_branch: string;
          proposed_date: string;
          proposed_time: string;
          items: any[];
          total_amount: number;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          reference_number?: string;
          customer_name?: string;
          customer_phone?: string;
          customer_whatsapp?: string | null;
          pickup_branch?: string;
          proposed_date?: string;
          proposed_time?: string;
          items?: any[];
          total_amount?: number;
          notes?: string | null;
          status?: 'pending' | 'confirmed' | 'completed' | 'cancelled';
          created_at?: string;
          updated_at?: string;
        };
      };
      admins: {
        Row: {
          id: string;
          email: string;
          name: string;
          role: 'admin' | 'manager' | 'staff';
          created_at: string;
        };
        Insert: {
          id?: string;
          email: string;
          name: string;
          role?: 'admin' | 'manager' | 'staff';
          created_at?: string;
        };
        Update: {
          id?: string;
          email?: string;
          name?: string;
          role?: 'admin' | 'manager' | 'staff';
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          site_name: string;
          site_tagline: string;
          site_description: string;
          logo_url: string | null;
          address: string;
          phone: string;
          whatsapp: string;
          email: string;
          hours: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          site_name?: string;
          site_tagline?: string;
          site_description?: string;
          logo_url?: string | null;
          address?: string;
          phone?: string;
          whatsapp?: string;
          email?: string;
          hours?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          site_name?: string;
          site_tagline?: string;
          site_description?: string;
          logo_url?: string | null;
          address?: string;
          phone?: string;
          whatsapp?: string;
          email?: string;
          hours?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
}