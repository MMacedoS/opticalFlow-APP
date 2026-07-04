import { useMutation, useQueryClient } from "@tanstack/react-query";
import { DeleteCompany } from "../api/deleteCompany";

export function useCompanyDelete() {
  const queryClient = useQueryClient();
  const deleteCompany = useMutation({
    mutationFn: async (companyId: string) => {
      await DeleteCompany(companyId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["companyList"] });
    },
  });

  return deleteCompany;
}
