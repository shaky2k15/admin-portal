'use client';

import { useState, useEffect } from 'react';

export interface StatCard {
  label: string;
  value: number;
  displayValue: string;
  change: number;
  icon: 'Users' | 'FolderOpen' | 'Rocket' | 'Activity';
  accent: 'blue' | 'green' | 'purple' | 'amber';
}

export interface DashboardStats {
  totalUsers: StatCard;
  activeProjects: StatCard;
  deployments: StatCard;
  uptime: StatCard;
}

export interface ActivityItem {
  id: string;
  user: string;
  initials: string;
  color: string;
  action: string;
  timestamp: string;
}

export interface DashboardData {
  stats: DashboardStats;
  activity: ActivityItem[];
  userName: string;
}

const mockData: DashboardData = {
  userName: 'Sekhar',
  stats: {
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
  },
  activity: [
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
  ],
};

export function useDashboardStats() {
  const [data, setData] = useState<DashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate API fetch; swap with getStats() / getRecentActivity() from dashboardApi
    const timer = setTimeout(() => {
      setData(mockData);
      setIsLoading(false);
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
