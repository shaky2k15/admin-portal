import { Search, Filter, MoreHorizontal, UserPlus } from 'lucide-react';

const mockUsers = [
  { id: '1', name: 'Alice Johnson', email: 'alice@example.com', role: 'Admin', status: 'Active' },
  { id: '2', name: 'Bob Williams', email: 'bob@example.com', role: 'Editor', status: 'Active' },
  { id: '3', name: 'Carol Davis', email: 'carol@example.com', role: 'Viewer', status: 'Inactive' },
  { id: '4', name: 'Dan Brown', email: 'dan@example.com', role: 'Editor', status: 'Active' },
  { id: '5', name: 'Eve Martinez', email: 'eve@example.com', role: 'Admin', status: 'Active' },
];

const statusColors: Record<string, string> = {
  Active: 'bg-emerald-500/10 text-emerald-500',
  Inactive: 'bg-muted text-muted-foreground',
};

export default function UsersPage() {
  return (
    <div className="animate-fade-in space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Users</h2>
          <p className="text-muted-foreground">
            Manage users and their permissions.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 rounded-xl bg-primary px-4 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-all duration-200 hover:bg-primary/90 hover:shadow-md active:scale-[0.98]">
          <UserPlus className="h-4 w-4" />
          Add User
        </button>
      </div>

      {/* Search + Filters */}
      <div className="flex items-center gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search users…"
            className="h-10 w-full rounded-xl border border-border bg-card pl-10 pr-4 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring/50"
          />
        </div>
        <button className="inline-flex h-10 items-center gap-2 rounded-xl border border-border bg-card px-4 text-sm font-medium text-foreground transition-smooth hover:bg-accent/50">
          <Filter className="h-4 w-4" />
          Filters
        </button>
      </div>

      {/* Users table */}
      <div className="overflow-hidden rounded-2xl border border-border/50 bg-card shadow-sm">
        <table className="w-full">
          <thead>
            <tr className="border-b border-border/50 bg-muted/30">
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Name
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Email
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Role
              </th>
              <th className="px-5 py-3 text-left text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                Status
              </th>
              <th className="w-12 px-5 py-3" />
            </tr>
          </thead>
          <tbody className="divide-y divide-border/30">
            {mockUsers.map((user) => (
              <tr
                key={user.id}
                className="transition-colors hover:bg-muted/20"
              >
                <td className="px-5 py-3.5">
                  <div className="flex items-center gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-purple-600 text-xs font-bold text-white">
                      {user.name.charAt(0)}
                    </div>
                    <span className="text-sm font-medium text-foreground">
                      {user.name}
                    </span>
                  </div>
                </td>
                <td className="px-5 py-3.5 text-sm text-muted-foreground">
                  {user.email}
                </td>
                <td className="px-5 py-3.5 text-sm text-foreground">
                  {user.role}
                </td>
                <td className="px-5 py-3.5">
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${statusColors[user.status] ?? ''}`}
                  >
                    {user.status}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  <button className="flex h-8 w-8 items-center justify-center rounded-lg text-muted-foreground transition-smooth hover:bg-accent/50 hover:text-foreground">
                    <MoreHorizontal className="h-4 w-4" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
