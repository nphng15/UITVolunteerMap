import { Link } from 'react-router';

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-900 to-primary-700 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-5xl font-bold text-white mb-4">
          UIT Volunteer Map
        </h1>
        <p className="text-primary-200 text-lg mb-8">
          Monorepo with React + Vite + SWC + Tailwind + Express
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            to="/login"
            className="px-6 py-3 bg-white text-primary-700 font-medium rounded-lg hover:bg-primary-50 transition-colors"
          >
            Login
          </Link>
          <Link
            to="/dashboard"
            className="px-6 py-3 bg-primary-500 text-white font-medium rounded-lg hover:bg-primary-600 transition-colors"
          >
            Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
