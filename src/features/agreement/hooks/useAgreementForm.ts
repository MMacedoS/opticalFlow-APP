import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { AgreementFormValues } from "../types/agreement.type";
import { useAgreementCreate } from "./useAgreementCreate";
import { useAgreementUpdate } from "./useAgreementUpdate";
import { agreementSchema } from "../schema/agreement.schema";

export function useAgreementForm(initialValues?: AgreementFormValues) {
  const createMutation = useAgreementCreate();
  const updateMutation = useAgreementUpdate();

  const form = useForm<z.infer<typeof agreementSchema>>({
    resolver: zodResolver(agreementSchema),
    defaultValues: initialValues || {
      nome: "",
      registro: "",
      ativo: "ativo",
    },
    values: initialValues,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.nome) return errors.nome.message;
    if (errors.registro) return errors.registro.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...values,
        } as AgreementFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as AgreementFormValues);
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
