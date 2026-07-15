import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteEmployee } from "../api/deleteEmployee";

export function useEmployeeDelete() {
  const queryClient = useQueryClient();
  const deleteEmployee = useMutation({
    mutationFn: async (employeeId: string) => {
      await DeleteEmployee(employeeId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["employeesList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o funcionario. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteEmployee;
}
