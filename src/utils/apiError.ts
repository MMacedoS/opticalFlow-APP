import axios from "axios";

const DEFAULT_ERROR_MESSAGE = "Não foi possível concluir a operação.";

export function getApiErrorMessage(error: unknown): string {
  if (axios.isAxiosError(error)) {
    const responseMessage = error.response?.data?.message;

    if (typeof responseMessage === "string" && responseMessage.trim() !== "") {
      return responseMessage;
    }
  }

  if (error instanceof Error && error.message.trim() !== "") {
    return error.message;
  }

  return DEFAULT_ERROR_MESSAGE;
}
