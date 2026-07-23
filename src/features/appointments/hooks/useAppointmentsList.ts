import { useQuery } from "@tanstack/react-query";
import { getAppointmentsList } from "../api/getAppointmentsList";

const DEFAULT_AppointmentS_LIST = {
  search: "",
  limit: 10,
};

export type AppointmentListFilters = typeof DEFAULT_AppointmentS_LIST;

export function useAppointmentsList(args?: AppointmentListFilters) {
  const queryParams = { ...DEFAULT_AppointmentS_LIST, ...args };

  return useQuery({
    queryKey: ["appointmentsListAll", queryParams],
    queryFn: () => getAppointmentsList(queryParams),
  });
}
