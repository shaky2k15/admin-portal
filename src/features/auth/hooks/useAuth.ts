'use client';

import { useSession, signIn, signOut } from 'next-auth/react';
import type { AuthUser } from '@/features/auth/types';

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  const { data: session, status } = useSession();

  const user = session?.user ? {
    id: session.user.email || '',
    displayName: session.user.name || '',
    email: session.user.email || '',
    roles: [],
  } : null;

  return {
    user,
    isAuthenticated: status === 'authenticated',
    isLoading: status === 'loading',
    login: async (username?: string, password?: string) => {
      if (username && password) {
        const result = await signIn('credentials', { username, password, redirect: false });
        if (result?.error) throw new Error(result.error);
      } else {
        await signIn('azure-ad', { callbackUrl: '/dashboard' });
      }
    },
    logout: async () => { await signOut({ callbackUrl: '/' }); },
  };
}
