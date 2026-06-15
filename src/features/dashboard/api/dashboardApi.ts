import type { DashboardStats, ActivityItem } from '@/features/dashboard/hooks/useDashboardStats';

const mockStats: DashboardStats = {
  totalUsers: {
    label: 'Total Users',
    value: 2847,
    displayValue: '2,847',
    change: 12.5,
    icon: 'Users',
    accent: 'blue',
  },
  activeProjects: {
    label: 'Active Projects',
    value: 142,
    displayValue: '142',
    change: 8.2,
    icon: 'FolderOpen',
    accent: 'green',
  },
  deployments: {
    label: 'Deployments',
    value: 1024,
    displayValue: '1,024',
    change: 23.1,
    icon: 'Rocket',
    accent: 'purple',
  },
  uptime: {
    label: 'Uptime',
    value: 99.9,
    displayValue: '99.9%',
    change: 0.1,
    icon: 'Activity',
    accent: 'amber',
  },
};

const mockActivity: ActivityItem[] = [
  {
    id: '1',
    user: 'John Carter',
    initials: 'JC',
    color: '#3b82f6',
    action: 'deployed v2.3.1 to production',
    timestamp: '2 min ago',
  },
  {
    id: '2',
    user: 'Sarah Mitchell',
    initials: 'SM',
    color: '#8b5cf6',
    action: 'updated API documentation',
    timestamp: '15 min ago',
  },
  {
    id: '3',
    user: 'Mike Chen',
    initials: 'MC',
    color: '#10b981',
    action: 'created new project Alpha',
    timestamp: '1 hour ago',
  },
  {
    id: '4',
    user: 'Emily Rodriguez',
    initials: 'ER',
    color: '#f59e0b',
    action: 'merged PR #847 into main',
    timestamp: '2 hours ago',
  },
  {
    id: '5',
    user: 'David Kim',
    initials: 'DK',
    color: '#ef4444',
    action: 'resolved 3 critical alerts',
    timestamp: '3 hours ago',
  },
  {
    id: '6',
    user: 'Lisa Thompson',
    initials: 'LT',
    color: '#06b6d4',
    action: 'published blog post on microservices',
    timestamp: '5 hours ago',
  },
  {
    id: '7',
    user: 'Alex Park',
    initials: 'AP',
    color: '#ec4899',
    action: 'updated staging environment configs',
    timestamp: '6 hours ago',
  },
  {
    id: '8',
    user: 'Rachel Green',
    initials: 'RG',
    color: '#14b8a6',
    action: 'onboarded 5 new team members',
    timestamp: '8 hours ago',
  },
];

/**
 * Fetch dashboard stats.
 * Currently returns mock data; swap with apiClient.get('/dashboard/stats') when ready.
 */
export async function getStats(): Promise<DashboardStats> {
  // TODO: Replace with real API call
  // return apiClient.get<DashboardStats>('/dashboard/stats');
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockStats), 300);
  });
}

/**
 * Fetch recent activity feed.
 * Currently returns mock data; swap with apiClient.get('/dashboard/activity') when ready.
 */
export async function getRecentActivity(): Promise<ActivityItem[]> {
  // TODO: Replace with real API call
  // return apiClient.get<ActivityItem[]>('/dashboard/activity');
  return new Promise((resolve) => {
    setTimeout(() => resolve(mockActivity), 300);
  });
}
