import { useMemo } from "react";
import { useForm } from "react-hook-form";
import type z from "zod/v4";
import type { UserFormValues } from "../types/user.types";
import { useUserCreate } from "./useUserCreate";
import { useUserUpdate } from "./useUserUpdate";
import { userSchema } from "../schema/user.schema";
import { zodResolver } from "@hookform/resolvers/zod";

export function useUserForm(initialValues?: UserFormValues) {
  const createMutation = useUserCreate();
  const updateMutation = useUserUpdate();

  const form = useForm<z.infer<typeof userSchema>>({
    resolver: zodResolver(userSchema),
    defaultValues: {
      username: "",
      email: "",
      status: "ativo",
      senha: "",
    },
    values: initialValues,
  });

  const errorMessage = useMemo(() => {
    const erros = form.formState.errors;
    if (erros.username) {
      return erros.username.message;
    }
    if (erros.email) {
      return erros.email.message;
    }
    if (erros.status) {
      return erros.status.message;
    }
    if (erros.senha) {
      return erros.senha.message;
    }
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...values,
        } as UserFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as UserFormValues);
        form.reset();
      }
    } catch (error) {
      console.error(error);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
