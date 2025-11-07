import { Leaf, Facebook, Twitter, Instagram, Mail } from 'lucide-react';

export const Footer = () => {
  return (
    <footer className="bg-gradient-to-br from-gray-900 to-gray-800 text-white mt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8">
          <div className="col-span-2">
            <div className="flex items-center mb-4">
              <Leaf className="text-green-500 mr-2" size={32} />
              <span className="text-2xl font-bold">EcoBazaar</span>
            </div>
            <p className="text-gray-400 mb-4 leading-relaxed">
              Shop Smart. Shop Green. Reduce Your Carbon Footprint.
            </p>
            <p className="text-gray-400 text-sm">
              Every purchase contributes to a sustainable future. Track your impact, earn rewards, and join the movement towards zero-carbon shopping.
            </p>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  About Us
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  Our Mission
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  Sustainability
                </a>
              </li>
              <li>
                <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                  FAQs
                </a>
              </li>
            </ul>
          </div>

          <div>
            <h3 className="font-bold text-lg mb-4">Connect</h3>
            <div className="flex space-x-4 mb-4">
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Facebook size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Twitter size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Instagram size={24} />
              </a>
              <a href="#" className="text-gray-400 hover:text-green-500 transition-colors">
                <Mail size={24} />
              </a>
            </div>
            <div className="flex items-center space-x-3 text-3xl">
              <span>🌿</span>
              <span>♻️</span>
              <span>🌎</span>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400 text-sm">
          <p>© 2024 EcoBazaar. All rights reserved. Building a sustainable tomorrow, one purchase at a time.</p>
        </div>
      </div>
    </footer>
  );
};
