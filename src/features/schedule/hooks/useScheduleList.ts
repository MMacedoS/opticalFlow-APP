import { useQuery } from "@tanstack/react-query";
import { getSchedules } from "../api/schedules";
import type { SchedulesListFilters } from "../type/schedule";

export function useScheduleList(args?: SchedulesListFilters) {
  const queryParams = { ...args };

  return useQuery({
    queryKey: ["schedulesList", queryParams],
    queryFn: () => getSchedules(queryParams),
  });
}
