import { toast } from "sonner";
import { httpClient } from "@/utils/axios";
import type {
  EmployeeFormValues,
  EmployeeResponse,
} from "../types/employee.interface";

export function UpdateEmployee(
  payload: EmployeeFormValues,
): Promise<EmployeeResponse> {
  const id = payload.id;

  if (!id) {
    toast.error("ID do funcionario não fornecido.", {
      action: {
        label: "Fechar",
        onClick: () => {
          toast.dismiss();
        },
      },
    });
    return Promise.reject(new Error("ID do funcionario não fornecido."));
  }
  return httpClient
    .put<EmployeeResponse>(`/employees/${id}`, payload)
    .then((response) => response.data);
}
