import { createBrowserRouter, Navigate } from 'react-router-dom';
import LoginPage from '@/features/auth/components/LoginPage';
import { ProtectedRoute } from '@/features/auth/components/ProtectedRoute';
import { AppLayout } from '@/shared/components/layout/AppLayout';
import { features } from '@/features';
import { Home } from 'lucide-react';

function NotFoundPage() {
  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center animate-fade-in">
      <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-2xl bg-muted">
        <span className="text-4xl font-bold text-muted-foreground">404</span>
      </div>
      <h1 className="mb-2 text-2xl font-bold text-foreground">
        Page not found
      </h1>
      <p className="mb-8 max-w-md text-center text-muted-foreground">
        The page you're looking for doesn't exist or has been moved.
      </p>
      <a
        href="/dashboard"
        className="inline-flex items-center gap-2 rounded-xl bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]"
      >
        <Home className="h-4 w-4" />
        Back to Dashboard
      </a>
    </div>
  );
}

export const router = createBrowserRouter([
  {
    path: '/login',
    element: <LoginPage />,
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            index: true,
            element: <Navigate to="/dashboard" replace />,
          },
          ...features.map((feature) => ({
            path: feature.path.replace(/^\//, ''),
            element: <feature.component />,
          })),
          {
            path: '*',
            element: <NotFoundPage />,
          },
        ],
      },
    ],
  },
]);
