import { httpClient } from "@/utils/axios";
import type { PeopleRequest, PeopleResponse } from "../types/people.type";

export async function getPeoples(
  payload: PeopleRequest,
): Promise<PeopleResponse> {
  const response = await httpClient.get<PeopleResponse>("/pessoa", {
    params: payload,
  });

  return response.data;
}
