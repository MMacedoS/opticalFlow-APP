import { useState } from "react";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Schedule } from "../components/Schedule";
import { useScheduleList } from "../hooks/useScheduleList";
import { prepareEventSchedule } from "@/utils/prepareEventSchedule";
import type { MeuEvento, StatusOptions } from "../type/schedule";
import Select from "react-select";
import { dayjs } from "@/common/config/dayjs.config";
import { ScheduleForm } from "../components/ScheduleForm";
import { useScheduleUpdate } from "../hooks/useScheduleUpdate";
import type { ScheduleFormValues } from "../schema/scheduleSchema";

const statusOptions = [
  { value: "agendado", label: "Agendado" },
  { value: "confirmado", label: "Confirmado" },
  { value: "cancelado", label: "Cancelado" },
  { value: "finalizado", label: "Finalizado" },
];

const profissionalOptions = [
  { value: "1", label: "Dr. Silva (Oftalmologista)" },
  { value: "2", label: "Dr. Souza (Optometrista)" },
];

export function SchedulePage() {
  const [search, setSearch] = useState("");

  const [selectedStatus, setSelectedStatus] = useState<
    StatusOptions | undefined
  >();

  const [selectedProfissional, setSelectedProfissional] = useState<
    string | undefined
  >();

  const [calendarDate, setCalendarDate] = useState<Date>(new Date());

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<{
    start: Date;
    end: Date;
  } | null>(null);

  const [selectedEvent, setSelectedEvent] = useState<MeuEvento | null>(null);

  const startDate = dayjs(calendarDate).startOf("month").format("YYYY-MM-DD");
  const endDate = dayjs(calendarDate).endOf("month").format("YYYY-MM-DD");

  const updateMutation = useScheduleUpdate();

  const { data, isLoading } = useScheduleList({
    search,
    empresaId: "1",
    filialId: "1",
    profissionalId: selectedProfissional,
    pessoaId: "1",
    status: selectedStatus?.value,
    startDate,
    endDate,
  });

  const events = data?.data.events.map(prepareEventSchedule) || [];

  return (
    <div className="flex flex-col w-full min-h-screen bg-slate-50 p-2 sm:p-4 gap-4 overflow-x-hidden">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 p-4 bg-white rounded-lg shadow-sm border border-slate-200">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">
            Buscar por Paciente/Obs
          </label>
          <input
            type="text"
            placeholder="Digite para buscar..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-9.5 px-3 text-sm bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">
            Profissional
          </label>
          <Select
            options={profissionalOptions}
            defaultValue={profissionalOptions[0]}
            onChange={(option) => setSelectedProfissional(option?.value)}
            placeholder="Selecione..."
            className="text-sm"
          />
        </div>

        <div className="flex flex-col gap-1">
          <label className="text-xs font-semibold text-slate-600">Status</label>
          <Select
            options={statusOptions}
            defaultValue={statusOptions[0]}
            isClearable
            onChange={(option) =>
              setSelectedStatus(option?.value as StatusOptions | undefined)
            }
            placeholder="Todos os status"
            className="text-sm"
          />
        </div>

        <div className="flex flex-col gap-1 justify-end text-right text-xs text-slate-400 pb-2">
          <p>Buscando dados de:</p>
          <p className="font-medium text-slate-600">
            {dayjs(startDate).format("DD/MM/YYYY")} até{" "}
            {dayjs(endDate).format("DD/MM/YYYY")}
          </p>
        </div>
      </div>

      <div className="flex-1 min-h-125 md:h-full bg-white rounded-lg shadow-sm border border-slate-200 relative overflow-auto p-2">
        {isLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-white/70 z-10 text-slate-500 font-medium text-sm">
            Atualizando registros...
          </div>
        )}

        <Schedule
          events={events}
          currentDate={calendarDate}
          onNavigate={(date) => {
            setCalendarDate(date);
          }}
          onEventDrop={(event, start, end) => {
            updateMutation.mutateAsync({
              id: event.id,
              profissionalId: event.profissionalId,
              pessoaId: event.pessoaId,
              status: event.status,
              observacao: event.observacao ?? undefined,
              dataHora: dayjs(start).toISOString(),
              duracaoMin: dayjs(end).diff(start, "minutes"),
            } as ScheduleFormValues);
          }}
          onEventResize={(event, start, end) => {
            updateMutation.mutateAsync({
              id: event.id,
              profissionalId: event.profissionalId,
              pessoaId: event.pessoaId,
              status: event.status,
              observacao: event.observacao ?? undefined,
              dataHora: dayjs(start).toISOString(),
              duracaoMin: dayjs(end).diff(start, "minutes"),
            } as ScheduleFormValues);
          }}
          onSelectEvent={(event) => {
            setSelectedEvent(event);
            setIsModalOpen(true);
          }}
          onSelectSlot={(start, end) => {
            setSelectedSlot({ start, end });
            setIsModalOpen(true);
          }}
        />
      </div>

      {isModalOpen && (selectedSlot || selectedEvent) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
          <div className="max-h-[90vh] overflow-y-auto bg-white rounded-lg shadow-2xl p-2">
            <ScheduleForm
              initialValues={
                selectedEvent
                  ? {
                      id: selectedEvent.id,
                      dataHora: dayjs(selectedEvent.start).toISOString(),
                      duracaoMin: dayjs(selectedEvent.end).diff(
                        selectedEvent.start,
                        "minutes",
                      ),
                      status: selectedEvent.status,
                      observacao: selectedEvent.observacao ?? undefined,

                      profissionalId: selectedEvent.profissionalId ?? undefined,
                      profissional: selectedEvent.profissional,
                      pessoaId: selectedEvent.pessoaId ?? undefined,
                      paciente: selectedEvent.paciente,
                    }
                  : {
                      dataHora: selectedSlot!.start.toISOString(),
                      duracaoMin: dayjs(selectedSlot!.end).diff(
                        selectedSlot!.start,
                        "minutes",
                      ),
                      status: "agendado",
                    }
              }
              onClose={() => {
                setIsModalOpen(false);
                setSelectedSlot(null);
                setSelectedEvent(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
