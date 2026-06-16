import { ReactNode } from 'react';
import { AppLayout } from '@/shared/components/layout/AppLayout';

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return <AppLayout>{children}</AppLayout>;
}
