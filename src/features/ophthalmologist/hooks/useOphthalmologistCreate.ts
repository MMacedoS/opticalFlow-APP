import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { OphthalmologistFormValues } from "../types/ophthalmologist.interface";
import { CreateOphthalmologist } from "../api/createOphthalmologist";

export function useOphthalmologistCreate() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (payload: OphthalmologistFormValues) =>
      CreateOphthalmologist(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => {
            toast.dismiss();
          },
        },
      });
      queryClient.invalidateQueries({ queryKey: ["ophthalmologistsList"] });
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
