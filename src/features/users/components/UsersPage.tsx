import { UserPlus } from 'lucide-react';
import { UserTable } from '@/features/users/components/UserTable';

export default function UsersPage() {
  return (
    <div className="space-y-6 md:space-y-8 animate-fade-in">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-foreground">Team Members</h1>
          <p className="text-muted-foreground mt-1 text-sm md:text-base">
            Manage your team and their account permissions here.
          </p>
        </div>
        <button className="inline-flex items-center gap-2 h-10 px-5 rounded-lg bg-primary text-primary-foreground text-sm font-medium hover:bg-primary/90 transition-smooth shadow-sm hover:shadow-md self-start sm:self-auto">
          <UserPlus className="h-4 w-4" />
          Invite User
        </button>
      </div>

      {/* Table */}
      <UserTable />
    </div>
  );
}
