import { ShoppingCart, Leaf, Star } from 'lucide-react';
import { Product } from '../../lib/supabase';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

export const ProductCard = ({ product, onAddToCart, showAddToCart = true }: ProductCardProps) => {
  return (
    <div className="bg-white rounded-2xl shadow-lg overflow-hidden transform hover:scale-105 transition-all duration-300 hover:shadow-2xl group">
      <div className="relative overflow-hidden h-64">
        <img
          src={product.image_url}
          alt={product.name}
          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
        />
        {product.is_eco_friendly && (
          <div className="absolute top-3 right-3 bg-green-500 text-white px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
            <Leaf size={14} className="mr-1" />
            Eco-Friendly
          </div>
        )}
        <div className="absolute top-3 left-3 bg-white bg-opacity-90 backdrop-blur-sm px-3 py-1 rounded-full text-xs font-bold flex items-center shadow-lg">
          <span className="text-gray-700">{product.carbon_footprint} kg CO₂</span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center mb-2">
          {[...Array(5)].map((_, i) => (
            <Star
              key={i}
              size={14}
              className={i < product.eco_rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'}
            />
          ))}
          <span className="ml-2 text-xs text-gray-500">Eco Rating</span>
        </div>

        <h3 className="font-bold text-lg text-gray-800 mb-2 line-clamp-2 h-14">
          {product.name}
        </h3>

        <p className="text-gray-600 text-sm mb-3 line-clamp-2 h-10">
          {product.description}
        </p>

        <div className="flex items-center justify-between mb-3">
          <span className="text-2xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </span>
          <span className="text-xs text-gray-500 bg-gray-100 px-3 py-1 rounded-full">
            {product.category}
          </span>
        </div>

        <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
          <span>{product.stock} in stock</span>
          <span className={product.stock > 50 ? 'text-green-600' : product.stock > 20 ? 'text-yellow-600' : 'text-red-600'}>
            {product.stock > 50 ? 'In Stock' : product.stock > 0 ? 'Low Stock' : 'Out of Stock'}
          </span>
        </div>

        {showAddToCart && onAddToCart && (
          <button
            onClick={() => onAddToCart(product)}
            disabled={product.stock === 0}
            className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <ShoppingCart size={18} className="mr-2" />
            Add to Cart
          </button>
        )}
      </div>
    </div>
  );
};
