import { useState, useEffect } from 'react';

export interface BarDataPoint {
  label: string;
  value: number;
  maxValue: number;
}

export interface MetricCard {
  id: string;
  label: string;
  value: string;
  change: number;
  sparkline: number[];
}

export interface AnalyticsData {
  barChart: BarDataPoint[];
  completionRate: number;
  metrics: MetricCard[];
  dateRange: string;
}

const mockAnalyticsData: AnalyticsData = {
  barChart: [
    { label: 'Jan', value: 4200, maxValue: 8000 },
    { label: 'Feb', value: 5800, maxValue: 8000 },
    { label: 'Mar', value: 3900, maxValue: 8000 },
    { label: 'Apr', value: 7200, maxValue: 8000 },
    { label: 'May', value: 6100, maxValue: 8000 },
    { label: 'Jun', value: 8000, maxValue: 8000 },
  ],
  completionRate: 73,
  metrics: [
    {
      id: 'views',
      label: 'Total Views',
      value: '45.2K',
      change: 14.2,
      sparkline: [30, 45, 35, 50, 40, 60, 55, 70, 65, 80],
    },
    {
      id: 'session',
      label: 'Avg Session',
      value: '4m 32s',
      change: 5.7,
      sparkline: [20, 30, 25, 45, 35, 50, 48, 55, 50, 60],
    },
    {
      id: 'bounce',
      label: 'Bounce Rate',
      value: '32.1%',
      change: -3.4,
      sparkline: [60, 55, 50, 48, 45, 40, 38, 35, 33, 32],
    },
  ],
  dateRange: 'Jan 1 – Jun 30, 2026',
};

export function useAnalytics() {
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setData(mockAnalyticsData);
      setIsLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  return { data, isLoading };
}
