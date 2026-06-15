import { Configuration, PublicClientApplication } from '@azure/msal-browser';

const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string;
const tenantId = import.meta.env.VITE_AZURE_TENANT_ID as string;
const redirectUri = import.meta.env.VITE_AZURE_REDIRECT_URI as string;

export const isAzureADEnabled =
  import.meta.env.VITE_ENABLE_AZURE_AD === 'true';

export const msalConfig: Configuration = {
  auth: {
    clientId: clientId || 'placeholder-client-id',
    authority: `https://login.microsoftonline.com/${tenantId || 'common'}`,
    redirectUri: redirectUri || window.location.origin,
    postLogoutRedirectUri: redirectUri || window.location.origin,
    navigateToLoginRequestUrl: true,
  },
  cache: {
    cacheLocation: 'sessionStorage',
    storeAuthStateInCookie: false,
  },
};

export const msalInstance = isAzureADEnabled
  ? new PublicClientApplication(msalConfig)
  : (null as unknown as PublicClientApplication);

export const loginRequest = {
  scopes: ['User.Read', 'openid', 'profile'],
};
