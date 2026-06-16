import axios from 'axios';
import { getSession } from 'next-auth/react';

const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || '',
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  async (config) => {
    try {
      const session: any = await getSession();
      if (session?.accessToken) {
        config.headers.Authorization = `Bearer ${session.accessToken}`;
      } else {
        // Mock mode — attach a dev token
        config.headers.Authorization = 'Bearer mock-token-dev';
      }
    } catch (error) {
      console.warn('Token acquisition failed, proceeding without auth:', error);
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
