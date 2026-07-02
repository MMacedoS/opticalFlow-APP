import { useMutation } from "@tanstack/react-query";

import { useAuthStore } from "@/stores/auth.store";
import { normalizeAuthSession } from "@/utils/authSession";

import { createLogin } from "../api/createLogin";
import type { LoginFormValues } from "../types/login.types";

export function useLogin() {
  const setSession = useAuthStore((state) => state.setSession);

  return useMutation({
    mutationFn: (payload: LoginFormValues) => createLogin(payload),
    onSuccess: (data) => {
      setSession(normalizeAuthSession(data.data));
    },
  });
}
