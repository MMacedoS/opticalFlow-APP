import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteCustomer } from "../api/deleteCustomer";

export function useCustomerDelete() {
  const queryClient = useQueryClient();
  const deleteCustomer = useMutation({
    mutationFn: async (customerId: string) => {
      await DeleteCustomer(customerId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["customerList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o cliente. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteCustomer;
}
