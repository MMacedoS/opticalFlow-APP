import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useScheduleCreate } from "./useScheduleCreate";
import { useScheduleUpdate } from "./useScheduleUpdate";
import {
  scheduleFormSchema,
  type ScheduleFormValues,
} from "../schema/scheduleSchema";
import { z } from "zod";

type ScheduleInputType = z.input<typeof scheduleFormSchema>;

export function useScheduleForm(
  initialValues?: Partial<ScheduleFormValues>,
  onSuccess?: () => void,
) {
  const createMutation = useScheduleCreate();
  const updateMutation = useScheduleUpdate();

  const mergedValues = useMemo<ScheduleInputType | undefined>(() => {
    if (!initialValues) return undefined;

    return {
      id: initialValues.id ?? "",
      profissionalId: initialValues.profissionalId ?? "",
      pessoaId: initialValues.pessoaId ?? "",
      dataHora: initialValues.dataHora ?? new Date().toISOString(),
      duracaoMin: initialValues.duracaoMin ?? 30,
      status: initialValues.status ?? "agendado",
      observacao: initialValues.observacao ?? "",
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
    } as ScheduleInputType;
  }, [initialValues]);

  const form = useForm<ScheduleInputType>({
    resolver: zodResolver(scheduleFormSchema),
    values: mergedValues,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.profissionalId) return errors.profissionalId?.message;
    if (errors.pessoaId) return errors.pessoaId?.message;
    if (errors.dataHora) return errors.dataHora?.message;
    if (errors.duracaoMin) return errors.duracaoMin?.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      const formValues = values as unknown as ScheduleFormValues;

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
      console.error("Erro ao salvar agendamento:", error);
    }
  });

  return {
    form: form as unknown as ReturnType<typeof useForm<ScheduleFormValues>>,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
