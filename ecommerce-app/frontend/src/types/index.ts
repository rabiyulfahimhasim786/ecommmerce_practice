export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  stock_quantity: number;
  image_url: string;
  category_id: number;
  is_active: boolean;
  created_at: string;
}

export interface User {
  id: number;
  email: string;
  full_name: string;
  is_active: boolean;
  created_at: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  token: string | null;
}