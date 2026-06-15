import { ArrowUpRight, ArrowDownRight, TrendingUp } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const metrics = [
  { label: 'Page Views', value: '245K', change: '+18.2%', up: true },
  { label: 'Unique Visitors', value: '62.4K', change: '+7.3%', up: true },
  { label: 'Bounce Rate', value: '32.1%', change: '-3.8%', up: true },
  { label: 'Avg. Session', value: '4m 32s', change: '-1.2%', up: false },
];

const topPages = [
  { path: '/dashboard', views: '18,429', percentage: 42 },
  { path: '/users', views: '12,103', percentage: 28 },
  { path: '/settings', views: '8,294', percentage: 19 },
  { path: '/reports', views: '4,831', percentage: 11 },
];

export default function AnalyticsPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Analytics</h2>
          <p className="text-muted-foreground">
            Track performance and engagement metrics.
          </p>
        </div>
        <div className="inline-flex items-center gap-1 rounded-xl border border-border bg-card p-1">
          {['7D', '30D', '90D'].map((period) => (
            <button
              key={period}
              className={cn(
                'rounded-lg px-3 py-1.5 text-xs font-medium transition-smooth',
                period === '30D'
                  ? 'bg-primary text-primary-foreground shadow-sm'
                  : 'text-muted-foreground hover:text-foreground',
              )}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Metrics grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {metrics.map((metric) => (
          <div
            key={metric.label}
            className="rounded-2xl border border-border/50 bg-card p-5 shadow-sm"
          >
            <p className="text-sm font-medium text-muted-foreground">
              {metric.label}
            </p>
            <p className="mt-2 text-2xl font-bold text-foreground">
              {metric.value}
            </p>
            <div className="mt-2 flex items-center gap-1">
              {metric.up ? (
                <ArrowUpRight className="h-3.5 w-3.5 text-emerald-500" />
              ) : (
                <ArrowDownRight className="h-3.5 w-3.5 text-destructive" />
              )}
              <span
                className={cn(
                  'text-xs font-medium',
                  metric.up ? 'text-emerald-500' : 'text-destructive',
                )}
              >
                {metric.change}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Charts area */}
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h3 className="text-base font-semibold text-foreground">
              Traffic Overview
            </h3>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </div>
          <div className="flex h-64 items-center justify-center rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Traffic chart area
            </p>
          </div>
        </div>

        {/* Top pages */}
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            Top Pages
          </h3>
          <div className="space-y-4">
            {topPages.map((page) => (
              <div key={page.path}>
                <div className="mb-1 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">
                    {page.path}
                  </span>
                  <span className="text-muted-foreground">{page.views}</span>
                </div>
                <div className="h-2 overflow-hidden rounded-full bg-muted/50">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                    style={{ width: `${page.percentage.toString()}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
