import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { useScheduleCreate } from "./useScheduleCreate";
import { useScheduleUpdate } from "./useScheduleUpdate";
import {
  scheduleFormSchema,
  type ScheduleFormValues,
} from "../schema/scheduleSchema";

export function useScheduleForm(
  initialValues?: Partial<ScheduleFormValues>,
  onSuccess?: () => void,
) {
  const createMutation = useScheduleCreate();
  const updateMutation = useScheduleUpdate();

  const form = useForm<ScheduleFormValues>({
    resolver: zodResolver(scheduleFormSchema),
    defaultValues: {
      id: "",
      profissionalId: "",
      pessoaId: "",
      dataHora: new Date().toISOString(),
      duracaoMin: 30,
      status: "agendado",
      observacao: "",
      ...initialValues,
    },
    // Handles undefined gracefully while satisfying the typed contract
    values: initialValues ? (initialValues as ScheduleFormValues) : undefined,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.profissionalId) return errors.profissionalId.message;
    if (errors.pessoaId) return errors.pessoaId.message;
    if (errors.dataHora) return errors.dataHora.message;
    if (errors.duracaoMin) return errors.duracaoMin.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues?.id) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...values,
        } as ScheduleFormValues);
      } else {
        await createMutation.mutateAsync(values as ScheduleFormValues);
        form.reset();
      }
      if (onSuccess) onSuccess();
    } catch (error) {
      console.error("Erro ao salvar agendamento:", error);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
