import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { CustomerFormValues } from "../types/customer.type";
import { UpdateCustomer } from "../api/updateCustomer";

export function useCustomerUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CustomerFormValues) => UpdateCustomer(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["customerList"] });
    },
    onError: (error) => {
      toast.error(error.message, {
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
