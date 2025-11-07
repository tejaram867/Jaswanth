import { Leaf, TrendingDown, Award, Globe } from 'lucide-react';

interface HeroProps {
  onShopClick: () => void;
}

export const Hero = ({ onShopClick }: HeroProps) => {
  return (
    <div className="relative bg-gradient-to-br from-green-600 via-green-700 to-green-800 text-white overflow-hidden">
      <div className="absolute inset-0 bg-black opacity-10"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-32 relative z-10">
        <div className="text-center max-w-4xl mx-auto">
          <div className="flex items-center justify-center mb-6">
            <Leaf size={64} className="animate-pulse" />
          </div>

          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Shop Smart. Shop Green.<br />
            <span className="text-green-200">Reduce Your Carbon Footprint.</span>
          </h1>

          <p className="text-xl md:text-2xl mb-10 text-green-100 leading-relaxed">
            Every purchase matters. Track your environmental impact, discover eco-friendly alternatives, and earn rewards for sustainable choices.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <button
              onClick={onShopClick}
              className="bg-white text-green-700 px-8 py-4 rounded-xl font-bold text-lg hover:bg-green-50 transition-all shadow-xl hover:shadow-2xl transform hover:scale-105"
            >
              Start Shopping
            </button>
            <button className="bg-green-800 bg-opacity-50 backdrop-blur-sm text-white px-8 py-4 rounded-xl font-bold text-lg hover:bg-opacity-70 transition-all border-2 border-white border-opacity-30">
              Learn More
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
              <TrendingDown size={40} className="mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2">Track Carbon Impact</h3>
              <p className="text-green-100">Monitor your footprint with every purchase</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
              <Award size={40} className="mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2">Earn Rewards</h3>
              <p className="text-green-100">Get Carbon Points for eco-friendly choices</p>
            </div>

            <div className="bg-white bg-opacity-10 backdrop-blur-sm rounded-2xl p-6 transform hover:scale-105 transition-all">
              <Globe size={40} className="mx-auto mb-3" />
              <h3 className="font-bold text-xl mb-2">Make a Difference</h3>
              <p className="text-green-100">Join thousands reducing global emissions</p>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-16 bg-gradient-to-t from-white to-transparent"></div>
    </div>
  );
};
