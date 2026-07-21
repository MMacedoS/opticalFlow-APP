import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { PeopleFormValues } from "../types/people.type";
import { usePeopleUpdate } from "./usePeopleUpdate";
import { usePeopleCreate } from "./usePeopleCreate";
import { personSchema } from "../schema/people.schema";

export function usePeopleForm(initialValues?: PeopleFormValues) {
  const createMutation = usePeopleCreate();
  const updateMutation = usePeopleUpdate();

  const form = useForm<z.infer<typeof personSchema>>({
    resolver: zodResolver(personSchema),
    defaultValues: initialValues || {
      id: "",
      nome: "",
      cpf: "",
      email: "",
      status: "ativo",
    },
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.nome) return errors.nome.message;
    if (errors.cpf) return errors.cpf.message;
    if (errors.email) return errors.email.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...values,
        } as PeopleFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as PeopleFormValues);
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
