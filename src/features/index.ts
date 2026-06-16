import { lazy } from 'react';
import type { FeatureDefinition } from '@/shared/types/feature';
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Settings,
  FileText
} from 'lucide-react';

const DashboardPage = lazy(() => import('@/features/dashboard/components/DashboardPage'));
const UsersPage = lazy(() => import('@/features/users/components/UsersPage'));
const AnalyticsPage = lazy(() => import('@/features/analytics/components/AnalyticsPage'));
const SettingsPage = lazy(() => import('@/features/settings/components/SettingsPage'));
const ReportsPage = lazy(() => import('@/features/reports/components/ReportsPage'));

export const features: FeatureDefinition[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
    path: '/dashboard',
    component: DashboardPage,
  },
  {
    id: 'users',
    label: 'Users',
    icon: Users,
    path: '/users',
    component: UsersPage,
  },
  {
    id: 'analytics',
    label: 'Analytics',
    icon: BarChart3,
    path: '/analytics',
    component: AnalyticsPage,
    badge: 'New',
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    component: SettingsPage,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: FileText,
    path: '/reports',
    component: ReportsPage,
  }
];
