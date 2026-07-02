import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import type { AuthSession } from "@/types/auth.types";

function withSessionDefaults(session: AuthSession | null): AuthSession | null {
  if (!session) {
    return null;
  }

  return {
    ...session,
    acessos: session.acessos ?? [],
    permissoes: session.permissoes ?? [],
  };
}

interface AuthState {
  session: AuthSession | null;
  hasHydrated: boolean;
  setSession: (session: AuthSession) => void;
  clearSession: () => void;
  setHasHydrated: (hydrated: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      session: null,
      hasHydrated: false,
      setSession: (session) => set({ session: withSessionDefaults(session) }),
      clearSession: () => set({ session: null }),
      setHasHydrated: (hydrated) => set({ hasHydrated: hydrated }),
    }),
    {
      name: "opticaflow-auth-session",
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        session: state.session,
      }),
      migrate: (persistedState: unknown) => {
        const state = persistedState as AuthState;

        return {
          ...state,
          session: withSessionDefaults(state?.session ?? null),
        };
      },
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true);
      },
    },
  ),
);
