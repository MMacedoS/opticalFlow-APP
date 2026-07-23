import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { ProductFormValues } from "../types/product.type";
import { UpdateProduct } from "../api/updateProduct";

export function useProductUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProductFormValues) => UpdateProduct(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
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
