import { ReactNode } from 'react';
import { MsalProvider } from '@azure/msal-react';
import {
  isAzureADEnabled,
  msalInstance,
} from '@/features/auth/config/msalConfig';

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  if (isAzureADEnabled) {
    return <MsalProvider instance={msalInstance}>{children}</MsalProvider>;
  }

  return <>{children}</>;
}
