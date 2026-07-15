import { httpClient } from "@/utils/axios";
import type {
  EmployeeRequest,
  EmployeeResponse,
} from "../types/employee.interface";

export async function getEmployeeList(
  payload: EmployeeRequest,
): Promise<EmployeeResponse> {
  const response = await httpClient.get<EmployeeResponse>("/employees", {
    params: payload,
  });

  return response.data;
}
