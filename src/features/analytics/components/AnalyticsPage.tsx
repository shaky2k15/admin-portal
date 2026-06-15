import { CalendarDays, Loader2 } from 'lucide-react';
import { useAnalytics } from '@/features/analytics/hooks/useAnalytics';
import { BarChart, DonutChart, MetricCards } from '@/features/analytics/components/Charts';

export default function AnalyticsPage() {
  const { data, isLoading } = useAnalytics();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Analytics</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Track your project performance and user engagement.
          </p>
        </div>
        <div className="inline-flex items-center gap-2 h-10 px-4 rounded-lg border border-input bg-background text-sm text-muted-foreground self-start sm:self-auto">
          <CalendarDays className="h-4 w-4" />
          <span>{data.dateRange}</span>
        </div>
      </div>

      {/* Metric cards row */}
      <MetricCards metrics={data.metrics} />

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3">
          <BarChart data={data.barChart} />
        </div>
        <div className="lg:col-span-2">
          <DonutChart percentage={data.completionRate} />
        </div>
      </div>
    </div>
  );
}
