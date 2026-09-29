import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { getApiErrorMessage } from "@/utils/apiError";
import type { UserFormValues } from "../types/user.types";
import { updateUser } from "../api/updateUser";

export function useUserUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UserFormValues) => updateUser(payload),
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
      toast.error(getApiErrorMessage(error), {
        action: {
          label: "Fechar",
          onClick: () => console.log("fechado"),
        },
      });
    },
  });
}
