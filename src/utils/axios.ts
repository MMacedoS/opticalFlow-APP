import axios, { AxiosError, type InternalAxiosRequestConfig } from "axios";

import { useAuthStore } from "@/stores/auth.store";
import type { AuthResponseData } from "@/types/auth.types";
import { normalizeAuthSession } from "@/utils/authSession";

interface RetryRequestConfig extends InternalAxiosRequestConfig {
  _retry?: boolean;
}

interface RefreshResponse {
  status?: number;
  message?: string;
  data?: AuthResponseData;
  accessToken?: string;
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
    refresh_token: session.refreshToken,
  });

  const normalizedSession = normalizeAuthSession(
    response.data.data ?? { accessToken: response.data.accessToken },
    session,
  );

  if (!normalizedSession.accessToken) {
    throw new Error("Token de acesso ausente na resposta de refresh");
  }

  useAuthStore.getState().setSession(normalizedSession);

  return normalizedSession.accessToken;
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
