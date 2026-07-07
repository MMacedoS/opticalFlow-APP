import { branchSchema } from "./../schema/branch.schema";
import type { BranchFormValues } from "../types/branch.type";
import { useBranchCreate } from "./useBranchCreate";
import { useBranchUpdate } from "./useBranchUpdate";
import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";

export function useBranchForm(initialValues?: BranchFormValues) {
  const createMutation = useBranchCreate();
  const updateMutation = useBranchUpdate();

  const form = useForm<z.infer<typeof branchSchema>>({
    resolver: zodResolver(branchSchema),
    defaultValues: initialValues || {
      nome: "",
      cnpj: "",
      pessoa: {
        id: "",
        nome: "",
        cpf: "",
        email: "",
        status: "ativo",
      },
      enderecos: [],
      contatos: [],
    },
    values: initialValues,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.nome) return errors.nome.message;
    if (errors.cnpj) return errors.cnpj.message;
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
        } as BranchFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as BranchFormValues);
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
