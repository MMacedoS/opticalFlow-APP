import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { OphthalmologistFormValues } from "../types/ophthalmologist.interface";
import { useOphthalmologistCreate } from "./useOphthalmologistCreate";
import { useOphthalmologistUpdate } from "./useOphthalmologistUpdate";
import { ophthalmologistSchema } from "../schema/ophthalmologist.schema";

export function useOphthalmologistForm(
  initialValues?: OphthalmologistFormValues,
) {
  const createMutation = useOphthalmologistCreate();
  const updateMutation = useOphthalmologistUpdate();

  const form = useForm<z.infer<typeof ophthalmologistSchema>>({
    resolver: zodResolver(ophthalmologistSchema),
    defaultValues: initialValues || {
      status: "ativo",
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
        } as OphthalmologistFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as OphthalmologistFormValues);
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
