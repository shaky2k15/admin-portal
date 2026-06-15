import { ComponentType, LazyExoticComponent } from 'react';
import { LucideIcon } from 'lucide-react';

export interface FeatureDefinition {
  id: string;
  label: string;
  icon: LucideIcon;
  path: string;
  component: LazyExoticComponent<ComponentType>;
  requiredRoles?: string[];
  badge?: string;
}
