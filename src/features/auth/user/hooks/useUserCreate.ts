import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { UserFormValues } from "../types/user.types";
import { createUser } from "../api/createUser";

export function useUserCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserFormValues) => createUser(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => console.log("fechado"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["userList"] });
    },
    onError: (error) => {
      toast.error(error.message, {
        action: {
          label: "Fechar",
          onClick: () => console.log("fechado"),
        },
      });
    },
  });
}
