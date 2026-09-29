import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import type { EmployeeFormValues } from "../types/employee.interface";
import { UpdateEmployee } from "../api/updateEmployee";

export function useEmployeeUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EmployeeFormValues) => UpdateEmployee(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["employeesList"] });
      queryClient.invalidateQueries({ queryKey: ["accessUsers"] });
      queryClient.invalidateQueries({ queryKey: ["accessProfiles"] });
    },
    onError: (error) => {
      toast.error(getApiErrorMessage(error), {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
    },
  });
}
