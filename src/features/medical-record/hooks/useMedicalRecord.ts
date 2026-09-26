import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "sonner";

import { getApiErrorMessage } from "@/utils/apiError";

import {
  addListItem,
  getMedicalRecordByAppointment,
  getMedicalRecords,
  openMedicalRecord,
  removeListItem,
  removeSection,
  saveSection,
  updateClinicalSummary,
} from "../api/medicalRecordApi";
import type {
  ListSectionKey,
  MedicalRecordListFilters,
  SectionPayload,
  SingleSectionKey,
} from "../types/medicalRecord.type";

const RECORD_KEY = "medicalRecord";
const LIST_KEY = "medicalRecordList";

const isNotFound = (error: unknown) =>
  axios.isAxiosError(error) && error.response?.status === 404;

export function useMedicalRecordList(filters: MedicalRecordListFilters) {
  return useQuery({
    queryKey: [LIST_KEY, filters],
    queryFn: () => getMedicalRecords(filters),
  });
}

/** Prontuario do atendimento; `notOpened` indica que ainda nao foi aberto. */
export function useMedicalRecordByAppointment(atendimentoId: string) {
  const query = useQuery({
    queryKey: [RECORD_KEY, atendimentoId],
    queryFn: () => getMedicalRecordByAppointment(atendimentoId),
    retry: (failureCount, error) => !isNotFound(error) && failureCount < 2,
  });

  return {
    ...query,
    record: query.data?.data,
    notOpened: isNotFound(query.error),
  };
}

function useRecordMutation<TVariables>(
  atendimentoId: string,
  mutationFn: (variables: TVariables) => Promise<{ message: string }>,
) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      toast.success(data.message);
      queryClient.invalidateQueries({ queryKey: [RECORD_KEY, atendimentoId] });
      queryClient.invalidateQueries({ queryKey: [LIST_KEY] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error));
    },
  });
}

export function useOpenMedicalRecord(atendimentoId: string) {
  return useRecordMutation<void>(atendimentoId, () =>
    openMedicalRecord(atendimentoId),
  );
}

export function useMedicalRecordActions(
  atendimentoId: string,
  prontuarioId: string,
) {
  const updateSummary = useRecordMutation(
    atendimentoId,
    (resumo: string | null) => updateClinicalSummary(prontuarioId, resumo),
  );

  const save = useRecordMutation(
    atendimentoId,
    ({
      section,
      payload,
    }: {
      section: SingleSectionKey;
      payload: SectionPayload;
    }) => saveSection(prontuarioId, section, payload),
  );

  const clear = useRecordMutation(atendimentoId, (section: SingleSectionKey) =>
    removeSection(prontuarioId, section),
  );

  const addItem = useRecordMutation(
    atendimentoId,
    ({
      section,
      payload,
    }: {
      section: ListSectionKey;
      payload: SectionPayload;
    }) => addListItem(prontuarioId, section, payload),
  );

  const removeItem = useRecordMutation(
    atendimentoId,
    ({ section, itemId }: { section: ListSectionKey; itemId: string }) =>
      removeListItem(prontuarioId, section, itemId),
  );

  return { updateSummary, save, clear, addItem, removeItem };
}
