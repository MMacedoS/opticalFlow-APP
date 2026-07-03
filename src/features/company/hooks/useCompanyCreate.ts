import { useMutation, useQueryClient } from "@tanstack/react-query";
import type { CompanyFormValues } from "../types/company.types";
import { createCompany } from "../api/createCompany";
import { toast } from "sonner";

export function useCompanyCreate() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CompanyFormValues) => createCompany(payload),
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
