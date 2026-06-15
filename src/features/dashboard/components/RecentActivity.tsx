import { Clock } from 'lucide-react';
import type { ActivityItem } from '@/features/dashboard/hooks/useDashboardStats';

interface RecentActivityProps {
  activities: ActivityItem[];
}

export function RecentActivity({ activities }: RecentActivityProps) {
  return (
    <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '400ms', animationFillMode: 'both' }}>
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">Recent Activity</h2>
          <p className="text-sm text-muted-foreground mt-0.5">Latest updates from your team</p>
        </div>
        <button className="text-sm font-medium text-primary hover:text-primary/80 transition-smooth">
          View all
        </button>
      </div>

      {/* Timeline */}
      <div className="relative">
        {activities.map((activity, index) => {
          const isLast = index === activities.length - 1;

          return (
            <div
              key={activity.id}
              className="relative flex gap-4 pb-6 last:pb-0 group"
            >
              {/* Timeline connector */}
              {!isLast && (
                <div className="absolute left-5 top-11 h-[calc(100%-12px)] w-px bg-border" />
              )}

              {/* Avatar */}
              <div className="relative z-10 flex-shrink-0">
                <div
                  className="flex h-10 w-10 items-center justify-center rounded-full text-xs font-bold text-white shadow-sm ring-2 ring-background transition-smooth group-hover:scale-105"
                  style={{ backgroundColor: activity.color }}
                >
                  {activity.initials}
                </div>
              </div>

              {/* Content */}
              <div className="flex-1 min-w-0 pt-0.5">
                <p className="text-sm text-foreground leading-relaxed">
                  <span className="font-semibold">{activity.user}</span>{' '}
                  <span className="text-muted-foreground">{activity.action}</span>
                </p>
                <div className="flex items-center gap-1.5 mt-1.5">
                  <Clock className="h-3 w-3 text-muted-foreground/60" />
                  <span className="text-xs text-muted-foreground/60">{activity.timestamp}</span>
                </div>
              </div>

              {/* Timeline dot */}
              <div className="absolute left-[15px] top-[42px] z-10">
                {!isLast && (
                  <div className="h-1.5 w-1.5 rounded-full bg-border group-hover:bg-primary transition-smooth" />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
