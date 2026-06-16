import '@/styles/globals.css';
import { ReactNode } from 'react';
import { Providers } from '@/app/providers';

export const metadata = {
  title: 'Admin Portal',
  description: 'Admin Portal SPA migrated to Next.js',
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="h-full bg-background antialiased">
      <body className="h-full">
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  );
}
