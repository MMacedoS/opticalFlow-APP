import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type { PeopleFormValues, PeopleResponse } from "../types/people.type";

export function UpdatePeople(
  payload: PeopleFormValues,
): Promise<PeopleResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do pessoa não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID da pessoa não fornecido."));
  }
  return httpClient
    .put<PeopleResponse>(`/peoples/${id}`, payload)
    .then((response) => response.data);
}
