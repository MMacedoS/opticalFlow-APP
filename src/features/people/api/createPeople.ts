import { httpClient } from "@/utils/axios";
import type { PeopleFormValues, PeopleResponse } from "../types/people.type";

export async function CreatePeople(
  payload: PeopleFormValues,
): Promise<PeopleResponse> {
  const response = await httpClient.post<PeopleResponse>("/peoples", payload);
  return response.data;
}
