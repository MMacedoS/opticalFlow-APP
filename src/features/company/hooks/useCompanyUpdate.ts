import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CompanyFormValues } from "../types/company.types";
import { updateCompany } from "../api/updateCompany";
import { toast } from "sonner";

export function useCompanyUpdate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompanyFormValues) => updateCompany(payload),
    onSuccess: (data) => {
      toast.success(data.message, {
        action: {
          label: "Fechar",
          onClick: () => console.log("fechado"),
        },
      });
      queryClient.invalidateQueries({ queryKey: ["companyList"] });
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
