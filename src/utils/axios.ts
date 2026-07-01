import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  accessToken: string;
}

const apiBaseUrl = import.meta.env.VITE_API_URL ?? "http://localhost:3333";

export const httpClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

const refreshClient = axios.create({
  baseURL: apiBaseUrl,
  timeout: 15000,
});

let isRefreshing = false;
let refreshPromise: Promise<string> | null = null;

const getAccessToken = () => useAuthStore.getState().session?.accessToken;

httpClient.interceptors.request.use((config) => {
  const token = getAccessToken();

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

const refreshAccessToken = async (): Promise<string> => {
  const session = useAuthStore.getState().session;

  if (!session?.refreshToken) {
    throw new Error("Refresh token ausente");
  }

  const response = await refreshClient.post<RefreshResponse>("/auth/refresh", {
    refreshToken: session.refreshToken,
  });

  useAuthStore.getState().setSession({
    ...session,
    accessToken: response.data.accessToken,
  });

  return response.data.accessToken;
};

httpClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as RetryRequestConfig | undefined;

    if (!originalRequest) {
      return Promise.reject(error);
    }

    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    try {
      if (!isRefreshing) {
        isRefreshing = true;
        refreshPromise = refreshAccessToken();
      }

      const newToken = await refreshPromise;
      originalRequest.headers.Authorization = `Bearer ${newToken}`;

      return httpClient(originalRequest);
    } catch (refreshError) {
      useAuthStore.getState().clearSession();
      return Promise.reject(refreshError);
    } finally {
      isRefreshing = false;
      refreshPromise = null;
    }
  },
);
