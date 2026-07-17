import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { OptometristFormValues } from "../types/optometrist.interface";
import { useOptometristCreate } from "./useOptometristCreate";
import { useOptometristUpdate } from "./useOptometristUpdate";
import { optometristSchema } from "../schema/optometrist.schema";

export function useOptometristForm(initialValues?: OptometristFormValues) {
  const createMutation = useOptometristCreate();
  const updateMutation = useOptometristUpdate();

  const form = useForm<z.infer<typeof optometristSchema>>({
    resolver: zodResolver(optometristSchema),
    defaultValues: initialValues || {
      registro_profissional: "",
      pessoa: {
        nome: "",
        cpf: "",
        email: "",
        status: "ativo",
      },
    },
    values: initialValues,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.pessoa) {
      const pessoaErrors = errors.pessoa;
      if (pessoaErrors.nome) return pessoaErrors.nome.message;
      if (pessoaErrors.cpf) return pessoaErrors.cpf.message;
      if (pessoaErrors.email) return pessoaErrors.email.message;
    }
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...values,
        } as OptometristFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as OptometristFormValues);
        form.reset();
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
