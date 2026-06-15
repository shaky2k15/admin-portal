import { Activity, ArrowUpRight, TrendingUp, Users } from 'lucide-react';
import { cn } from '@/shared/lib/utils';

const stats = [
  {
    label: 'Total Users',
    value: '12,847',
    change: '+12.5%',
    trend: 'up' as const,
    icon: Users,
  },
  {
    label: 'Active Sessions',
    value: '1,429',
    change: '+4.2%',
    trend: 'up' as const,
    icon: Activity,
  },
  {
    label: 'Revenue',
    value: '$84,254',
    change: '+8.1%',
    trend: 'up' as const,
    icon: TrendingUp,
  },
  {
    label: 'Growth Rate',
    value: '23.6%',
    change: '+2.4%',
    trend: 'up' as const,
    icon: ArrowUpRight,
  },
];

export default function DashboardPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome back</h2>
        <p className="text-muted-foreground">
          Here's what's happening with your platform today.
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div
              key={stat.label}
              className="group rounded-2xl border border-border/50 bg-card p-5 shadow-sm transition-all duration-200 hover:shadow-md"
            >
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-muted-foreground">
                  {stat.label}
                </p>
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-primary/10">
                  <Icon className="h-4 w-4 text-primary" />
                </div>
              </div>
              <div className="mt-3">
                <p className="text-2xl font-bold text-foreground">
                  {stat.value}
                </p>
                <p
                  className={cn(
                    'mt-1 text-xs font-medium',
                    stat.trend === 'up'
                      ? 'text-emerald-500'
                      : 'text-destructive',
                  )}
                >
                  {stat.change} from last month
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Placeholder content areas */}
      <div className="grid gap-6 lg:grid-cols-7">
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm lg:col-span-4">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            Overview
          </h3>
          <div className="flex h-64 items-center justify-center rounded-xl bg-muted/30">
            <p className="text-sm text-muted-foreground">
              Chart visualization area
            </p>
          </div>
        </div>
        <div className="rounded-2xl border border-border/50 bg-card p-6 shadow-sm lg:col-span-3">
          <h3 className="mb-4 text-base font-semibold text-foreground">
            Recent Activity
          </h3>
          <div className="space-y-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-muted/50" />
                <div className="flex-1 space-y-1">
                  <div className="h-3 w-3/4 rounded bg-muted/50" />
                  <div className="h-2 w-1/2 rounded bg-muted/30" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
