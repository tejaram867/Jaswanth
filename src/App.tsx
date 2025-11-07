import { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { supabase, Product, CartItem } from './lib/supabase';
import { Navbar } from './components/Layout/Navbar';
import { Footer } from './components/Layout/Footer';
import { AuthModal } from './components/Auth/AuthModal';
import { RoleSelector } from './components/Auth/RoleSelector';
import { Hero } from './components/Home/Hero';
import { ProductGrid } from './components/Products/ProductGrid';
import { ShoppingCart } from './components/Cart/ShoppingCart';
import { CheckoutModal } from './components/Checkout/CheckoutModal';
import { SellerDashboard } from './components/Seller/SellerDashboard';
import { AdminPanel } from './components/Admin/AdminPanel';
import { EcoRecommendation } from './components/Recommendations/EcoRecommendation';
import { About } from './components/Pages/About';
import { Contact } from './components/Pages/Contact';
import { Profile } from './components/Pages/Profile';
import { Orders } from './components/Pages/Orders';

function AppContent() {
  const { user, profile, loading } = useAuth();
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [showRoleSelector, setShowRoleSelector] = useState(false);
  const [showCart, setShowCart] = useState(false);
  const [showCheckout, setShowCheckout] = useState(false);
  const [currentView, setCurrentView] = useState<string>('home');
  const [products, setProducts] = useState<Product[]>([]);
  const [cartItems, setCartItems] = useState<(CartItem & { products?: Product })[]>([]);
  const [recommendation, setRecommendation] = useState<{
    product: Product;
    alternatives: Product[];
  } | null>(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  useEffect(() => {
    if (user) {
      fetchCart();
    } else {
      setCartItems([]);
    }
  }, [user]);

  useEffect(() => {
    if (user && profile && profile.role === 'user') {
      setShowRoleSelector(false);
    } else if (user && profile && profile.role !== 'user') {
      setShowRoleSelector(false);
    }
  }, [user, profile]);

  const fetchProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (!error && data) {
      setProducts(data);
    }
  };

  const fetchCart = async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('cart_items')
      .select('*, products(*)')
      .eq('user_id', user.id);

    if (!error && data) {
      setCartItems(data);
    }
  };

  const handleAddToCart = async (product: Product) => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }

    if (!product.is_eco_friendly && product.carbon_footprint > 3) {
      const alternatives = products.filter(
        (p) =>
          p.id !== product.id &&
          p.category === product.category &&
          p.carbon_footprint < product.carbon_footprint &&
          p.is_eco_friendly
      ).slice(0, 2);

      if (alternatives.length > 0) {
        setRecommendation({ product, alternatives });
        return;
      }
    }

    await addToCartDirect(product);
  };

  const addToCartDirect = async (product: Product) => {
    if (!user) return;

    const existingItem = cartItems.find((item) => item.product_id === product.id);

    if (existingItem) {
      await supabase
        .from('cart_items')
        .update({ quantity: existingItem.quantity + 1 })
        .eq('id', existingItem.id);
    } else {
      await supabase.from('cart_items').insert([
        {
          user_id: user.id,
          product_id: product.id,
          quantity: 1,
        },
      ]);
    }

    fetchCart();
  };

  const handleUpdateQuantity = async (itemId: string, newQuantity: number) => {
    await supabase
      .from('cart_items')
      .update({ quantity: newQuantity })
      .eq('id', itemId);
    fetchCart();
  };

  const handleRemoveItem = async (itemId: string) => {
    await supabase.from('cart_items').delete().eq('id', itemId);
    fetchCart();
  };

  const handleCheckout = () => {
    if (!user) {
      setShowAuthModal(true);
      return;
    }
    setShowCart(false);
    setShowCheckout(true);
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    const totalPrice = cartItems.reduce(
      (sum, item) => sum + (item.products?.price || 0) * item.quantity,
      0
    );

    const totalCarbon = cartItems.reduce(
      (sum, item) => sum + (item.products?.carbon_footprint || 0) * item.quantity,
      0
    );

    const ecoPoints = Math.floor(
      cartItems.reduce((sum, item) => {
        if (item.products?.is_eco_friendly) {
          return sum + item.quantity * 10;
        }
        return sum;
      }, 0)
    );

    const { data: orderData, error: orderError } = await supabase
      .from('orders')
      .insert([
        {
          user_id: user.id,
          total_price: totalPrice,
          total_carbon: totalCarbon,
          carbon_points_earned: ecoPoints,
          status: 'completed',
        },
      ])
      .select()
      .single();

    if (orderError) throw orderError;

    const orderItems = cartItems.map((item) => ({
      order_id: orderData.id,
      product_id: item.product_id,
      quantity: item.quantity,
      price: item.products?.price || 0,
      carbon_footprint: item.products?.carbon_footprint || 0,
    }));

    await supabase.from('order_items').insert(orderItems);

    await supabase
      .from('profiles')
      .update({ carbon_points: (profile?.carbon_points || 0) + ecoPoints })
      .eq('id', user.id);

    for (const item of cartItems) {
      if (item.products) {
        await supabase
          .from('products')
          .update({ stock: item.products.stock - item.quantity })
          .eq('id', item.product_id);
      }
    }

    await supabase.from('cart_items').delete().eq('user_id', user.id);

    fetchCart();
    fetchProducts();
  };

  const handleNavigate = (view: string) => {
    setCurrentView(view);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600 text-lg">Loading EcoBazaar...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar
        onAuthClick={() => setShowAuthModal(true)}
        onCartClick={() => setShowCart(true)}
        cartItemsCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
        currentView={currentView}
        onNavigate={handleNavigate}
      />

      {currentView === 'home' && (
        <>
          <Hero onShopClick={() => setCurrentView('products')} />
          <div className="py-12">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-3xl font-bold text-gray-800 mb-8">Featured Products</h2>
            </div>
            <ProductGrid
              products={products.slice(0, 8)}
              onAddToCart={handleAddToCart}
              showAddToCart={!!user}
            />
          </div>
        </>
      )}

      {currentView === 'products' && (
        <ProductGrid
          products={products}
          onAddToCart={handleAddToCart}
          showAddToCart={!!user}
        />
      )}

      {currentView === 'about' && <About />}
      {currentView === 'contact' && <Contact />}
      {currentView === 'profile' && user && <Profile />}
      {currentView === 'orders' && user && <Orders />}
      {currentView === 'seller' && profile?.role === 'seller' && <SellerDashboard />}
      {currentView === 'admin' && profile?.role === 'admin' && <AdminPanel />}

      <Footer />

      <AuthModal
        isOpen={showAuthModal}
        onClose={() => setShowAuthModal(false)}
      />

      {user && profile && !profile.role && (
        <RoleSelector onRoleSelected={() => setShowRoleSelector(false)} />
      )}

      <ShoppingCart
        isOpen={showCart}
        onClose={() => setShowCart(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
        onCheckout={handleCheckout}
      />

      <CheckoutModal
        isOpen={showCheckout}
        onClose={() => setShowCheckout(false)}
        cartItems={cartItems}
        onPlaceOrder={handlePlaceOrder}
        requireAuth={!user ? () => setShowAuthModal(true) : undefined}
      />

      {recommendation && (
        <EcoRecommendation
          product={recommendation.product}
          alternatives={recommendation.alternatives}
          onClose={() => setRecommendation(null)}
          onSelectAlternative={(alt) => {
            addToCartDirect(alt);
            setRecommendation(null);
          }}
        />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
