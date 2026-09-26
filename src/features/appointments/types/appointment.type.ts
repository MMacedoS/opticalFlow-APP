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
  temResponsavel?: boolean;
  agenda?: Evento;
  status: "em_espera" | "em_andamento" | "concluido" | "cancelado";
  queixa_principal: string | null;
  observacoes: string | null;
  ordemServico?: {
    status: "aberta" | "orcamento" | "faturada" | "finalizada" | "cancelada";
    descricao?: string | null;
    valor_total: number;
    itens: {
      produtoId?: string | null;
      descricao_servico?: string | null;
      quantidade: number;
      valor_unitario: number;
      desconto: number;
    }[];
  };
}

export interface AppointmentFormValues {
  id?: string;
  empresaId?: string;
  filialId?: string;
  agendaId?: string;
  pacienteId: string;
  profissionalId: string;
  clienteId?: string;
  temResponsavel?: boolean;
  convenioId?: string;
  dataAtendimento: string;
  status: "em_espera" | "em_andamento" | "concluido" | "cancelado";
  queixa_principal: string | null;
  observacoes: string | null;
  ordemServico?: {
    status: "aberta" | "orcamento" | "faturada" | "finalizada" | "cancelada";
    descricao?: string | null;
    valor_total: number;
    itens: {
      produtoId?: string | null;
      descricao_servico?: string | null;
      quantidade: number;
      valor_unitario: number;
      desconto: number;
    }[];
  };
  paciente?: Pessoa;
  profissional?: {
    id: string;
    username: string;
  };
  cliente?: Customer;
  convenio?: {
    id: string;
    nome: string;
  };
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
