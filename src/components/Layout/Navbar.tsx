import { useState } from 'react';
import { Leaf, ShoppingCart, User, LogOut, Menu, X } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

interface NavbarProps {
  onAuthClick: () => void;
  onCartClick: () => void;
  cartItemsCount: number;
  currentView: string;
  onNavigate: (view: string) => void;
}

export const Navbar = ({ onAuthClick, onCartClick, cartItemsCount, currentView, onNavigate }: NavbarProps) => {
  const { user, profile, signOut } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showUserMenu, setShowUserMenu] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setShowUserMenu(false);
    onNavigate('home');
  };

  const navItems = [
    { id: 'home', label: 'Home' },
    { id: 'products', label: 'Products' },
    { id: 'about', label: 'About' },
    { id: 'contact', label: 'Contact' },
  ];

  if (profile?.role === 'seller') {
    navItems.push({ id: 'seller', label: 'My Store' });
  }

  if (profile?.role === 'admin') {
    navItems.push({ id: 'admin', label: 'Admin Panel' });
  }

  return (
    <nav className="bg-white shadow-md sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center cursor-pointer" onClick={() => onNavigate('home')}>
            <Leaf className="text-green-600 mr-2" size={32} />
            <span className="text-2xl font-bold bg-gradient-to-r from-green-600 to-green-800 bg-clip-text text-transparent">
              EcoBazaar
            </span>
          </div>

          <div className="hidden md:flex items-center space-x-8">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`font-medium transition-colors ${
                  currentView === item.id
                    ? 'text-green-600'
                    : 'text-gray-700 hover:text-green-600'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div className="flex items-center space-x-4">
            {user && (
              <button
                onClick={onCartClick}
                className="relative p-2 text-gray-700 hover:text-green-600 transition-colors"
              >
                <ShoppingCart size={24} />
                {cartItemsCount > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {cartItemsCount}
                  </span>
                )}
              </button>
            )}

            {user ? (
              <div className="relative">
                <button
                  onClick={() => setShowUserMenu(!showUserMenu)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <User size={24} className="text-gray-700" />
                  <span className="hidden md:block text-sm font-medium text-gray-700">
                    {profile?.name}
                  </span>
                </button>

                {showUserMenu && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl py-2 border border-gray-200">
                    <div className="px-4 py-2 border-b border-gray-200">
                      <p className="text-sm font-medium text-gray-800">{profile?.name}</p>
                      <p className="text-xs text-gray-500 capitalize">{profile?.role}</p>
                      <p className="text-xs text-green-600 font-medium mt-1">
                        {profile?.carbon_points} Carbon Points
                      </p>
                    </div>
                    <button
                      onClick={() => {
                        onNavigate('profile');
                        setShowUserMenu(false);
                      }}
                      className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                    >
                      My Profile
                    </button>
                    {user && (
                      <button
                        onClick={() => {
                          onNavigate('orders');
                          setShowUserMenu(false);
                        }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                      >
                        My Orders
                      </button>
                    )}
                    <button
                      onClick={handleSignOut}
                      className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center"
                    >
                      <LogOut size={16} className="mr-2" />
                      Sign Out
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button
                onClick={onAuthClick}
                className="bg-gradient-to-r from-green-600 to-green-700 text-white px-6 py-2 rounded-lg font-semibold hover:from-green-700 hover:to-green-800 transition-all shadow-md hover:shadow-lg"
              >
                Sign In
              </button>
            )}

            <button
              onClick={() => setShowMenu(!showMenu)}
              className="md:hidden p-2 text-gray-700"
            >
              {showMenu ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>

        {showMenu && (
          <div className="md:hidden pb-4 space-y-2">
            {navItems.map((item) => (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  setShowMenu(false);
                }}
                className={`block w-full text-left px-4 py-2 rounded-lg font-medium transition-colors ${
                  currentView === item.id
                    ? 'bg-green-50 text-green-600'
                    : 'text-gray-700 hover:bg-gray-100'
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>
        )}
      </div>
    </nav>
  );
};
