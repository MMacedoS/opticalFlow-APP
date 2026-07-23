import type { Customer } from "@/features/customer/types/customer.type";
import type { Evento } from "@/features/schedule/type/schedule";
import type { Pessoa } from "@/types/person.type";

export interface Appointment {
  id: string;
  empresaId?: string;
  filialId?: string;
  agendaId?: string;
  pacienteId: string;
  paciente: Pessoa;
  profissionalId: string;
  profissional?: {
    id: string;
    username: string;
    pesssoa?: Pessoa;
  };
  clienteId?: string;
  cliente?: Customer;
  convenioId?: string;
  convenio?: {
    id: string;
    nome: string;
  };
  dataAtendimento: string;
  agenda?: Evento;
  status: "em_espera" | "em_andamento" | "finalizado" | "cancelado";
  queixa_principal: string | null;
  observacao: string | null;
}

export interface AppointmentFormValues {
  id?: string;
  empresaId?: string;
  filialId?: string;
  agendaId?: string;
  pacienteId: string;
  profissionalId: string;
  clienteId?: string;
  convenioId?: string;
  dataAtendimento: string;
  status: "em_espera" | "em_andamento" | "finalizado" | "cancelado";
  queixa_principal: string | null;
  observacao: string | null;
}

export interface AppointmentProps {
  initialValues?: AppointmentFormValues;
}

export interface AppointmentResponse {
  status: string;
  message: string;
  data: {
    appointments: Appointment[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface AppointmentRequest {
  search?: string;
  limit?: number;
  page?: number;
}
