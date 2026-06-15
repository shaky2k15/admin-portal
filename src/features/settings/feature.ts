import { lazy } from 'react';
import { Settings } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

const SettingsPage = lazy(() => import('@/features/settings/components/SettingsPage'));

export const settingsFeature: FeatureDefinition = {
  id: 'settings',
  label: 'Settings',
  icon: Settings,
  path: '/settings',
  component: SettingsPage,
};
