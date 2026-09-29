import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { z } from "zod";
import type { AppointmentFormValues } from "../types/appointment.type";
import { appointmentFormSchema } from "../schema/appointment.schema";
import { useAppointmentCreate } from "./useAppointmentCreate";
import { useAppointmentUpdate } from "./useAppointmentUpdate";

type AppointmentInputType = z.input<typeof appointmentFormSchema>;

export function useAppointmentForm(
  initialValues?: Partial<AppointmentFormValues>,
  onSuccess?: () => void,
) {
  const createMutation = useAppointmentCreate();
  const updateMutation = useAppointmentUpdate();

  const mergedValues = useMemo<AppointmentInputType | undefined>(() => {
    if (!initialValues) return undefined;

    return {
      id: initialValues.id ?? "",
      filialId: initialValues.filialId ?? "",
      profissionalId: initialValues.profissionalId ?? "",
      pacienteId: initialValues.pacienteId ?? "",
      dataAtendimento:
        initialValues.dataAtendimento ?? new Date().toISOString(),
      status: initialValues.status ?? "em_espera",
      observacoes: initialValues.observacoes ?? "",
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
    } as AppointmentInputType;
  }, [initialValues]);

  const form = useForm<AppointmentInputType>({
    resolver: zodResolver(appointmentFormSchema),
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
      const formValues = values as unknown as AppointmentFormValues;

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
    form: form as unknown as ReturnType<typeof useForm<AppointmentFormValues>>,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
