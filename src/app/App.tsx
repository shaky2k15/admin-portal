import { RouterProvider } from 'react-router-dom';
import { AuthProvider } from '@/app/providers/AuthProvider';
import { QueryProvider } from '@/app/providers/QueryProvider';
import { ThemeProvider } from '@/app/providers/ThemeProvider';
import { router } from '@/app/routes';
import { FullPageLoader } from '@/shared/components/feedback/LoadingSpinner';

export default function App() {
  return (
    <AuthProvider>
      <QueryProvider>
        <ThemeProvider>
          <RouterProvider
            router={router}
            fallbackElement={<FullPageLoader label="Starting up…" />}
          />
        </ThemeProvider>
      </QueryProvider>
    </AuthProvider>
  );
}
