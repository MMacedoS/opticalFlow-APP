import { useMemo } from "react";

import { zodResolver } from "@hookform/resolvers/zod";
import { AxiosError } from "axios";
import { useForm } from "react-hook-form";

import { loginSchema } from "../schemas/login.schema";
import type { LoginFormValues } from "../types/login.types";
import { useLogin } from "./useLogin";

interface ApiError {
  message?: string;
}

export function useLoginForm() {
  const loginMutation = useLogin();

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      senha: "",
    },
  });

  const errorMessage = useMemo(() => {
    if (!loginMutation.error) {
      return undefined;
    }

    if (loginMutation.error instanceof AxiosError) {
      return (
        (loginMutation.error.response?.data as ApiError | undefined)?.message ??
        "Não foi possível autenticar"
      );
    }

    return "Não foi possível autenticar";
  }, [loginMutation.error]);

  const onSubmit = form.handleSubmit(async (values) => {
    await loginMutation.mutateAsync(values);
  });

  return {
    form,
    onSubmit,
    isPending: loginMutation.isPending,
    errorMessage,
  };
}
