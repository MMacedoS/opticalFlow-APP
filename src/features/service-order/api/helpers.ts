type ApiEnvelope = {
  status?: number | string;
  message?: string;
};

function normalizeStatus(status?: number | string) {
  if (typeof status === "number") return status;
  if (typeof status === "string" && status.trim() !== "") {
    const parsed = Number(status);
    return Number.isNaN(parsed) ? undefined : parsed;
  }

  return undefined;
}

export function unwrapApiResponse<T extends ApiEnvelope>(payload: T): T {
  const status = normalizeStatus(payload.status);

  if (status !== undefined && status >= 400) {
    throw new Error(payload.message || "Não foi possível concluir a operação.");
  }

  return payload;
}

export { getApiErrorMessage } from "@/utils/apiError";
