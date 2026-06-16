'use client';

import { ReactNode, Suspense } from 'react';
import { Sidebar, useSidebar } from '@/shared/components/layout/Sidebar';
import { Header } from '@/shared/components/layout/Header';
import { LoadingSpinner } from '@/shared/components/feedback/LoadingSpinner';
import { ErrorBoundary } from '@/shared/components/feedback/ErrorBoundary';
import { cn } from '@/shared/lib/utils';

export function AppLayout({ children }: { children: ReactNode }) {
  const expanded = useSidebar((s) => s.expanded);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar />

      <div
        className={cn(
          'flex min-h-screen flex-col transition-all duration-300 ease-in-out',
          expanded ? 'ml-[280px]' : 'ml-[72px]',
        )}
      >
        <Header />

        <main className="flex-1 p-6">
          <ErrorBoundary>
            <Suspense
              fallback={
                <div className="flex min-h-[400px] items-center justify-center">
                  <LoadingSpinner size="lg" label="Loading module…" />
                </div>
              }
            >
              {children}
            </Suspense>
          </ErrorBoundary>
        </main>
      </div>
    </div>
  );
}
