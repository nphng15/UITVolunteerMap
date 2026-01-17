import { createBrowserRouter } from 'react-router';
import RootLayout from '@/layouts/RootLayout';
import ProtectedRoute from '@/components/ProtectedRoute';
import HomePage from '@/routes/HomePage';
import LoginPage from '@/routes/LoginPage';
import DashboardPage from '@/routes/DashboardPage';
import AdminLayout from '@/layouts/AdminLayout';
import AdminDashboard from '@/routes/admin/AdminDashboard';
import NotFoundPage from '@/routes/NotFoundPage';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <RootLayout />,
    children: [
      { index: true, element: <HomePage /> },
      { path: 'login', element: <LoginPage /> },
      {
        element: <ProtectedRoute />,
        children: [
          { path: 'dashboard', element: <DashboardPage /> },
        ],
      },
      {
        path: 'admin',
        element: <ProtectedRoute requiredRole="admin" />,
        children: [
          {
            element: <AdminLayout />,
            children: [
              { index: true, element: <AdminDashboard /> },
            ],
          },
        ],
      },
      { path: '*', element: <NotFoundPage /> },
    ],
  },
]);
