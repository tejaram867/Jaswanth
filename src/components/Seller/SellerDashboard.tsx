import { useState, useEffect } from 'react';
import { Plus, Package, TrendingUp } from 'lucide-react';
import { supabase, Product } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';
import { ProductCard } from '../Products/ProductCard';
import { AddProductModal } from './AddProductModal';

export const SellerDashboard = () => {
  const { user } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    fetchSellerProducts();
  }, [user]);

  const fetchSellerProducts = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching products:', error);
    } else {
      setProducts(data || []);
    }
    setLoading(false);
  };

  const totalRevenue = products.reduce((sum, p) => sum + (p.price * (200 - p.stock)), 0);
  const totalProducts = products.length;
  const totalCarbon = products.reduce((sum, p) => sum + p.carbon_footprint, 0);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Seller Dashboard</h1>
        <p className="text-gray-600">Manage your eco-friendly products</p>
      </div>

      <div className="grid md:grid-cols-3 gap-6 mb-8">
        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <Package size={32} />
            <TrendingUp size={24} />
          </div>
          <p className="text-green-100 text-sm mb-1">Total Products</p>
          <p className="text-4xl font-bold">{totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">💰</span>
            <TrendingUp size={24} />
          </div>
          <p className="text-blue-100 text-sm mb-1">Est. Revenue</p>
          <p className="text-4xl font-bold">${totalRevenue.toFixed(0)}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">🌱</span>
            <TrendingUp size={24} />
          </div>
          <p className="text-amber-100 text-sm mb-1">Avg. Carbon/Product</p>
          <p className="text-4xl font-bold">{(totalCarbon / Math.max(totalProducts, 1)).toFixed(1)} kg</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Your Products</h2>
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center"
          >
            <Plus size={20} className="mr-2" />
            Add Product
          </button>
        </div>

        {loading ? (
          <div className="text-center py-12">
            <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
            <p className="text-gray-600 mt-4">Loading products...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-12">
            <Package size={64} className="text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">No products yet</h3>
            <p className="text-gray-600 mb-6">Start adding your eco-friendly products!</p>
            <button
              onClick={() => setShowAddModal(true)}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all"
            >
              Add Your First Product
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard key={product.id} product={product} showAddToCart={false} />
            ))}
          </div>
        )}
      </div>

      <AddProductModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onProductAdded={fetchSellerProducts}
      />
    </div>
  );
};
