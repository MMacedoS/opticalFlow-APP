import { useForm } from "react-hook-form";
import type { CompanyFormValues } from "../types/company.types";
import { useCompanyCreate } from "./useCompanyCreate";
import { companySchema } from "../schema/company.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";

export function useCompanyForm() {
  const companyMutation = useCompanyCreate();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nome: "",
      cnpj: "",
      email: "",
      registroEstadual: undefined,
      registroMunicipal: undefined,
      website: undefined,
      status: "ATIVO",
    },
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.nome) return errors.nome.message;
    if (errors.cnpj) return errors.cnpj.message;
    if (errors.email) return errors.email.message;
    if (errors.website) return errors.website.message;
    if (errors.status) return errors.status.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await companyMutation.mutateAsync(values as CompanyFormValues);
      form.reset();
    } catch (error) {
      console.error(error);
    }
  });

  return {
    form,
    onSubmit,
    isPending: companyMutation.isPending,
    errorMessage,
  };
}
