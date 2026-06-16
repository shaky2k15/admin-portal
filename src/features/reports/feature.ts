import { lazy } from 'react';
import { FileText } from 'lucide-react';
import type { FeatureDefinition } from '@/shared/types/feature';

// Lazy load your main page so it doesn't block the initial app load
const ReportsPage = lazy(() => import('./components/ReportsPage'));

export const reports: FeatureDefinition = {
    id: 'reports',          // Unique ID
    label: 'Reports',       // What shows up in the sidebar
    icon: FileText,         // Lucide-react icon for the sidebar
    path: '/reports',       // The URL route
    component: ReportsPage, // The component to render
};