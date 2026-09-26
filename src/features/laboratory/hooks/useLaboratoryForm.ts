import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";

import {
  laboratorySchema,
  type LaboratoryFormInput,
  type LaboratoryFormOutput,
} from "../schema/laboratory.schema";
import type { Laboratory } from "../types/laboratory.type";
import { useLaboratoryCreate, useLaboratoryUpdate } from "./useLaboratories";

const EMPTY_VALUES: LaboratoryFormInput = {
  nome: "",
  cnpj: "",
  email: "",
  telefone: "",
  ativo: true,
};

function toFormValues(laboratory?: Laboratory): LaboratoryFormInput {
  if (!laboratory) return EMPTY_VALUES;

  return {
    nome: laboratory.nome,
    cnpj: laboratory.cnpj ?? "",
    email: laboratory.email ?? "",
    telefone: laboratory.telefone ?? "",
    ativo: laboratory.ativo,
  };
}

export function useLaboratoryForm(
  laboratory?: Laboratory,
  onSaved?: () => void,
) {
  const createMutation = useLaboratoryCreate();
  const updateMutation = useLaboratoryUpdate();

  const form = useForm<LaboratoryFormInput, unknown, LaboratoryFormOutput>({
    resolver: zodResolver(laboratorySchema),
    defaultValues: toFormValues(laboratory),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (laboratory) {
        await updateMutation.mutateAsync({
          id: laboratory.id,
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
