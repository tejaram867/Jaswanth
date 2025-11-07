import { useState, useEffect } from 'react';
import { Filter, SlidersHorizontal } from 'lucide-react';
import { Product } from '../../lib/supabase';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  onAddToCart?: (product: Product) => void;
  showAddToCart?: boolean;
}

export const ProductGrid = ({ products, onAddToCart, showAddToCart = true }: ProductGridProps) => {
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<string>('featured');
  const [showFilters, setShowFilters] = useState(false);

  const categories = ['all', ...Array.from(new Set(products.map(p => p.category)))];

  useEffect(() => {
    let result = [...products];

    if (selectedCategory !== 'all') {
      result = result.filter(p => p.category === selectedCategory);
    }

    switch (sortBy) {
      case 'price-low':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'carbon-low':
        result.sort((a, b) => a.carbon_footprint - b.carbon_footprint);
        break;
      case 'eco-rating':
        result.sort((a, b) => b.eco_rating - a.eco_rating);
        break;
    }

    setFilteredProducts(result);
  }, [products, selectedCategory, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-2">Our Products</h2>
          <p className="text-gray-600">Discover {filteredProducts.length} sustainable products</p>
        </div>

        <button
          onClick={() => setShowFilters(!showFilters)}
          className="md:hidden flex items-center bg-white border border-gray-300 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
        >
          <Filter size={18} className="mr-2" />
          Filters & Sort
        </button>
      </div>

      <div className={`mb-8 ${showFilters ? 'block' : 'hidden md:block'}`}>
        <div className="bg-white rounded-xl shadow-md p-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <Filter size={16} className="mr-2" />
                Category
              </label>
              <div className="flex flex-wrap gap-2">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`px-4 py-2 rounded-lg font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-green-600 text-white shadow-lg'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    {category === 'all' ? 'All Products' : category}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                <SlidersHorizontal size={16} className="mr-2" />
                Sort By
              </label>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
              >
                <option value="featured">Featured</option>
                <option value="price-low">Price: Low to High</option>
                <option value="price-high">Price: High to Low</option>
                <option value="carbon-low">Carbon Footprint: Low to High</option>
                <option value="eco-rating">Eco Rating: High to Low</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {filteredProducts.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No products found matching your criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredProducts.map(product => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={onAddToCart}
              showAddToCart={showAddToCart}
            />
          ))}
        </div>
      )}
    </div>
  );
};
