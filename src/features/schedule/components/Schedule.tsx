import { useState } from "react";
import { Calendar, dayjsLocalizer } from "react-big-calendar";
import { dayjs } from "@/common/config/dayjs.config";

import "react-big-calendar/lib/css/react-big-calendar.css";
import "react-big-calendar/lib/addons/dragAndDrop/styles.css";
import { type View, Views, type SlotInfo } from "react-big-calendar";

import withDragAndDrop, {
  type EventInteractionArgs,
} from "react-big-calendar/lib/addons/dragAndDrop";
import type { ScheduleProps, MeuEvento } from "../type/schedule"; // Ajuste o caminho conforme seu projeto
import { statusColorEvents } from "@/constants/statusColorEvents";

const localizer = dayjsLocalizer(dayjs);

const dndWrapper =
  (withDragAndDrop as unknown as { default: typeof withDragAndDrop }).default ||
  withDragAndDrop;
const DragAndDropCalendar = dndWrapper<MeuEvento, object>(Calendar);

interface ExtendedScheduleProps extends ScheduleProps {
  onSelectSlot: (start: Date, end: Date) => void;
}

export function Schedule({
  events,
  onEventDrop,
  onEventResize,
  onSelectEvent,
  onNavigate,
  currentDate,
  loading,
  onSelectSlot,
}: ExtendedScheduleProps) {
  const [currentView, setCurrentView] = useState<View>(Views.MONTH);

  const handleEventDrop = ({
    event,
    start,
    end,
  }: EventInteractionArgs<MeuEvento>) => {
    if (!start || !end) return;
    onEventDrop(event, new Date(start), new Date(end));
  };

  const handleEventResize = ({
    event,
    start,
    end,
  }: EventInteractionArgs<MeuEvento>) => {
    if (!start || !end) return;
    onEventResize(event, new Date(start), new Date(end));
  };

  const handleSelectSlot = (slotInfo: SlotInfo) => {
    onSelectSlot(new Date(slotInfo.start), new Date(slotInfo.end));
  };

  if (loading) {
    return (
      <div className="p-4 text-slate-500 text-center">
        Carregando agendamentos...
      </div>
    );
  }

  const eventPropGetter = (event: MeuEvento) => {
    const statusClasses =
      statusColorEvents[event.status] ||
      "bg-slate-50 border-slate-200 text-slate-700";

    return {
      className: `${statusClasses} border rounded-md shadow-xs text-xs font-medium p-1 transition-all`,
    };
  };

  return (
    <div className="h-screen p-4 bg-slate-50">
      <DragAndDropCalendar
        date={currentDate}
        view={currentView}
        onNavigate={(newDate, view) => onNavigate(newDate, view)}
        onView={(newView) => setCurrentView(newView)}
        localizer={localizer}
        events={events}
        eventPropGetter={eventPropGetter}
        resizable
        selectable={true}
        onSelectSlot={handleSelectSlot}
        onSelectEvent={onSelectEvent}
        onEventDrop={handleEventDrop}
        onEventResize={handleEventResize}
        className="h-full calendar text-slate-800"
        views={["month", "week", "day"]}
        messages={{
          next: "Próximo",
          previous: "Anterior",
          today: "Hoje",
          month: "Mês",
          week: "Semana",
          day: "Dia",
        }}
      />
    </div>
  );
}
