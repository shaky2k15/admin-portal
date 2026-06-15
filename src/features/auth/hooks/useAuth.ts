import { useMsal, useIsAuthenticated } from '@azure/msal-react';
import { useCallback, useMemo } from 'react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  isAzureADEnabled,
  loginRequest,
} from '@/features/auth/config/msalConfig';
import { MOCK_CREDENTIALS, MOCK_USER } from '@/features/auth/config/mockAuth';
import type { AuthUser } from '@/features/auth/types';
import { InteractionStatus } from '@azure/msal-browser';

// ─── Mock auth store (used when Azure AD is disabled) ────────────────────────

interface MockAuthState {
  user: AuthUser | null;
  setUser: (user: AuthUser | null) => void;
}

const useMockAuthStore = create<MockAuthState>()(
  persist(
    (set) => ({
      user: null,
      setUser: (user) => set({ user }),
    }),
    { name: 'admin-portal-mock-auth' },
  ),
);

// ─── Mock auth hook ──────────────────────────────────────────────────────────

function useMockAuth() {
  const { user, setUser } = useMockAuthStore();

  const login = useCallback(
    async (username?: string, password?: string) => {
      if (
        username === MOCK_CREDENTIALS.username &&
        password === MOCK_CREDENTIALS.password
      ) {
        setUser(MOCK_USER);
      } else {
        throw new Error('Invalid credentials');
      }
    },
    [setUser],
  );

  const logout = useCallback(async () => {
    setUser(null);
  }, [setUser]);

  return {
    user,
    isAuthenticated: user !== null,
    isLoading: false,
    login,
    logout,
  };
}

// ─── Azure AD auth hook ──────────────────────────────────────────────────────

function useAzureAuth() {
  const { instance, accounts, inProgress } = useMsal();
  const isAuthenticated = useIsAuthenticated();

  const isLoading = inProgress !== InteractionStatus.None;

  const user = useMemo((): AuthUser | null => {
    const account = accounts[0];
    if (!account) return null;

    return {
      id: account.localAccountId,
      displayName: account.name ?? account.username,
      email: account.username,
      roles: (account.idTokenClaims?.roles as string[] | undefined) ?? [],
    };
  }, [accounts]);

  const login = useCallback(
    async (_username?: string, _password?: string) => {
      try {
        await instance.loginRedirect(loginRequest);
      } catch (error) {
        console.error('Login failed:', error);
      }
    },
    [instance],
  );

  const logout = useCallback(async () => {
    try {
      await instance.logoutRedirect({
        postLogoutRedirectUri: import.meta.env
          .VITE_AZURE_REDIRECT_URI as string,
      });
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }, [instance]);

  return {
    user,
    isAuthenticated,
    isLoading,
    login,
    logout,
  };
}

// ─── Unified hook ────────────────────────────────────────────────────────────

export interface UseAuthReturn {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (username?: string, password?: string) => Promise<void>;
  logout: () => Promise<void>;
}

export function useAuth(): UseAuthReturn {
  /* eslint-disable react-hooks/rules-of-hooks */
  // Safe: isAzureADEnabled is a module-level constant — the branch never changes at runtime.
  if (isAzureADEnabled) {
    return useAzureAuth();
  }
  return useMockAuth();
  /* eslint-enable react-hooks/rules-of-hooks */
}
