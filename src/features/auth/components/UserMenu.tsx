import * as DropdownMenu from '@radix-ui/react-dropdown-menu';
import { LogOut, Settings, User } from 'lucide-react';
import { useAuth } from '@/features/auth/hooks/useAuth';
import { cn } from '@/shared/lib/utils';

function getInitials(name: string): string {
  return name
    .split(' ')
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join('')
    .toUpperCase();
}

interface UserMenuProps {
  collapsed?: boolean;
}

export function UserMenu({ collapsed = false }: UserMenuProps) {
  const { user, logout } = useAuth();

  if (!user) return null;

  const initials = getInitials(user.displayName);

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger asChild>
        <button
          className={cn(
            'flex w-full items-center gap-3 rounded-xl p-2 text-left transition-smooth hover:bg-accent/50',
            collapsed && 'justify-center',
          )}
        >
          {/* Avatar */}
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white shadow-md">
            {initials}
          </div>

          {!collapsed && (
            <div className="min-w-0 flex-1">
              <p className="truncate text-sm font-medium text-foreground">
                {user.displayName}
              </p>
              <p className="truncate text-xs text-muted-foreground">
                {user.email}
              </p>
            </div>
          )}
        </button>
      </DropdownMenu.Trigger>

      <DropdownMenu.Portal>
        <DropdownMenu.Content
          side={collapsed ? 'right' : 'top'}
          align="start"
          sideOffset={8}
          className="glass z-50 min-w-[220px] animate-scale-in rounded-xl p-1.5 shadow-xl"
        >
          {/* User info header */}
          <div className="mb-1 border-b border-border/50 px-3 py-2.5">
            <p className="text-sm font-semibold text-foreground">
              {user.displayName}
            </p>
            <p className="text-xs text-muted-foreground">{user.email}</p>
          </div>

          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground outline-none transition-colors hover:bg-accent/60 focus:bg-accent/60">
            <User className="h-4 w-4 text-muted-foreground" />
            Profile
          </DropdownMenu.Item>

          <DropdownMenu.Item className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-foreground outline-none transition-colors hover:bg-accent/60 focus:bg-accent/60">
            <Settings className="h-4 w-4 text-muted-foreground" />
            Settings
          </DropdownMenu.Item>

          <DropdownMenu.Separator className="my-1.5 h-px bg-border/50" />

          <DropdownMenu.Item
            onSelect={() => void logout()}
            className="flex cursor-pointer items-center gap-2.5 rounded-lg px-3 py-2 text-sm text-destructive outline-none transition-colors hover:bg-destructive/10 focus:bg-destructive/10"
          >
            <LogOut className="h-4 w-4" />
            Sign out
          </DropdownMenu.Item>

          <DropdownMenu.Arrow className="fill-border/50" />
        </DropdownMenu.Content>
      </DropdownMenu.Portal>
    </DropdownMenu.Root>
  );
}
