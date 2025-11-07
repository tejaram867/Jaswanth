import { useState, useEffect } from 'react';
import { Package, Calendar, DollarSign, Leaf } from 'lucide-react';
import { supabase, Order } from '../../lib/supabase';
import { useAuth } from '../../contexts/AuthContext';

export const Orders = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchOrders();
  }, [user]);

  const fetchOrders = async () => {
    if (!user) return;

    setLoading(true);
    const { data, error } = await supabase
      .from('orders')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching orders:', error);
    } else {
      setOrders(data || []);
    }
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="text-center py-16">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-green-600 border-t-transparent"></div>
          <p className="text-gray-600 mt-4">Loading orders...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-gray-800 mb-2">My Orders</h1>
        <p className="text-gray-600">Track your sustainable purchases</p>
      </div>

      {orders.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-lg p-12 text-center">
          <Package size={64} className="text-gray-300 mx-auto mb-4" />
          <h3 className="text-2xl font-bold text-gray-800 mb-2">No orders yet</h3>
          <p className="text-gray-600 mb-6">Start your eco-friendly shopping journey today!</p>
        </div>
      ) : (
        <div className="space-y-6">
          {orders.map((order) => (
            <div key={order.id} className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-green-100 text-sm mb-1">Order ID</p>
                    <p className="font-mono text-lg font-bold">{order.id.slice(0, 16)}...</p>
                  </div>
                  <div className="mt-4 md:mt-0">
                    <span className={`px-4 py-2 rounded-full text-sm font-bold ${
                      order.status === 'completed' ? 'bg-green-500' :
                      order.status === 'processing' ? 'bg-blue-500' :
                      'bg-yellow-500'
                    }`}>
                      {order.status.toUpperCase()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="grid md:grid-cols-4 gap-6">
                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                      <Calendar className="text-blue-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Date</p>
                      <p className="font-bold text-gray-800">
                        {new Date(order.created_at).toLocaleDateString()}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mr-3">
                      <DollarSign className="text-green-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Total</p>
                      <p className="font-bold text-green-600 text-xl">
                        ${order.total_price.toFixed(2)}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-amber-100 rounded-full flex items-center justify-center mr-3">
                      <Leaf className="text-amber-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Carbon</p>
                      <p className="font-bold text-gray-800">
                        {order.total_carbon.toFixed(2)} kg CO₂
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mr-3">
                      <Package className="text-purple-600" size={24} />
                    </div>
                    <div>
                      <p className="text-sm text-gray-600">Points Earned</p>
                      <p className="font-bold text-purple-600 text-xl">
                        +{order.carbon_points_earned}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
