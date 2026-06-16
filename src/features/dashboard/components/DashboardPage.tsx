'use client';

import { WelcomeBanner } from '@/features/dashboard/components/WelcomeBanner';
import { StatsCards } from '@/features/dashboard/components/StatsCards';
import { RecentActivity } from '@/features/dashboard/components/RecentActivity';
import { useDashboardStats } from '@/features/dashboard/hooks/useDashboardStats';
import { Loader2 } from 'lucide-react';

export default function DashboardPage() {
  const { data, isLoading } = useDashboardStats();

  if (isLoading || !data) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const statsArray = [
    data.stats.totalUsers,
    data.stats.activeProjects,
    data.stats.deployments,
    data.stats.uptime,
  ];

  return (
    <div className="space-y-6 md:space-y-8">
      {/* Full-width welcome banner */}
      <WelcomeBanner userName={data.userName} />

      {/* 4-column stats grid */}
      <StatsCards stats={statsArray} />

      {/* Activity + optional second panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <RecentActivity activities={data.activity} />
        </div>

        {/* Quick actions panel */}
        <div className="glass rounded-xl p-6 animate-fade-in" style={{ animationDelay: '500ms', animationFillMode: 'both' }}>
          <h2 className="text-lg font-semibold text-foreground mb-4">Quick Actions</h2>
          <div className="space-y-3">
            {[
              { label: 'Deploy to Production', emoji: '🚀', desc: 'Push latest changes live' },
              { label: 'Create New Project', emoji: '📁', desc: 'Start a fresh workspace' },
              { label: 'Invite Team Member', emoji: '👥', desc: 'Add collaborators to your team' },
              { label: 'View Reports', emoji: '📊', desc: 'Check performance metrics' },
            ].map((action) => (
              <button
                key={action.label}
                className="w-full flex items-center gap-3 rounded-lg p-3 text-left transition-smooth hover:bg-accent group"
              >
                <span className="text-xl flex-shrink-0 group-hover:scale-110 transition-smooth">{action.emoji}</span>
                <div className="min-w-0">
                  <p className="text-sm font-medium text-foreground truncate">{action.label}</p>
                  <p className="text-xs text-muted-foreground truncate">{action.desc}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
