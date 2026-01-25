import { Link } from 'react-router';
import { useAuth } from '@/hooks/useAuth';

export default function DashboardPage() {
  const { user, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Dashboard</h1>
        <button
          onClick={handleLogout}
          className="px-4 py-2 text-sm text-gray-600 hover:text-gray-900"
        >
          Logout
        </button>
      </div>

      <div className="bg-white rounded-lg shadow p-6 mb-4">
        <p className="text-gray-600">
          Welcome back, <span className="font-medium">{user?.username}</span>
        </p>
        <p className="text-sm text-gray-500 mt-1">
          Role: {user?.role}
        </p>
      </div>

      <Link to="/" className="text-primary-600 hover:underline">
        Back to home
      </Link>
    </div>
  );
}
