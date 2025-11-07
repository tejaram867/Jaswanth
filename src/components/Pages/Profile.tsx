import { Award, Leaf, TrendingDown, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export const Profile = () => {
  const { profile } = useAuth();

  if (!profile) return null;

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="bg-white rounded-3xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 text-white p-8">
          <div className="flex items-center">
            <div className="w-24 h-24 bg-white bg-opacity-20 rounded-full flex items-center justify-center mr-6">
              <User size={48} />
            </div>
            <div>
              <h1 className="text-4xl font-bold mb-2">{profile.name}</h1>
              <p className="text-green-100 text-lg capitalize">{profile.role} Account</p>
            </div>
          </div>
        </div>

        <div className="p-8">
          <div className="grid md:grid-cols-3 gap-6 mb-8">
            <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-2xl p-6 text-center">
              <Leaf className="text-green-600 mx-auto mb-3" size={40} />
              <p className="text-sm text-gray-600 mb-1">Carbon Points</p>
              <p className="text-4xl font-bold text-green-600">{profile.carbon_points}</p>
            </div>

            <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl p-6 text-center">
              <Award className="text-blue-600 mx-auto mb-3" size={40} />
              <p className="text-sm text-gray-600 mb-1">Eco Level</p>
              <p className="text-4xl font-bold text-blue-600">
                {profile.carbon_points > 500 ? 'Gold' : profile.carbon_points > 200 ? 'Silver' : 'Bronze'}
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-2xl p-6 text-center">
              <TrendingDown className="text-purple-600 mx-auto mb-3" size={40} />
              <p className="text-sm text-gray-600 mb-1">Impact Rank</p>
              <p className="text-4xl font-bold text-purple-600">Top 10%</p>
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">How to Earn More Points</h2>
            <div className="space-y-4">
              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-1 font-bold">
                  1
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Buy Eco-Friendly Products</h3>
                  <p className="text-gray-600 text-sm">Earn 10 points for every eco-friendly item purchased</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-1 font-bold">
                  2
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Choose Low-Carbon Products</h3>
                  <p className="text-gray-600 text-sm">Products with lower carbon footprints earn bonus points</p>
                </div>
              </div>

              <div className="flex items-start">
                <div className="w-8 h-8 bg-green-600 text-white rounded-full flex items-center justify-center mr-3 mt-1 font-bold">
                  3
                </div>
                <div>
                  <h3 className="font-bold text-gray-800 mb-1">Refer Friends</h3>
                  <p className="text-gray-600 text-sm">Invite friends to join and earn 50 bonus points</p>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-8 bg-amber-50 border border-amber-200 rounded-2xl p-6">
            <h3 className="font-bold text-amber-800 mb-2 flex items-center">
              <Award size={24} className="mr-2" />
              Rewards Available
            </h3>
            <p className="text-amber-700 mb-4">
              You have {profile.carbon_points} points available to redeem
            </p>
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">5% off next purchase</span>
                <span className="font-bold text-gray-800">100 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">10% off next purchase</span>
                <span className="font-bold text-gray-800">250 points</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-700">15% off next purchase</span>
                <span className="font-bold text-gray-800">500 points</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
