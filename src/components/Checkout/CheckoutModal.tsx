import { useState } from 'react';
import { X, CreditCard, CheckCircle, Leaf } from 'lucide-react';
import { CartItem, Product } from '../../lib/supabase';

interface CheckoutModalProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: (CartItem & { products?: Product })[];
  onPlaceOrder: () => Promise<void>;
  requireAuth?: () => void;
}

export const CheckoutModal = ({ isOpen, onClose, cartItems, onPlaceOrder, requireAuth }: CheckoutModalProps) => {
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

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

  const handleCheckout = async () => {
    if (requireAuth) {
      requireAuth();
      return;
    }

    setLoading(true);
    try {
      await onPlaceOrder();
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onClose();
      }, 3000);
    } catch (error) {
      console.error('Checkout error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-3xl p-8 max-w-md w-full text-center animate-fade-in">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle size={48} className="text-green-600" />
          </div>
          <h2 className="text-3xl font-bold text-gray-800 mb-3">Order Placed!</h2>
          <p className="text-gray-600 mb-4">Your sustainable purchase is confirmed.</p>
          <div className="bg-green-50 rounded-xl p-4 mb-4">
            <p className="text-green-700 font-semibold">
              You earned {ecoPoints} Carbon Points!
            </p>
          </div>
          <p className="text-sm text-gray-500">Redirecting...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full my-8 animate-fade-in">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 rounded-t-3xl flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold">Checkout</h2>
            <p className="text-green-100 text-sm">Review your order</p>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <h3 className="font-bold text-lg text-gray-800 mb-4">Order Summary</h3>
            <div className="space-y-3 max-h-64 overflow-y-auto">
              {cartItems.map((item) => {
                const product = item.products;
                if (!product) return null;

                return (
                  <div key={item.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-16 h-16 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-800 text-sm">{product.name}</h4>
                      <p className="text-xs text-gray-600">Qty: {item.quantity}</p>
                    </div>
                    <span className="font-bold text-green-600">
                      ${(product.price * item.quantity).toFixed(2)}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-6 space-y-4">
            <h3 className="font-bold text-lg text-gray-800 mb-2">Environmental Impact</h3>

            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Carbon Footprint</span>
              <span className="font-bold text-gray-800">{totalCarbon.toFixed(2)} kg CO₂</span>
            </div>

            {ecoPoints > 0 && (
              <div className="flex items-center justify-between border-t border-green-200 pt-3">
                <span className="text-green-700 flex items-center">
                  <Leaf size={18} className="mr-2" />
                  Carbon Points Earned
                </span>
                <span className="font-bold text-green-600 text-xl">+{ecoPoints}</span>
              </div>
            )}

            <div className="bg-white bg-opacity-70 rounded-lg p-3 text-sm text-gray-600">
              <p>These points can be redeemed for discounts on future eco-friendly purchases!</p>
            </div>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <div className="flex items-center justify-between text-2xl font-bold mb-6">
              <span className="text-gray-800">Total Amount</span>
              <span className="text-green-600">${totalPrice.toFixed(2)}</span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <CreditCard size={24} className="mr-2" />
              {loading ? 'Processing...' : 'Place Order'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
