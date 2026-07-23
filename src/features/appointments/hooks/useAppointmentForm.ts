import { useForm } from "react-hook-form";
import type z from "zod/v4";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import type { AppointmentFormValues } from "../types/appointment.type";
import { useAppointmentCreate } from "./useAppointmentCreate";
import { useAppointmentUpdate } from "./useAppointmentUpdate";
import { appointmentSchema } from "../schema/appointment.schema";

export function useAppointmentForm(initialValues?: AppointmentFormValues) {
  const createMutation = useAppointmentCreate();
  const updateMutation = useAppointmentUpdate();

  const form = useForm<z.infer<typeof appointmentSchema>>({
    resolver: zodResolver(appointmentSchema),
    defaultValues: initialValues || {
      pacienteId: "",
      profissionalId: "",
      dataAtendimento: "",
      status: "em_espera",
      queixa_principal: null,
      observacao: null,
    },
    values: initialValues,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    if (errors.pacienteId) return errors.pacienteId.message;
    if (errors.profissionalId) return errors.profissionalId.message;
    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...values,
        } as AppointmentFormValues);
      }
      if (!initialValues) {
        await createMutation.mutateAsync(values as AppointmentFormValues);
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
