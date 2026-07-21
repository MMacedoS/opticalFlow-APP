import type { Pessoa } from "@/types/person.type";
import type { View } from "react-big-calendar";
import type { Event as CalendarEvent } from "react-big-calendar";

export interface MeuEvento extends CalendarEvent {
  id: string;
  title: string;
  start: Date;
  end: Date;

  empresaId: string;
  filialId: string;
  pessoaId: string | null;
  paciente?: Pessoa;
  profissionalId: string | null;
  profissional?: {
    id: string;
    username: string;
  };
  status: "agendado" | "confirmado" | "cancelado" | "finalizado";
  observacao: string | null;
  clientId?: string | null;
  convenioId?: string | null;
  queixa_principal?: string | null;
}

export interface Evento {
  id: string; // cuid() é uma string
  empresaId: string;
  filialId: string;
  pessoaId: string | null;
  paciente?: Pessoa;
  profissionalId: string | null;
  profissional?: {
    id: string;
    username: string;
  };
  dataHora: string;
  duracaoMin: number | null;
  status: "agendado" | "confirmado" | "cancelado" | "finalizado"; // Seu StatusAgenda
  observacao: string | null;
  clientId?: string | null;
  convenioId?: string | null;
  queixa_principal?: string | null;
}

export interface ScheduleProps {
  events: MeuEvento[];
  onEventDrop: (event: MeuEvento, start: Date, end: Date) => void;
  onEventResize: (event: MeuEvento, start: Date, end: Date) => void;
  onSelectEvent: (event: MeuEvento) => void;
  onNavigate: (date: Date, view: View) => void;
  currentDate: Date;
  loading?: boolean;
}

export interface SchedulesListFilters {
  search?: string;
  empresaId?: string;
  filialId?: string;
  profissionalId?: string;
  pessoaId?: string;
  status?: "agendado" | "confirmado" | "cancelado" | "finalizado";
  startDate?: string; // ISO 8601 date string
  endDate?: string; // ISO 8601 date string
}

export interface StatusOptions {
  value: "agendado" | "confirmado" | "cancelado" | "finalizado";
  label: string;
}

export interface ScheduleListResponse {
  status: string;
  message: string;
  data: {
    events: Evento[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ScheduleListRequest {
  search?: string;
  empresaId?: string;
  filialId?: string;
  profissionalId?: string;
  pessoaId?: string;
  status?: "agendado" | "confirmado" | "cancelado" | "finalizado";
  startDate?: string; // ISO 8601 date string
  endDate?: string; // ISO 8601 date string
  limit?: number;
  page?: number;
}
