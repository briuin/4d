import { useState, useRef, useCallback } from 'react';
import axios, { AxiosRequestConfig, CancelTokenSource } from 'axios';

interface UseAxiosResult<T> {
  request: (url: string, options?: AxiosRequestConfig) => Promise<{ data: T | null, error: Error | null, loading: boolean }>;
}

const useAxios = <T>(): UseAxiosResult<T> => {
  const requestRef = useRef<CancelTokenSource | null>(null);

  const request = useCallback(async (url: string, options: AxiosRequestConfig = {}): Promise<{ data: T | null, error: Error | null, loading: boolean }> => {
    const source = axios.CancelToken.source();
    let loading = true;
    let data: T | null = null;
    let error: Error | null = null;

    try {
      if (requestRef.current) {
        requestRef.current.cancel();
      }
      requestRef.current = source;

      const response = await axios({
        url,
        cancelToken: source.token,
        ...options,
      });
      data = response.data;
    } catch (err) {
      if (!axios.isCancel(err)) {
        error = err as Error;
      }
    } finally {
      loading = false;
    }

    return { data, error, loading };
  }, []);

  return { request };
};

export default useAxios;
