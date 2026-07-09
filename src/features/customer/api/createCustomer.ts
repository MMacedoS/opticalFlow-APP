import { httpClient } from "@/utils/axios";
import type {
  CustomerFormValues,
  CustomerResponse,
} from "../types/customer.type";

export async function CreateCustomer(
  payload: CustomerFormValues,
): Promise<CustomerResponse> {
  const response = await httpClient.post<CustomerResponse>(
    "/customers",
    payload,
  );
  return response.data;
}
