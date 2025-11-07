/*
  # EcoBazaar Database Schema
  
  ## Overview
  Complete schema for EcoBazaar carbon footprint e-commerce platform
  
  ## New Tables
  
  ### `profiles`
  - `id` (uuid, references auth.users) - User profile ID
  - `name` (text) - User's display name
  - `role` (text) - User role: 'user', 'seller', or 'admin'
  - `carbon_points` (integer) - Accumulated carbon reward points
  - `created_at` (timestamptz) - Profile creation timestamp
  
  ### `products`
  - `id` (uuid, primary key) - Product ID
  - `seller_id` (uuid, references profiles) - Product seller
  - `name` (text) - Product name
  - `description` (text) - Product description
  - `price` (numeric) - Product price
  - `carbon_footprint` (numeric) - Carbon emissions in kg CO₂
  - `eco_rating` (integer) - Eco-friendliness rating (1-5)
  - `image_url` (text) - Product image URL
  - `category` (text) - Product category
  - `stock` (integer) - Available stock quantity
  - `is_eco_friendly` (boolean) - Eco-friendly flag
  - `created_at` (timestamptz) - Product creation timestamp
  
  ### `cart_items`
  - `id` (uuid, primary key) - Cart item ID
  - `user_id` (uuid, references profiles) - Cart owner
  - `product_id` (uuid, references products) - Product in cart
  - `quantity` (integer) - Quantity of product
  - `added_at` (timestamptz) - When item was added
  
  ### `orders`
  - `id` (uuid, primary key) - Order ID
  - `user_id` (uuid, references profiles) - Order owner
  - `total_price` (numeric) - Total order price
  - `total_carbon` (numeric) - Total carbon impact
  - `carbon_points_earned` (integer) - Points earned from order
  - `status` (text) - Order status
  - `created_at` (timestamptz) - Order creation timestamp
  
  ### `order_items`
  - `id` (uuid, primary key) - Order item ID
  - `order_id` (uuid, references orders) - Parent order
  - `product_id` (uuid, references products) - Ordered product
  - `quantity` (integer) - Quantity ordered
  - `price` (numeric) - Price at time of order
  - `carbon_footprint` (numeric) - Carbon footprint at time of order
  
  ## Security
  - RLS enabled on all tables
  - Users can manage their own data
  - Sellers can manage their products
  - Admins have full access
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  name text NOT NULL,
  role text NOT NULL DEFAULT 'user' CHECK (role IN ('user', 'seller', 'admin')),
  carbon_points integer DEFAULT 0,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  TO authenticated
  USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = id);

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create products table
CREATE TABLE IF NOT EXISTS products (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  seller_id uuid REFERENCES profiles(id) ON DELETE CASCADE,
  name text NOT NULL,
  description text NOT NULL,
  price numeric NOT NULL CHECK (price >= 0),
  carbon_footprint numeric NOT NULL CHECK (carbon_footprint >= 0),
  eco_rating integer DEFAULT 3 CHECK (eco_rating BETWEEN 1 AND 5),
  image_url text NOT NULL,
  category text NOT NULL,
  stock integer DEFAULT 0 CHECK (stock >= 0),
  is_eco_friendly boolean DEFAULT false,
  created_at timestamptz DEFAULT now()
);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Anyone can view products"
  ON products FOR SELECT
  TO authenticated, anon
  USING (true);

CREATE POLICY "Sellers can insert their products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    auth.uid() = seller_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

CREATE POLICY "Sellers can update their products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    auth.uid() = seller_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  )
  WITH CHECK (auth.uid() = seller_id);

CREATE POLICY "Sellers can delete their products"
  ON products FOR DELETE
  TO authenticated
  USING (
    auth.uid() = seller_id AND
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role IN ('seller', 'admin')
    )
  );

CREATE POLICY "Admins can manage all products"
  ON products FOR ALL
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create cart_items table
CREATE TABLE IF NOT EXISTS cart_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE CASCADE NOT NULL,
  quantity integer DEFAULT 1 CHECK (quantity > 0),
  added_at timestamptz DEFAULT now(),
  UNIQUE(user_id, product_id)
);

ALTER TABLE cart_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own cart"
  ON cart_items FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert to own cart"
  ON cart_items FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own cart"
  ON cart_items FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete from own cart"
  ON cart_items FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create orders table
CREATE TABLE IF NOT EXISTS orders (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  total_price numeric NOT NULL CHECK (total_price >= 0),
  total_carbon numeric NOT NULL CHECK (total_carbon >= 0),
  carbon_points_earned integer DEFAULT 0,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'processing', 'completed', 'cancelled')),
  created_at timestamptz DEFAULT now()
);

ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own orders"
  ON orders FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Create order_items table
CREATE TABLE IF NOT EXISTS order_items (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  order_id uuid REFERENCES orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  price numeric NOT NULL CHECK (price >= 0),
  carbon_footprint numeric NOT NULL CHECK (carbon_footprint >= 0)
);

ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM orders
      WHERE orders.id = order_items.order_id
      AND orders.user_id = auth.uid()
    )
  );

CREATE POLICY "Admins can view all order items"
  ON order_items FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles
      WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Insert sample products
INSERT INTO products (name, description, price, carbon_footprint, eco_rating, image_url, category, stock, is_eco_friendly) VALUES
('Bamboo Toothbrush Set', 'Biodegradable bamboo toothbrushes, pack of 4', 12.99, 0.5, 5, 'https://images.pexels.com/photos/4465124/pexels-photo-4465124.jpeg?auto=compress&cs=tinysrgb&w=800', 'Personal Care', 150, true),
('Reusable Shopping Bags', 'Organic cotton shopping bags, set of 5', 19.99, 1.2, 5, 'https://images.pexels.com/photos/6046232/pexels-photo-6046232.jpeg?auto=compress&cs=tinysrgb&w=800', 'Home & Living', 200, true),
('Solar Power Bank', '20000mAh solar charging portable battery', 45.99, 8.5, 4, 'https://images.pexels.com/photos/221047/pexels-photo-221047.jpeg?auto=compress&cs=tinysrgb&w=800', 'Electronics', 80, true),
('Organic Cotton T-Shirt', '100% organic cotton, fair trade certified', 24.99, 3.2, 5, 'https://images.pexels.com/photos/8532616/pexels-photo-8532616.jpeg?auto=compress&cs=tinysrgb&w=800', 'Fashion', 120, true),
('Stainless Steel Water Bottle', 'Insulated, BPA-free, 32oz capacity', 29.99, 2.8, 4, 'https://images.pexels.com/photos/4021262/pexels-photo-4021262.jpeg?auto=compress&cs=tinysrgb&w=800', 'Home & Living', 180, true),
('Beeswax Food Wraps', 'Reusable alternative to plastic wrap, set of 3', 16.99, 0.8, 5, 'https://images.pexels.com/photos/6046231/pexels-photo-6046231.jpeg?auto=compress&cs=tinysrgb&w=800', 'Kitchen', 100, true),
('LED Smart Bulbs', 'Energy-efficient smart LED bulbs, pack of 4', 39.99, 4.5, 4, 'https://images.pexels.com/photos/1112598/pexels-photo-1112598.jpeg?auto=compress&cs=tinysrgb&w=800', 'Home & Living', 150, true),
('Recycled Paper Notebooks', 'Made from 100% recycled paper, set of 3', 14.99, 1.5, 5, 'https://images.pexels.com/photos/1925099/pexels-photo-1925099.jpeg?auto=compress&cs=tinysrgb&w=800', 'Office', 220, true),
('Compost Bin', 'Indoor kitchen compost bin with charcoal filter', 34.99, 5.2, 4, 'https://images.pexels.com/photos/6419121/pexels-photo-6419121.jpeg?auto=compress&cs=tinysrgb&w=800', 'Home & Living', 90, true),
('Hemp Backpack', 'Durable hemp fiber backpack, water-resistant', 54.99, 6.5, 4, 'https://images.pexels.com/photos/2905238/pexels-photo-2905238.jpeg?auto=compress&cs=tinysrgb&w=800', 'Fashion', 70, true),
('Natural Soap Bar Set', 'Handmade organic soaps, 6 bars', 22.99, 1.1, 5, 'https://images.pexels.com/photos/4465831/pexels-photo-4465831.jpeg?auto=compress&cs=tinysrgb&w=800', 'Personal Care', 180, true),
('Bamboo Cutlery Set', 'Travel-friendly bamboo utensils with case', 11.99, 0.6, 5, 'https://images.pexels.com/photos/4110251/pexels-photo-4110251.jpeg?auto=compress&cs=tinysrgb&w=800', 'Kitchen', 200, true);
