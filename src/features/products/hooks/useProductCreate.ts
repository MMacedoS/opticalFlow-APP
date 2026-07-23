import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CreateProduct } from "../api/createProduct";
import { toast } from "sonner";
import type { ProductFormInput } from "../schema/product.schema";

export function useProductCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: ProductFormInput) => CreateProduct(payload),
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
