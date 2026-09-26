import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  supplierSchema,
  type SupplierFormInput,
  type SupplierFormOutput,
} from "../schema/supplier.schema";
import type { Supplier } from "../types/supplier.type";
import { useSupplierCreate, useSupplierUpdate } from "./useSuppliers";

const EMPTY_VALUES: SupplierFormInput = {
  razao_social: "",
  nome_fantasia: "",
  cnpj: "",
  email: "",
  telefone: "",
  observacoes: "",
  ativo: true,
};

function toFormValues(supplier?: Supplier): SupplierFormInput {
  if (!supplier) return EMPTY_VALUES;

  return {
    razao_social: supplier.razao_social,
    nome_fantasia: supplier.nome_fantasia ?? "",
    cnpj: supplier.cnpj ?? "",
    email: supplier.email ?? "",
    telefone: supplier.telefone ?? "",
    observacoes: supplier.observacoes ?? "",
    ativo: supplier.ativo,
  };
}

export function useSupplierForm(supplier?: Supplier, onSaved?: () => void) {
  const createMutation = useSupplierCreate();
  const updateMutation = useSupplierUpdate();

  const form = useForm<SupplierFormInput, unknown, SupplierFormOutput>({
    resolver: zodResolver(supplierSchema),
    defaultValues: toFormValues(supplier),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (supplier) {
        await updateMutation.mutateAsync({
          id: supplier.id,
          payload: values,
        });
      } else {
        await createMutation.mutateAsync(values);
        form.reset(EMPTY_VALUES);
      }

      onSaved?.();
    } catch {
      // O erro ja foi exibido pelo toast da mutation; o modal continua aberto.
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
  };
}
