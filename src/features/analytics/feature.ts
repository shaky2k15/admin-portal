import { lazy } from 'react';
import { BarChart3 } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

const AnalyticsPage = lazy(() => import('@/features/analytics/components/AnalyticsPage'));

export const analyticsFeature: FeatureDefinition = {
  id: 'analytics',
  label: 'Analytics',
  icon: BarChart3,
  path: '/analytics',
  component: AnalyticsPage,
  badge: 'New',
};
