import { useQuery } from "@tanstack/react-query";
import { getAppointments } from "../api/getAppointment";

const DEFAULT_APPOINTMENT_LIST = {
  search: "",
  limit: 10,
  page: 1,
};

export type AppointmentListFilters = typeof DEFAULT_APPOINTMENT_LIST;

export function useAppointments(args?: AppointmentListFilters) {
  const queryParams = { ...DEFAULT_APPOINTMENT_LIST, ...args };

  return useQuery({
    queryKey: ["AppointmentsList", queryParams],
    queryFn: () => getAppointments(queryParams),
  });
}
