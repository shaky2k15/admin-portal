import { lazy } from 'react';
import { LayoutDashboard } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

const DashboardPage = lazy(() => import('@/features/dashboard/components/DashboardPage'));

export const dashboardFeature: FeatureDefinition = {
  id: 'dashboard',
  label: 'Dashboard',
  icon: LayoutDashboard,
  path: '/dashboard',
  component: DashboardPage,
};
