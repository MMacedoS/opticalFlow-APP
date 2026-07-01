import { create } from "zustand";

export interface AuthUser {
  id: string;
  name: string;
  email: string;
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
}

interface AuthState {
  session: AuthSession | null;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  session: null,
  setSession: (session) => set({ session }),
  clearSession: () => set({ session: null }),
}));
