import axios from 'axios';
import {
  isAzureADEnabled,
  msalInstance,
} from '@/features/auth/config/msalConfig';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL as string,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    if (isAzureADEnabled) {
      const accounts = msalInstance.getAllAccounts();

      if (accounts.length > 0) {
        try {
          const clientId = import.meta.env.VITE_AZURE_CLIENT_ID as string;
          const response = await msalInstance.acquireTokenSilent({
            scopes: [`api://${clientId}/.default`],
            account: accounts[0],
          });

          config.headers.Authorization = `Bearer ${response.accessToken}`;
        } catch (error) {
          console.warn(
            'Token acquisition failed, proceeding without auth:',
            error,
          );
        }
      }
    } else {
      // Mock mode — attach a dev token
      config.headers.Authorization = 'Bearer mock-token-dev';
    }

    return config;
  },
  (error) => Promise.reject(error),
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response?.status === 401) {
      console.warn('Received 401 — session may have expired.');
    }
    return Promise.reject(error);
  },
);

export { apiClient };
