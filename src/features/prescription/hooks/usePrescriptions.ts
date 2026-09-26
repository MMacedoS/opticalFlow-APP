import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  createPrescription,
  deletePrescription,
  getPrescription,
  getPrescriptionsByMedicalRecord,
  updatePrescription,
} from "../api/prescriptionApi";
import type { PrescriptionPayload } from "../types/prescription.type";

type UpdatePayload = Omit<PrescriptionPayload, "prontuarioId" | "tipo">;

const LIST_KEY = "prescriptionsByMedicalRecord";

export function usePrescriptions(prontuarioId: string) {
  return useQuery({
    queryKey: [LIST_KEY, prontuarioId],
    queryFn: () => getPrescriptionsByMedicalRecord(prontuarioId),
  });
}

export function usePrescription(id: string) {
  return useQuery({
    queryKey: ["prescription", id],
    queryFn: () => getPrescription(id),
  });
}

function usePrescriptionMutation<TVariables>(
  prontuarioId: string,
  mutationFn: (variables: TVariables) => Promise<{ message: string }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [LIST_KEY, prontuarioId] });
      queryClient.invalidateQueries({ queryKey: ["prescription"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useCreatePrescription(prontuarioId: string) {
  return usePrescriptionMutation(prontuarioId, (payload: PrescriptionPayload) =>
    createPrescription(payload),
  );
}

export function useDeletePrescription(prontuarioId: string) {
  return usePrescriptionMutation(prontuarioId, (id: string) =>
    deletePrescription(id),
  );
}

export function useUpdatePrescription(prontuarioId: string) {
  return usePrescriptionMutation(
    prontuarioId,
    ({ id, payload }: { id: string; payload: UpdatePayload }) =>
      updatePrescription(id, payload),
  );
}
