import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { CreatePeople } from "../api/createPeople";
import type { PeopleFormValues } from "../types/people.type";

export function usePeopleCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: PeopleFormValues) => CreatePeople(payload),
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
