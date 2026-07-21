import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { DeletePeople } from "../api/deletePeople";

export function usePeopleDelete() {
  const queryClient = useQueryClient();
  const deletePeople = useMutation({
    mutationFn: async (PeopleId: string) => {
      await DeletePeople(PeopleId);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["peoples"] });
    },
    onError: (error) => {
      toast.error(
        `Erro ao deletar pessoa. Por favor, tente novamente. Error: ${error.message}`,
      );
    },
  });

  return deletePeople;
}
