import { lazy } from 'react';
import { Users } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

const UsersPage = lazy(() => import('@/features/users/components/UsersPage'));

export const usersFeature: FeatureDefinition = {
  id: 'users',
  label: 'Users',
  icon: Users,
  path: '/users',
  component: UsersPage,
};
