'use client';

import { useAuth } from '@/context/AuthContext';
import { useCallback } from 'react';

interface FetchOptions extends RequestInit {
  skipAuth?: boolean;
}

export function useFetch() {
  const { token } = useAuth();

  const fetchWithAuth = useCallback(
    async (url: string, options: FetchOptions = {}) => {
      const { skipAuth = false, headers = {}, ...rest } = options;

      const finalHeaders = {
        'Content-Type': 'application/json',
        ...headers,
      } as Record<string, string>;

      if (!skipAuth && token) {
        finalHeaders.Authorization = `Bearer ${token}`;
      }

      const response = await fetch(url, {
        ...rest,
        headers: finalHeaders,
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.statusText}`);
      }

      return response.json();
    },
    [token]
  );

  return { fetchWithAuth };
}
