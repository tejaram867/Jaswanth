import { X, Minus, Plus, ShoppingBag, Leaf, TrendingDown } from 'lucide-react';
import { CartItem, Product } from '../../lib/supabase';

interface ShoppingCartProps {
  isOpen: boolean;
  onClose: () => void;
  cartItems: (CartItem & { products?: Product })[];
  onUpdateQuantity: (itemId: string, newQuantity: number) => void;
  onRemoveItem: (itemId: string) => void;
  onCheckout: () => void;
}

export const ShoppingCart = ({
  isOpen,
  onClose,
  cartItems,
  onUpdateQuantity,
  onRemoveItem,
  onCheckout,
}: ShoppingCartProps) => {
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

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-end">
      <div className="bg-white w-full max-w-md h-full shadow-2xl flex flex-col animate-slide-in">
        <div className="bg-gradient-to-r from-green-600 to-green-700 text-white p-6 flex items-center justify-between">
          <div className="flex items-center">
            <ShoppingBag size={28} className="mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Your Cart</h2>
              <p className="text-green-100 text-sm">{cartItems.length} items</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        {cartItems.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center p-8 text-center">
            <ShoppingBag size={64} className="text-gray-300 mb-4" />
            <h3 className="text-xl font-bold text-gray-800 mb-2">Your cart is empty</h3>
            <p className="text-gray-600 mb-6">Start adding eco-friendly products!</p>
            <button
              onClick={onClose}
              className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all"
            >
              Continue Shopping
            </button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto p-6 space-y-4">
              {cartItems.map((item) => {
                const product = item.products;
                if (!product) return null;

                return (
                  <div key={item.id} className="bg-gray-50 rounded-xl p-4 flex gap-4">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-24 h-24 object-cover rounded-lg"
                    />
                    <div className="flex-1">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="font-bold text-gray-800">{product.name}</h3>
                          {product.is_eco_friendly && (
                            <span className="inline-flex items-center text-xs text-green-600 font-medium">
                              <Leaf size={12} className="mr-1" />
                              Eco-Friendly
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => onRemoveItem(item.id)}
                          className="text-red-500 hover:text-red-700 transition-colors"
                        >
                          <X size={18} />
                        </button>
                      </div>

                      <p className="text-sm text-gray-600 mb-2">
                        {product.carbon_footprint} kg CO₂ each
                      </p>

                      <div className="flex items-center justify-between">
                        <div className="flex items-center bg-white rounded-lg border border-gray-200">
                          <button
                            onClick={() => onUpdateQuantity(item.id, Math.max(1, item.quantity - 1))}
                            className="p-2 hover:bg-gray-100 transition-colors rounded-l-lg"
                          >
                            <Minus size={16} />
                          </button>
                          <span className="px-4 font-semibold">{item.quantity}</span>
                          <button
                            onClick={() => onUpdateQuantity(item.id, item.quantity + 1)}
                            className="p-2 hover:bg-gray-100 transition-colors rounded-r-lg"
                          >
                            <Plus size={16} />
                          </button>
                        </div>
                        <span className="text-lg font-bold text-green-600">
                          ${(product.price * item.quantity).toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="border-t border-gray-200 p-6 space-y-4">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 flex items-center">
                    <TrendingDown size={16} className="mr-2 text-green-600" />
                    Total Carbon Impact
                  </span>
                  <span className="font-bold text-gray-800">{totalCarbon.toFixed(2)} kg CO₂</span>
                </div>
                {ecoPoints > 0 && (
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 flex items-center">
                      <Leaf size={16} className="mr-2 text-green-600" />
                      Carbon Points Earned
                    </span>
                    <span className="font-bold text-green-600">+{ecoPoints} points</span>
                  </div>
                )}
              </div>

              <div className="flex items-center justify-between text-xl font-bold">
                <span className="text-gray-800">Total</span>
                <span className="text-green-600">${totalPrice.toFixed(2)}</span>
              </div>

              <button
                onClick={onCheckout}
                className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-bold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
