import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeleteProduct } from "../api/deleteProduct";

export function useProductDelete() {
  const queryClient = useQueryClient();
  const deleteProduct = useMutation({
    mutationFn: async (ProductId: string) => {
      await DeleteProduct(ProductId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["productsList"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar o produto. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deleteProduct;
}
