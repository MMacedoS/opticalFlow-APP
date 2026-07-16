import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import type { OphthalmologistFormValues } from "../types/ophthalmologist.interface";
import { UpdateOphthalmologist } from "../api/updateOphthalmologist";

export function useOphthalmologistUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: OphthalmologistFormValues) =>
      UpdateOphthalmologist(payload),
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
