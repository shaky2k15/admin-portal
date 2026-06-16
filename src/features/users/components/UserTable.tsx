'use client';

import { Search, ChevronDown } from 'lucide-react';
import { useUsers } from '@/features/users/hooks/useUsers';
import type { UserRole } from '@/features/users/hooks/useUsers';
import { useState } from 'react';

const roleBadgeStyles: Record<UserRole, string> = {
  Admin: 'bg-blue-500/10 text-blue-700 dark:text-blue-300 ring-1 ring-blue-500/20',
  Editor: 'bg-purple-500/10 text-purple-700 dark:text-purple-300 ring-1 ring-purple-500/20',
  Viewer: 'bg-gray-500/10 text-gray-700 dark:text-gray-300 ring-1 ring-gray-500/20',
};

const roleFilterOptions: Array<UserRole | 'All'> = ['All', 'Admin', 'Editor', 'Viewer'];

export function UserTable() {
  const { users, isLoading, searchQuery, setSearchQuery, roleFilter, setRoleFilter } = useUsers();
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  return (
    <div className="glass rounded-xl overflow-hidden animate-fade-in" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
      {/* Toolbar */}
      <div className="p-4 md:p-6 border-b border-border/50">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Search */}
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Search by name or email..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 rounded-lg bg-background border border-input text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50 transition-smooth"
            />
          </div>

          {/* Role filter dropdown */}
          <div className="relative">
            <button
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
              className="flex h-10 items-center gap-2 rounded-lg border border-input bg-background px-4 text-sm font-medium text-foreground hover:bg-accent transition-smooth min-w-[140px]"
            >
              <span className="text-muted-foreground">Role:</span>
              <span>{roleFilter}</span>
              <ChevronDown className={`ml-auto h-4 w-4 text-muted-foreground transition-smooth ${isDropdownOpen ? 'rotate-180' : ''}`} />
            </button>
            {isDropdownOpen && (
              <>
                <div className="fixed inset-0 z-10" onClick={() => setIsDropdownOpen(false)} />
                <div className="absolute right-0 top-12 z-20 w-40 rounded-lg border border-border bg-card shadow-lg py-1 animate-scale-in">
                  {roleFilterOptions.map((role) => (
                    <button
                      key={role}
                      onClick={() => {
                        setRoleFilter(role);
                        setIsDropdownOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2 text-sm transition-smooth hover:bg-accent ${
                        roleFilter === role ? 'text-primary font-medium' : 'text-foreground'
                      }`}
                    >
                      {role}
                    </button>
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50">
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">User</th>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden md:table-cell">Email</th>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider">Role</th>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden sm:table-cell">Status</th>
              <th className="text-left px-4 md:px-6 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider hidden lg:table-cell">Last Active</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  Loading users...
                </td>
              </tr>
            ) : users.length === 0 ? (
              <tr>
                <td colSpan={5} className="px-6 py-12 text-center text-muted-foreground">
                  No users found matching your search.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr
                  key={user.id}
                  className="border-b border-border/30 last:border-0 transition-smooth hover:bg-accent/50 cursor-pointer"
                >
                  {/* User */}
                  <td className="px-4 md:px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div
                        className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full text-xs font-bold text-white"
                        style={{ backgroundColor: user.avatarColor }}
                      >
                        {user.initials}
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium text-foreground truncate">{user.name}</p>
                        <p className="text-xs text-muted-foreground truncate md:hidden">{user.email}</p>
                      </div>
                    </div>
                  </td>

                  {/* Email */}
                  <td className="px-4 md:px-6 py-4 hidden md:table-cell">
                    <span className="text-sm text-muted-foreground">{user.email}</span>
                  </td>

                  {/* Role */}
                  <td className="px-4 md:px-6 py-4">
                    <span className={`inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-medium ${roleBadgeStyles[user.role]}`}>
                      {user.role}
                    </span>
                  </td>

                  {/* Status */}
                  <td className="px-4 md:px-6 py-4 hidden sm:table-cell">
                    <div className="flex items-center gap-2">
                      <div className={`h-2 w-2 rounded-full ${user.status === 'Active' ? 'bg-emerald-500' : 'bg-gray-400'}`} />
                      <span className="text-sm text-muted-foreground">{user.status}</span>
                    </div>
                  </td>

                  {/* Last Active */}
                  <td className="px-4 md:px-6 py-4 hidden lg:table-cell">
                    <span className="text-sm text-muted-foreground">{user.lastActive}</span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Footer */}
      <div className="px-4 md:px-6 py-3 border-t border-border/50 flex items-center justify-between">
        <span className="text-xs text-muted-foreground">
          Showing {users.length} user{users.length !== 1 ? 's' : ''}
        </span>
        <div className="flex gap-1">
          <button className="h-8 w-8 flex items-center justify-center rounded-md text-sm text-muted-foreground hover:bg-accent transition-smooth" disabled>
            ←
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-md text-sm bg-primary text-primary-foreground font-medium">
            1
          </button>
          <button className="h-8 w-8 flex items-center justify-center rounded-md text-sm text-muted-foreground hover:bg-accent transition-smooth" disabled>
            →
          </button>
        </div>
      </div>
    </div>
  );
}
