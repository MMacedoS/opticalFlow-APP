import { useQuery } from "@tanstack/react-query";
import type { UserRequest } from "../types/user.types";
import { getUser } from "../api/getUser";

const DEFAULT_PARAMS: UserRequest = {
  search: "",
  limit: 10,
  page: 1,
};

export function useUserList(args?: UserRequest) {
  const queryParams = { ...DEFAULT_PARAMS, ...args };

  return useQuery({
    queryKey: ["userList", queryParams],
    queryFn: () => getUser(queryParams),
  });
}
