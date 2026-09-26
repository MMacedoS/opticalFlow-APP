import { httpClient } from "@/utils/axios";
import type { CustomerRequest, CustomerResponse } from "../types/customer.type";

export async function getCustomers(
  payload: CustomerRequest,
): Promise<CustomerResponse> {
  const response = await httpClient.get<CustomerResponse>("/cliente", {
    params: payload,
  });

  return response.data;
}
