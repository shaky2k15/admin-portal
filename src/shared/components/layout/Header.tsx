'use client';

import { usePathname } from 'next/navigation';
import { Bell, Moon, Sun } from 'lucide-react';
import { useTheme } from '@/app/providers/ThemeProvider';
import { features } from '@/features';
import { cn } from '@/shared/lib/utils';

interface HeaderProps {
  className?: string;
}

export function Header({ className }: HeaderProps) {
  const pathname = usePathname();
  const { theme, toggleTheme } = useTheme();

  // Derive page title from current feature
  const currentFeature = features.find(
    (f) =>
      pathname === f.path ||
      pathname.startsWith(`${f.path}/`),
  );
  const pageTitle = currentFeature?.label ?? 'Dashboard';

  // Build breadcrumb segments
  const pathSegments = pathname
    .split('/')
    .filter(Boolean);

  return (
    <header
      className={cn(
        'glass sticky top-0 z-30 flex h-16 shrink-0 items-center justify-between border-b border-border/50 px-6',
        className,
      )}
    >
      {/* Left: Title + Breadcrumbs */}
      <div className="flex flex-col">
        <h1 className="text-lg font-semibold text-foreground">{pageTitle}</h1>
        <nav className="flex items-center gap-1 text-xs text-muted-foreground">
          <span>Home</span>
          {pathSegments.map((segment, index) => (
            <span key={index} className="flex items-center gap-1">
              <span className="mx-1 text-border">/</span>
              <span
                className={cn(
                  index === pathSegments.length - 1 && 'text-foreground',
                )}
              >
                {segment.charAt(0).toUpperCase() + segment.slice(1)}
              </span>
            </span>
          ))}
        </nav>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-1">
        {/* Notification bell */}
        <button className="relative flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-smooth hover:bg-accent/50 hover:text-foreground">
          <Bell className="h-[18px] w-[18px]" />
          <span className="absolute right-2 top-2 h-2 w-2 rounded-full bg-primary shadow-sm shadow-primary/50" />
        </button>

        {/* Theme toggle */}
        <button
          onClick={toggleTheme}
          className="flex h-9 w-9 items-center justify-center rounded-xl text-muted-foreground transition-smooth hover:bg-accent/50 hover:text-foreground"
          aria-label="Toggle theme"
        >
          {theme === 'dark' ? (
            <Sun className="h-[18px] w-[18px]" />
          ) : (
            <Moon className="h-[18px] w-[18px]" />
          )}
        </button>
      </div>
    </header>
  );
}
