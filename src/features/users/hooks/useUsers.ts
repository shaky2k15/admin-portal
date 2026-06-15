import { useState, useEffect, useMemo } from 'react';

export type UserRole = 'Admin' | 'Editor' | 'Viewer';
export type UserStatus = 'Active' | 'Inactive';

export interface User {
  id: string;
  name: string;
  initials: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  lastActive: string;
  avatarColor: string;
}

const mockUsers: User[] = [
  {
    id: '1',
    name: 'John Carter',
    initials: 'JC',
    email: 'john.carter@company.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '2 min ago',
    avatarColor: '#3b82f6',
  },
  {
    id: '2',
    name: 'Sarah Mitchell',
    initials: 'SM',
    email: 'sarah.mitchell@company.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '15 min ago',
    avatarColor: '#8b5cf6',
  },
  {
    id: '3',
    name: 'Mike Chen',
    initials: 'MC',
    email: 'mike.chen@company.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '1 hour ago',
    avatarColor: '#10b981',
  },
  {
    id: '4',
    name: 'Emily Rodriguez',
    initials: 'ER',
    email: 'emily.rodriguez@company.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '3 hours ago',
    avatarColor: '#f59e0b',
  },
  {
    id: '5',
    name: 'David Kim',
    initials: 'DK',
    email: 'david.kim@company.com',
    role: 'Editor',
    status: 'Inactive',
    lastActive: '2 days ago',
    avatarColor: '#ef4444',
  },
  {
    id: '6',
    name: 'Lisa Thompson',
    initials: 'LT',
    email: 'lisa.thompson@company.com',
    role: 'Viewer',
    status: 'Active',
    lastActive: '30 min ago',
    avatarColor: '#06b6d4',
  },
  {
    id: '7',
    name: 'Alex Park',
    initials: 'AP',
    email: 'alex.park@company.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '45 min ago',
    avatarColor: '#ec4899',
  },
  {
    id: '8',
    name: 'Rachel Green',
    initials: 'RG',
    email: 'rachel.green@company.com',
    role: 'Viewer',
    status: 'Inactive',
    lastActive: '5 days ago',
    avatarColor: '#14b8a6',
  },
  {
    id: '9',
    name: 'James Wilson',
    initials: 'JW',
    email: 'james.wilson@company.com',
    role: 'Admin',
    status: 'Active',
    lastActive: '10 min ago',
    avatarColor: '#6366f1',
  },
  {
    id: '10',
    name: 'Nina Patel',
    initials: 'NP',
    email: 'nina.patel@company.com',
    role: 'Editor',
    status: 'Active',
    lastActive: '1 hour ago',
    avatarColor: '#f97316',
  },
];

export function useUsers() {
  const [users] = useState<User[]>(mockUsers);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'All'>('All');

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 300);
    return () => clearTimeout(timer);
  }, []);

  const filteredUsers = useMemo(() => {
    return users.filter((user) => {
      const matchesSearch =
        searchQuery === '' ||
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase());

      const matchesRole = roleFilter === 'All' || user.role === roleFilter;

      return matchesSearch && matchesRole;
    });
  }, [users, searchQuery, roleFilter]);

  return {
    users: filteredUsers,
    allUsers: users,
    isLoading,
    searchQuery,
    setSearchQuery,
    roleFilter,
    setRoleFilter,
  };
}
