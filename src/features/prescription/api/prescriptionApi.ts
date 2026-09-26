import { httpClient } from "@/utils/axios";
import type {
  ApiResponse,
  Prescription,
  PrescriptionListData,
  PrescriptionPayload,
} from "../types/prescription.type";

const BASE = "/receita";

export async function getPrescriptionsByMedicalRecord(
  prontuarioId: string,
): Promise<ApiResponse<PrescriptionListData>> {
  const response = await httpClient.get<ApiResponse<PrescriptionListData>>(
    BASE,
    { params: { prontuarioId, limit: 50 } },
  );
  return response.data;
}

export async function getPrescription(
  id: string,
): Promise<ApiResponse<Prescription>> {
  const response = await httpClient.get<ApiResponse<Prescription>>(
    `${BASE}/${id}`,
  );
  return response.data;
}

export async function createPrescription(
  payload: PrescriptionPayload,
): Promise<ApiResponse<Prescription>> {
  const response = await httpClient.post<ApiResponse<Prescription>>(
    BASE,
    payload,
  );
  return response.data;
}

export async function deletePrescription(
  id: string,
): Promise<ApiResponse<null>> {
  const response = await httpClient.delete<ApiResponse<null>>(`${BASE}/${id}`);
  return response.data;
}

export async function updatePrescription(
  id: string,
  payload: Omit<PrescriptionPayload, "prontuarioId" | "tipo">,
): Promise<ApiResponse<Prescription>> {
  const response = await httpClient.put<ApiResponse<Prescription>>(
    `${BASE}/${id}`,
    payload,
  );
  return response.data;
}
