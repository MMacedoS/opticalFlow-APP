import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { EmployeeFormValues } from "../types/employee.interface";
import { useEmployeeCreate } from "./useEmployeeCreate";
import { useEmployeeUpdate } from "./useEmployeeUpdate";
import { employeeSchema } from "../schema/employee.schema";

export function useEmployeeForm(initialValues?: EmployeeFormValues) {
  const createMutation = useEmployeeCreate();
  const updateMutation = useEmployeeUpdate();

  const form = useForm<z.infer<typeof employeeSchema>>({
    resolver: zodResolver(employeeSchema),
    defaultValues: initialValues || {
      status: "ativo",
      cargo: "",
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
        } as EmployeeFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as EmployeeFormValues);
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
