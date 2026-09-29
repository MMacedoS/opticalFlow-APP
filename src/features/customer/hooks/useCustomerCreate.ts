import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import { CreateCustomer } from "../api/createCustomer";
import type { CustomerFormValues } from "../types/customer.type";

export function useCustomerCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: CustomerFormValues) => CreateCustomer(payload),
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
