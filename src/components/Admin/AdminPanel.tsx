import { useState, useEffect } from 'react';
import { Users, Package, ShoppingBag, TrendingDown, BarChart3 } from 'lucide-react';
import { supabase, Profile, Product, Order } from '../../lib/supabase';

export const AdminPanel = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalCarbon: 0,
    totalRevenue: 0,
  });
  const [users, setUsers] = useState<Profile[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'products' | 'orders'>('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchAdminData();
  }, []);

  const fetchAdminData = async () => {
    setLoading(true);

    const [usersRes, productsRes, ordersRes] = await Promise.all([
      supabase.from('profiles').select('*'),
      supabase.from('products').select('*'),
      supabase.from('orders').select('*'),
    ]);

    const usersData = usersRes.data || [];
    const productsData = productsRes.data || [];
    const ordersData = ordersRes.data || [];

    setUsers(usersData);
    setProducts(productsData);
    setOrders(ordersData);

    const totalCarbon = productsData.reduce((sum, p) => sum + p.carbon_footprint, 0);
    const totalRevenue = ordersData.reduce((sum, o) => sum + o.total_price, 0);

    setStats({
      totalUsers: usersData.length,
      totalProducts: productsData.length,
      totalOrders: ordersData.length,
      totalCarbon,
      totalRevenue,
    });

    setLoading(false);
  };

  const categoryStats = products.reduce((acc, product) => {
    acc[product.category] = (acc[product.category] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="inline-block animate-spin rounded-full h-16 w-16 border-4 border-green-600 border-t-transparent mb-4"></div>
          <p className="text-gray-600">Loading admin panel...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">Admin Panel</h1>
        <p className="text-gray-600">Manage platform and monitor carbon impact</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        <div className="bg-gradient-to-br from-blue-500 to-blue-600 text-white rounded-2xl p-6 shadow-lg">
          <Users size={32} className="mb-3" />
          <p className="text-blue-100 text-sm mb-1">Total Users</p>
          <p className="text-4xl font-bold">{stats.totalUsers}</p>
        </div>

        <div className="bg-gradient-to-br from-green-500 to-green-600 text-white rounded-2xl p-6 shadow-lg">
          <Package size={32} className="mb-3" />
          <p className="text-green-100 text-sm mb-1">Products</p>
          <p className="text-4xl font-bold">{stats.totalProducts}</p>
        </div>

        <div className="bg-gradient-to-br from-purple-500 to-purple-600 text-white rounded-2xl p-6 shadow-lg">
          <ShoppingBag size={32} className="mb-3" />
          <p className="text-purple-100 text-sm mb-1">Total Orders</p>
          <p className="text-4xl font-bold">{stats.totalOrders}</p>
        </div>

        <div className="bg-gradient-to-br from-amber-500 to-amber-600 text-white rounded-2xl p-6 shadow-lg">
          <TrendingDown size={32} className="mb-3" />
          <p className="text-amber-100 text-sm mb-1">Total Carbon</p>
          <p className="text-3xl font-bold">{stats.totalCarbon.toFixed(1)} kg</p>
        </div>

        <div className="bg-gradient-to-br from-emerald-500 to-emerald-600 text-white rounded-2xl p-6 shadow-lg">
          <span className="text-4xl mb-3 block">💰</span>
          <p className="text-emerald-100 text-sm mb-1">Revenue</p>
          <p className="text-3xl font-bold">${stats.totalRevenue.toFixed(0)}</p>
        </div>
      </div>

      <div className="bg-white rounded-2xl shadow-lg overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex space-x-4 p-4">
            {[
              { id: 'overview', label: 'Overview', icon: BarChart3 },
              { id: 'users', label: 'Users', icon: Users },
              { id: 'products', label: 'Products', icon: Package },
              { id: 'orders', label: 'Orders', icon: ShoppingBag },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  <Icon size={18} className="mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'overview' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">Products by Category</h3>
              <div className="space-y-4">
                {Object.entries(categoryStats).map(([category, count]) => (
                  <div key={category} className="flex items-center">
                    <span className="w-40 text-gray-700 font-medium">{category}</span>
                    <div className="flex-1 bg-gray-200 rounded-full h-8 overflow-hidden">
                      <div
                        className="bg-gradient-to-r from-green-500 to-green-600 h-full flex items-center justify-end px-3 text-white font-bold text-sm transition-all"
                        style={{ width: `${(count / stats.totalProducts) * 100}%` }}
                      >
                        {count}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'users' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">All Users</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Name</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Role</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Carbon Points</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Joined</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {users.map((user) => (
                      <tr key={user.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800">{user.name}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            user.role === 'admin' ? 'bg-purple-100 text-purple-700' :
                            user.role === 'seller' ? 'bg-green-100 text-green-700' :
                            'bg-blue-100 text-blue-700'
                          }`}>
                            {user.role}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-800 font-medium">{user.carbon_points}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {new Date(user.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'products' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">All Products</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Product</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Category</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Price</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Carbon</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Stock</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {products.map((product) => (
                      <tr key={product.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-800 font-medium">{product.name}</td>
                        <td className="px-4 py-3 text-gray-600 text-sm">{product.category}</td>
                        <td className="px-4 py-3 text-green-600 font-bold">${product.price}</td>
                        <td className="px-4 py-3 text-gray-700">{product.carbon_footprint} kg</td>
                        <td className="px-4 py-3 text-gray-700">{product.stock}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'orders' && (
            <div>
              <h3 className="text-xl font-bold text-gray-800 mb-6">All Orders</h3>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Order ID</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Total</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Carbon</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Points</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Status</th>
                      <th className="px-4 py-3 text-left text-sm font-semibold text-gray-700">Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {orders.map((order) => (
                      <tr key={order.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-gray-600 text-xs font-mono">{order.id.slice(0, 8)}...</td>
                        <td className="px-4 py-3 text-green-600 font-bold">${order.total_price.toFixed(2)}</td>
                        <td className="px-4 py-3 text-gray-700">{order.total_carbon.toFixed(2)} kg</td>
                        <td className="px-4 py-3 text-green-600 font-medium">+{order.carbon_points_earned}</td>
                        <td className="px-4 py-3">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                            order.status === 'completed' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' ? 'bg-blue-100 text-blue-700' :
                            'bg-yellow-100 text-yellow-700'
                          }`}>
                            {order.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-gray-600 text-sm">
                          {new Date(order.created_at).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
