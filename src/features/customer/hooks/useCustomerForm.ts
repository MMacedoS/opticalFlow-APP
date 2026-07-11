import { customerSchema } from "../schema/customer.schema";
import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { CustomerFormValues } from "../types/customer.type";
import { useCustomerCreate } from "./useCustomerCreate";
import { useCustomerUpdate } from "./useCustomerUpdate";

export function useCustomerForm(initialValues?: CustomerFormValues) {
  const createMutation = useCustomerCreate();
  const updateMutation = useCustomerUpdate();

  const form = useForm<z.infer<typeof customerSchema>>({
    resolver: zodResolver(customerSchema),
    defaultValues: initialValues || {
      status: "ativo",
      pessoa: {
        id: "",
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
        } as CustomerFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as CustomerFormValues);
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
