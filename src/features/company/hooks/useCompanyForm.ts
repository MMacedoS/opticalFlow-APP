import { useForm } from "react-hook-form";
import type { CompanyFormValues } from "../types/company.types";
import { useCompanyCreate } from "./useCompanyCreate";
import { companySchema } from "../schema/company.schema";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMemo } from "react";
import { useCompanyUpdate } from "./useCompanyUpdate";

export function useCompanyForm(initialDate?: CompanyFormValues) {
  const companyMutation = useCompanyCreate();
  const updateMutation = useCompanyUpdate();

  const form = useForm<z.infer<typeof companySchema>>({
    resolver: zodResolver(companySchema),
    defaultValues: {
      nome: "",
      razao: "",
      cnpj: "",
      email: "",
      registro_estadual: undefined,
      registro_municipal: undefined,
      website: undefined,
      enderecos: [],
      contatos: [],
    },
    values: initialDate,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.nome) return errors.nome.message;
    if (errors.cnpj) return errors.cnpj.message;
    if (errors.email) return errors.email.message;
    if (errors.website) return errors.website.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialDate) {
        await updateMutation.mutateAsync({
          id: initialDate.id,
          ...values,
        } as CompanyFormValues);
      }
      if (!initialDate) {
        await companyMutation.mutateAsync(values as CompanyFormValues);
        form.reset();
      }
    } catch (error) {
      console.error(error);
    }
  });

  return {
    form,
    onSubmit,
    isPending: companyMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
