import { ChangeStatusOrders } from "../api/changeStatusOrders";
import type { StatusOrder } from "./../../../constants/statusColorEvents";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export function useOrderStatus() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: { id: string; status: StatusOrder }) =>
      ChangeStatusOrders(payload.id, payload.status),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["ordersList"] });
    },
    onError: (error) => {
      console.error("Erro ao mudar o status da ordem:", error);
    },
  });
}
