import { useLocation, Link } from 'react-router-dom';
import * as Tooltip from '@radix-ui/react-tooltip';
import { PanelLeftClose, PanelLeftOpen } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { features } from '@/features';
import { UserMenu } from '@/features/auth/components/UserMenu';
import { cn } from '@/shared/lib/utils';

interface SidebarState {
  expanded: boolean;
  toggleSidebar: () => void;
  setExpanded: (expanded: boolean) => void;
}

export const useSidebar = create<SidebarState>()(
  persist(
    (set) => ({
      expanded: true,
      toggleSidebar: () => set((state) => ({ expanded: !state.expanded })),
      setExpanded: (expanded: boolean) => set({ expanded }),
    }),
    {
      name: 'admin-portal-sidebar',
    },
  ),
);

export function Sidebar() {
  const location = useLocation();
  const { expanded, toggleSidebar } = useSidebar();

  return (
    <Tooltip.Provider delayDuration={300}>
      <aside
        className={cn(
          'glass fixed left-0 top-0 z-40 flex h-screen flex-col border-r border-border/50 transition-all duration-300 ease-in-out',
          expanded ? 'w-[280px]' : 'w-[72px]',
        )}
      >
        {/* Logo / Portal name */}
        <div className="flex h-16 shrink-0 items-center gap-3 border-b border-border/50 px-4">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 shadow-md shadow-blue-500/20">
            <span className="text-sm font-bold text-white">AP</span>
          </div>
          {expanded && (
            <span className="gradient-text truncate text-lg font-bold tracking-tight">
              Admin Portal
            </span>
          )}
        </div>

        {/* Navigation */}
        <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
          {features.map((feature) => {
            const isActive =
              location.pathname === feature.path ||
              location.pathname.startsWith(`${feature.path}/`);
            const Icon = feature.icon;

            const navItem = (
              <Link
                key={feature.id}
                to={feature.path}
                className={cn(
                  'group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-all duration-200',
                  isActive
                    ? 'bg-primary/10 text-primary shadow-sm'
                    : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  !expanded && 'justify-center px-0',
                )}
              >
                <Icon
                  className={cn(
                    'h-5 w-5 shrink-0 transition-colors',
                    isActive
                      ? 'text-primary'
                      : 'text-muted-foreground group-hover:text-foreground',
                  )}
                />
                {expanded && (
                  <span className="truncate">{feature.label}</span>
                )}
                {expanded && feature.badge && (
                  <span className="ml-auto rounded-full bg-primary/15 px-2 py-0.5 text-[10px] font-semibold text-primary">
                    {feature.badge}
                  </span>
                )}

                {/* Active indicator */}
                {isActive && (
                  <div className="absolute left-0 h-6 w-1 rounded-r-full bg-primary" />
                )}
              </Link>
            );

            if (!expanded) {
              return (
                <Tooltip.Root key={feature.id}>
                  <Tooltip.Trigger asChild>{navItem}</Tooltip.Trigger>
                  <Tooltip.Portal>
                    <Tooltip.Content
                      side="right"
                      sideOffset={12}
                      className="glass z-50 animate-scale-in rounded-lg px-3 py-1.5 text-sm font-medium text-foreground shadow-lg"
                    >
                      {feature.label}
                      <Tooltip.Arrow className="fill-border/50" />
                    </Tooltip.Content>
                  </Tooltip.Portal>
                </Tooltip.Root>
              );
            }

            return navItem;
          })}
        </nav>

        {/* Bottom section: UserMenu + collapse toggle */}
        <div className="border-t border-border/50 px-3 py-3">
          <UserMenu collapsed={!expanded} />

          <button
            onClick={toggleSidebar}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-xl p-2 text-sm text-muted-foreground transition-smooth hover:bg-accent/50 hover:text-foreground"
          >
            {expanded ? (
              <>
                <PanelLeftClose className="h-4 w-4" />
                <span className="text-xs">Collapse</span>
              </>
            ) : (
              <PanelLeftOpen className="h-4 w-4" />
            )}
          </button>
        </div>
      </aside>
    </Tooltip.Provider>
  );
}
