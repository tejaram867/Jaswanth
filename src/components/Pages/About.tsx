import { Leaf, Target, Users, Globe } from 'lucide-react';

export const About = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="text-center mb-16">
        <h1 className="text-5xl font-bold text-gray-800 mb-4">About EcoBazaar</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Building a sustainable future through conscious commerce
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
        <div>
          <img
            src="https://images.pexels.com/photos/1072179/pexels-photo-1072179.jpeg?auto=compress&cs=tinysrgb&w=1200"
            alt="Sustainability"
            className="rounded-2xl shadow-2xl"
          />
        </div>
        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Our Mission</h2>
          <p className="text-gray-600 leading-relaxed mb-4">
            EcoBazaar is more than just an e-commerce platform. We're a movement dedicated to making sustainable shopping accessible, transparent, and rewarding for everyone.
          </p>
          <p className="text-gray-600 leading-relaxed">
            Every product on our platform comes with detailed carbon footprint information, helping you make informed decisions that benefit both you and the planet.
          </p>
        </div>
      </div>

      <div className="grid md:grid-cols-4 gap-8 mb-16">
        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-green-500 to-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Leaf className="text-white" size={32} />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Eco-Friendly</h3>
          <p className="text-gray-600 text-sm">Curated sustainable products</p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Target className="text-white" size={32} />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Transparent</h3>
          <p className="text-gray-600 text-sm">Clear carbon tracking</p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-purple-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Users className="text-white" size={32} />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Community</h3>
          <p className="text-gray-600 text-sm">Join eco-conscious shoppers</p>
        </div>

        <div className="text-center p-6">
          <div className="w-16 h-16 bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-full flex items-center justify-center mx-auto mb-4">
            <Globe className="text-white" size={32} />
          </div>
          <h3 className="font-bold text-lg text-gray-800 mb-2">Global Impact</h3>
          <p className="text-gray-600 text-sm">Reducing emissions together</p>
        </div>
      </div>

      <div className="bg-gradient-to-br from-green-600 to-green-800 text-white rounded-3xl p-12 text-center">
        <h2 className="text-4xl font-bold mb-4">Join the Movement</h2>
        <p className="text-green-100 text-lg mb-8 max-w-2xl mx-auto">
          Together, we can make a difference. Every sustainable choice counts towards a better tomorrow.
        </p>
        <div className="flex justify-center gap-8 text-center">
          <div>
            <p className="text-5xl font-bold mb-2">10K+</p>
            <p className="text-green-100">Active Users</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">50K+</p>
            <p className="text-green-100">Products</p>
          </div>
          <div>
            <p className="text-5xl font-bold mb-2">2M kg</p>
            <p className="text-green-100">CO₂ Saved</p>
          </div>
        </div>
      </div>
    </div>
  );
};
