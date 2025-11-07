import { Sparkles, X, TrendingDown } from 'lucide-react';
import { Product } from '../../lib/supabase';

interface EcoRecommendationProps {
  product: Product;
  alternatives: Product[];
  onClose: () => void;
  onSelectAlternative: (product: Product) => void;
}

export const EcoRecommendation = ({ product, alternatives, onClose, onSelectAlternative }: EcoRecommendationProps) => {
  if (alternatives.length === 0) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto animate-fade-in">
        <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-t-3xl flex items-center justify-between sticky top-0 z-10">
          <div className="flex items-center">
            <Sparkles size={32} className="mr-3" />
            <div>
              <h2 className="text-2xl font-bold">Eco-Friendly Alternative</h2>
              <p className="text-green-100 text-sm">Consider these sustainable options</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-white hover:bg-white hover:bg-opacity-20 p-2 rounded-lg transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 mb-6">
            <p className="text-amber-800 font-medium">
              You selected: <span className="font-bold">{product.name}</span>
            </p>
            <p className="text-amber-700 text-sm mt-1">
              Carbon footprint: {product.carbon_footprint} kg CO₂
            </p>
          </div>

          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-800 mb-2 flex items-center">
              <TrendingDown className="text-green-600 mr-2" size={24} />
              Lower Carbon Alternatives
            </h3>
            <p className="text-gray-600 text-sm">
              These products have a smaller environmental impact and similar features
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            {alternatives.map((alt) => (
              <div
                key={alt.id}
                className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-6 border-2 border-green-200 hover:border-green-400 transition-all"
              >
                <img
                  src={alt.image_url}
                  alt={alt.name}
                  className="w-full h-48 object-cover rounded-xl mb-4"
                />
                <h4 className="font-bold text-lg text-gray-800 mb-2">{alt.name}</h4>
                <p className="text-gray-600 text-sm mb-4 line-clamp-2">{alt.description}</p>

                <div className="space-y-2 mb-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Carbon Footprint</span>
                    <span className="font-bold text-green-600">
                      {alt.carbon_footprint} kg CO₂
                    </span>
                  </div>
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-700">Savings</span>
                    <span className="font-bold text-green-600">
                      -{((product.carbon_footprint - alt.carbon_footprint) / product.carbon_footprint * 100).toFixed(0)}%
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-2xl font-bold text-green-600">${alt.price.toFixed(2)}</span>
                    {alt.price < product.price && (
                      <span className="text-sm text-green-600 font-medium">
                        Save ${(product.price - alt.price).toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>

                <button
                  onClick={() => onSelectAlternative(alt)}
                  className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-3 rounded-xl font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
                >
                  Choose This Instead
                </button>
              </div>
            ))}
          </div>

          <div className="mt-6 text-center">
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 font-medium transition-colors"
            >
              Continue with original selection
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
