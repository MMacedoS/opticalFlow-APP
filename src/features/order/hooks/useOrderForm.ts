import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { z } from "zod";
import type { OrderFormValues } from "../types/Order.type";
import { OrderFormSchema } from "../schema/Order.schema";
import { useOrderCreate } from "./useOrderCreate";
import { useOrderUpdate } from "./useOrderUpdate";

type OrderInputType = z.input<typeof OrderFormSchema>;

export function useOrderForm(
  initialValues?: Partial<OrderFormValues>,
  onSuccess?: () => void,
) {
  const createMutation = useOrderCreate();
  const updateMutation = useOrderUpdate();

  const mergedValues = useMemo<OrderInputType | undefined>(() => {
    if (!initialValues) return undefined;

    return {
      id: initialValues.id ?? "",
      profissionalId: initialValues.profissionalId ?? "",
      pacienteId: initialValues.pacienteId ?? "",
      dataAtendimento:
        initialValues.dataAtendimento ?? new Date().toISOString(),
      status: initialValues.status ?? "agendado",
      observacao: initialValues.observacoes ?? "",
      temResponsavel: initialValues.temResponsavel ?? false,
      clienteId: initialValues.clienteId ?? null,
      convenioId: initialValues.convenioId ?? null,
      queixa_principal: initialValues.queixa_principal ?? null,

      ordemServico: {
        status: initialValues.ordemServico?.status ?? "orcamento",
        descricao: initialValues.ordemServico?.descricao ?? "",
        valor_total: initialValues.ordemServico?.valor_total ?? 0,
        itens: Array.isArray(initialValues.ordemServico?.itens)
          ? initialValues.ordemServico.itens
          : [],
      },
    } as OrderInputType;
  }, [initialValues]);

  const form = useForm<OrderInputType>({
    resolver: zodResolver(OrderFormSchema),
    values: mergedValues,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.profissionalId) return errors.profissionalId?.message;
    if (errors.pacienteId) return errors.pacienteId?.message;
    if (errors.dataAtendimento) return errors.dataAtendimento?.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const formValues = values as unknown as OrderFormValues;

      if (initialValues?.id) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...formValues,
        });
      } else {
        await createMutation.mutateAsync(formValues);
        form.reset();
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao salvar atendimento:", error);
    }
  });

  return {
    form: form as unknown as ReturnType<typeof useForm<OrderFormValues>>,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
