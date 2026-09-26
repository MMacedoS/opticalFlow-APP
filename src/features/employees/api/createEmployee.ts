import { httpClient } from "@/utils/axios";
import type {
  EmployeeFormValues,
  EmployeeResponse,
} from "../types/employee.interface";

export async function CreateEmployee(
  payload: EmployeeFormValues,
): Promise<EmployeeResponse> {
  const response = await httpClient.post<EmployeeResponse>(
    "/funcionario",
    payload,
  );
  return response.data;
}
