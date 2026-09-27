import { httpClient } from "@/utils/axios";
import type {
  AccessProfile,
  AccessUser,
  ApiResponse,
  CatalogModule,
  ProfilePayload,
} from "../types/access.type";

const BASE = "/acesso";

export async function getCatalog(): Promise<ApiResponse<CatalogModule[]>> {
  const response = await httpClient.get<ApiResponse<CatalogModule[]>>(
    `${BASE}/modulos`,
  );
  return response.data;
}

export async function getProfiles(): Promise<ApiResponse<AccessProfile[]>> {
  const response = await httpClient.get<ApiResponse<AccessProfile[]>>(BASE);
  return response.data;
}

export async function saveProfile(
  payload: ProfilePayload,
  id?: string,
): Promise<ApiResponse<AccessProfile>> {
  const response = id
    ? await httpClient.put<ApiResponse<AccessProfile>>(`${BASE}/${id}`, payload)
    : await httpClient.post<ApiResponse<AccessProfile>>(BASE, payload);
  return response.data;
}

export async function deleteProfile(id: string): Promise<ApiResponse<null>> {
  const response = await httpClient.delete<ApiResponse<null>>(`${BASE}/${id}`);
  return response.data;
}

export async function getAccessUsers(): Promise<ApiResponse<AccessUser[]>> {
  const response = await httpClient.get<ApiResponse<AccessUser[]>>(
    `${BASE}/usuarios`,
  );
  return response.data;
}

export async function setUserProfiles(
  usuarioId: string,
  acessoIds: string[],
): Promise<ApiResponse<unknown>> {
  const response = await httpClient.put<ApiResponse<unknown>>(
    `${BASE}/usuario/${usuarioId}`,
    { acessoIds },
  );
  return response.data;
}
