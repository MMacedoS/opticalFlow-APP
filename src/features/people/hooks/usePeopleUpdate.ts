import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { PeopleFormValues } from "../types/people.type";
import { UpdatePeople } from "../api/updatePeople";

export function usePeopleUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: PeopleFormValues) => UpdatePeople(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["peoples"] });
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
