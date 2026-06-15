import {
  useQuery,
  UseQueryOptions,
  UseQueryResult,
  QueryKey,
} from '@tanstack/react-query';
import { AxiosRequestConfig } from 'axios';
import { apiClient } from '@/shared/lib/apiClient';

interface UseApiOptions<T> {
  queryKey: QueryKey;
  url: string;
  axiosConfig?: AxiosRequestConfig;
  queryOptions?: Omit<
    UseQueryOptions<T, Error, T, QueryKey>,
    'queryKey' | 'queryFn'
  >;
}

export function useApi<T>({
  queryKey,
  url,
  axiosConfig,
  queryOptions,
}: UseApiOptions<T>): UseQueryResult<T, Error> {
  return useQuery<T, Error, T, QueryKey>({
    queryKey,
    queryFn: async (): Promise<T> => {
      const response = await apiClient.get<T>(url, axiosConfig);
      return response.data;
    },
    ...queryOptions,
  });
}
