import { Users, FolderOpen, Rocket, Activity, TrendingUp } from 'lucide-react';
import type { StatCard } from '@/features/dashboard/hooks/useDashboardStats';

const iconMap = {
  Users,
  FolderOpen,
  Rocket,
  Activity,
} as const;

const accentStyles = {
  blue: {
    bg: 'bg-blue-500/10 dark:bg-blue-500/15',
    icon: 'text-blue-600 dark:text-blue-400',
    ring: 'ring-blue-500/20',
  },
  green: {
    bg: 'bg-emerald-500/10 dark:bg-emerald-500/15',
    icon: 'text-emerald-600 dark:text-emerald-400',
    ring: 'ring-emerald-500/20',
  },
  purple: {
    bg: 'bg-purple-500/10 dark:bg-purple-500/15',
    icon: 'text-purple-600 dark:text-purple-400',
    ring: 'ring-purple-500/20',
  },
  amber: {
    bg: 'bg-amber-500/10 dark:bg-amber-500/15',
    icon: 'text-amber-600 dark:text-amber-400',
    ring: 'ring-amber-500/20',
  },
} as const;

interface StatsCardsProps {
  stats: StatCard[];
}

export function StatsCards({ stats }: StatsCardsProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
      {stats.map((stat, index) => {
        const IconComponent = iconMap[stat.icon];
        const accent = accentStyles[stat.accent];

        return (
          <div
            key={stat.label}
            className="glass rounded-xl p-6 transition-smooth hover:-translate-y-0.5 hover:shadow-lg cursor-default group animate-fade-in"
            style={{ animationDelay: `${index * 100}ms`, animationFillMode: 'both' }}
          >
            {/* Icon */}
            <div className="flex items-center justify-between mb-4">
              <div className={`flex h-11 w-11 items-center justify-center rounded-xl ${accent.bg} ring-1 ${accent.ring}`}>
                <IconComponent className={`h-5 w-5 ${accent.icon}`} />
              </div>
              <div className="flex items-center gap-1 text-emerald-600 dark:text-emerald-400 text-sm font-medium">
                <TrendingUp className="h-3.5 w-3.5" />
                <span>+{stat.change}%</span>
              </div>
            </div>

            {/* Value */}
            <div className="space-y-1">
              <p className="text-3xl font-bold text-foreground tracking-tight">
                {stat.displayValue}
              </p>
              <p className="text-sm text-muted-foreground">{stat.label}</p>
            </div>

            {/* Subtle bottom decoration */}
            <div className="mt-4 h-1 w-full rounded-full bg-muted overflow-hidden">
              <div
                className={`h-full rounded-full transition-all duration-1000 ease-out ${
                  stat.accent === 'blue'
                    ? 'bg-blue-500'
                    : stat.accent === 'green'
                    ? 'bg-emerald-500'
                    : stat.accent === 'purple'
                    ? 'bg-purple-500'
                    : 'bg-amber-500'
                }`}
                style={{
                  width: `${Math.min(stat.change * 3, 100)}%`,
                  transitionDelay: `${index * 200 + 500}ms`,
                }}
              />
            </div>
          </div>
        );
      })}
    </div>
  );
}
