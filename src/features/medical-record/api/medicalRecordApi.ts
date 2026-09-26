import { httpClient } from "@/utils/axios";
import type {
  ApiResponse,
  ListSectionKey,
  MedicalRecord,
  MedicalRecordListData,
  MedicalRecordListFilters,
  SectionPayload,
  SingleSectionKey,
} from "../types/medicalRecord.type";

const BASE = "/prontuario";

/** Nome da secao na URL da API (ex.: acuidade_visual -> acuidade-visual). */
const toPath = (section: SingleSectionKey | ListSectionKey) =>
  section.replace(/_/g, "-");

export async function getMedicalRecords(
  filters: MedicalRecordListFilters,
): Promise<ApiResponse<MedicalRecordListData>> {
  const response = await httpClient.get<ApiResponse<MedicalRecordListData>>(
    BASE,
    { params: filters },
  );
  return response.data;
}

export async function getMedicalRecordByAppointment(
  atendimentoId: string,
): Promise<ApiResponse<MedicalRecord>> {
  const response = await httpClient.get<ApiResponse<MedicalRecord>>(
    `${BASE}/atendimento/${atendimentoId}`,
  );
  return response.data;
}

export async function openMedicalRecord(
  atendimentoId: string,
): Promise<ApiResponse<MedicalRecord>> {
  const response = await httpClient.post<ApiResponse<MedicalRecord>>(BASE, {
    atendimentoId,
  });
  return response.data;
}

export async function updateClinicalSummary(
  id: string,
  resumo_clinico: string | null,
): Promise<ApiResponse<MedicalRecord>> {
  const response = await httpClient.put<ApiResponse<MedicalRecord>>(
    `${BASE}/${id}`,
    { resumo_clinico },
  );
  return response.data;
}

export async function saveSection(
  id: string,
  section: SingleSectionKey,
  payload: SectionPayload,
): Promise<ApiResponse<unknown>> {
  const response = await httpClient.put<ApiResponse<unknown>>(
    `${BASE}/${id}/${toPath(section)}`,
    payload,
  );
  return response.data;
}

export async function removeSection(
  id: string,
  section: SingleSectionKey,
): Promise<ApiResponse<unknown>> {
  const response = await httpClient.delete<ApiResponse<unknown>>(
    `${BASE}/${id}/${toPath(section)}`,
  );
  return response.data;
}

export async function addListItem(
  id: string,
  section: ListSectionKey,
  payload: SectionPayload,
): Promise<ApiResponse<unknown>> {
  const response = await httpClient.post<ApiResponse<unknown>>(
    `${BASE}/${id}/${toPath(section)}`,
    payload,
  );
  return response.data;
}

export async function updateListItem(
  id: string,
  section: ListSectionKey,
  itemId: string,
  payload: SectionPayload,
): Promise<ApiResponse<unknown>> {
  const response = await httpClient.put<ApiResponse<unknown>>(
    `${BASE}/${id}/${toPath(section)}/${itemId}`,
    payload,
  );
  return response.data;
}

export async function removeListItem(
  id: string,
  section: ListSectionKey,
  itemId: string,
): Promise<ApiResponse<unknown>> {
  const response = await httpClient.delete<ApiResponse<unknown>>(
    `${BASE}/${id}/${toPath(section)}/${itemId}`,
  );
  return response.data;
}
