import { useMutation, useQueryClient } from "@tanstack/react-query";
import { deleteUser } from "../api/deleteUser";

export function useUserDelete() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: async (userId: string) => {
      await deleteUser(userId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
  });
}
