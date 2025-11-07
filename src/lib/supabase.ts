import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

export type UserRole = 'user' | 'seller' | 'admin';

export interface Profile {
  id: string;
  name: string;
  role: UserRole;
  carbon_points: number;
  created_at: string;
}

export interface Product {
  id: string;
  seller_id: string | null;
  name: string;
  description: string;
  price: number;
  carbon_footprint: number;
  eco_rating: number;
  image_url: string;
  category: string;
  stock: number;
  is_eco_friendly: boolean;
  created_at: string;
}

export interface CartItem {
  id: string;
  user_id: string;
  product_id: string;
  quantity: number;
  added_at: string;
  products?: Product;
}

export interface Order {
  id: string;
  user_id: string;
  total_price: number;
  total_carbon: number;
  carbon_points_earned: number;
  status: string;
  created_at: string;
}
