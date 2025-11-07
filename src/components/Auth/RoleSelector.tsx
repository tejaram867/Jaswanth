import { useState } from 'react';
import { User, Store, Shield } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { UserRole } from '../../lib/supabase';

interface RoleSelectorProps {
  onRoleSelected: () => void;
}

export const RoleSelector = ({ onRoleSelected }: RoleSelectorProps) => {
  const [selectedRole, setSelectedRole] = useState<UserRole>('user');
  const [loading, setLoading] = useState(false);
  const { updateProfile } = useAuth();

  const roles = [
    {
      id: 'user' as UserRole,
      name: 'Shopper',
      description: 'Browse and purchase eco-friendly products',
      icon: User,
      color: 'from-blue-500 to-blue-600',
    },
    {
      id: 'seller' as UserRole,
      name: 'Seller',
      description: 'List and manage your sustainable products',
      icon: Store,
      color: 'from-green-500 to-green-600',
    },
    {
      id: 'admin' as UserRole,
      name: 'Admin',
      description: 'Manage platform and monitor carbon impact',
      icon: Shield,
      color: 'from-purple-500 to-purple-600',
    },
  ];

  const handleConfirm = async () => {
    setLoading(true);
    try {
      await updateProfile({ role: selectedRole });
      onRoleSelected();
    } catch (error) {
      console.error('Error updating role:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-3xl shadow-2xl max-w-4xl w-full p-8 animate-fade-in">
        <h2 className="text-4xl font-bold text-center text-gray-800 mb-3">
          Choose Your Role
        </h2>
        <p className="text-center text-gray-600 mb-8">
          Select how you'd like to use EcoBazaar
        </p>

        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {roles.map((role) => {
            const Icon = role.icon;
            return (
              <button
                key={role.id}
                onClick={() => setSelectedRole(role.id)}
                className={`p-6 rounded-2xl border-2 transition-all transform hover:scale-105 ${
                  selectedRole === role.id
                    ? 'border-green-600 bg-green-50 shadow-lg'
                    : 'border-gray-200 hover:border-green-300 bg-white'
                }`}
              >
                <div className={`w-16 h-16 mx-auto mb-4 rounded-full bg-gradient-to-br ${role.color} flex items-center justify-center`}>
                  <Icon className="text-white" size={32} />
                </div>
                <h3 className="text-xl font-bold text-gray-800 mb-2">{role.name}</h3>
                <p className="text-gray-600 text-sm">{role.description}</p>
              </button>
            );
          })}
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-gradient-to-r from-green-600 to-green-700 text-white py-4 rounded-xl font-semibold text-lg hover:from-green-700 hover:to-green-800 transition-all shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Setting up your account...' : 'Continue'}
        </button>
      </div>
    </div>
  );
};
