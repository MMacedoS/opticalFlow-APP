import type { Customer } from "@/features/customer/types/customer.type";
import type { TipoProduto } from "@/constants/statusColorEvents";

export type ServiceOrderStatus =
  | "aberta"
  | "orcamento"
  | "faturada"
  | "finalizada"
  | "cancelada";

export interface ServiceOrderItemProduct {
  id: string;
  nome: string;
  sku: string | null;
  tipo: TipoProduto;
}

export interface ServiceOrderItem {
  id: string;
  ordemServicoId: string;
  produtoId: string | null;
  descricao_servico: string | null;
  quantidade: number;
  valor_unitario: number;
  desconto: number | null;
  subtotal: number;
  produto: ServiceOrderItemProduct | null;
}

export interface ServiceOrderAppointment {
  id: string;
  dataAtendimento: string;
  status: string;
  queixa_principal: string | null;
  paciente: {
    id: string;
    nome: string;
    email: string | null;
    cpf: string | null;
  } | null;
  profissional: {
    id: string;
    email: string;
    username: string | null;
    pessoa: {
      id: string;
      nome: string;
    } | null;
  } | null;
  convenio: {
    id: string;
    nome: string;
    registro: string | null;
  } | null;
}

export interface ServiceOrderLaboratory {
  id: string;
  nome: string;
  cnpj: string | null;
}

export interface ServiceOrder {
  id: string;
  empresaId: string;
  filialId: string;
  atendimentoId: string | null;
  clienteId: string | null;
  laboratorioId: string | null;
  numero: string | null;
  status: ServiceOrderStatus;
  descricao: string | null;
  previsao_entrega: string | null;
  data_entrega: string | null;
  valor_total: number;
  createdAt: string;
  updatedAt: string;
  filial: {
    id: string;
    nome: string;
  } | null;
  cliente: (Customer & {
    numero_convenio?: string | null;
  }) | null;
  atendimento: ServiceOrderAppointment | null;
  laboratorio: ServiceOrderLaboratory | null;
  itens: ServiceOrderItem[];
}

export interface ServiceOrderItemFormValues {
  id?: string;
  produtoId?: string | null;
  descricao_servico?: string | null;
  quantidade: number;
  valor_unitario: number;
  desconto?: number | null;
}

export interface ServiceOrderFormValues {
  id?: string;
  atendimentoId?: string | null;
  clienteId?: string | null;
  laboratorioId?: string | null;
  numero?: string | null;
  status: ServiceOrderStatus;
  descricao?: string | null;
  previsao_entrega?: string | null;
  data_entrega?: string | null;
  itens: ServiceOrderItemFormValues[];
  cliente?: ServiceOrder["cliente"];
  atendimento?: ServiceOrder["atendimento"];
  laboratorio?: ServiceOrder["laboratorio"];
}

export interface ServiceOrderFormProps {
  initialValues?: Partial<ServiceOrderFormValues> | ServiceOrder;
  triggerLabel?: string;
}

export interface ServiceOrderFilters {
  page?: number;
  limit?: number;
  search?: string;
  clienteId?: string;
  atendimentoId?: string;
  laboratorioId?: string;
  status?: ServiceOrderStatus;
  dataInicio?: string;
  dataFim?: string;
}

export interface ServiceOrdersResponse {
  status: number | string;
  message: string;
  data: {
    orders: ServiceOrder[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ServiceOrderDetailsResponse {
  status: number | string;
  message: string;
  data: ServiceOrder;
}

export interface ServiceOrderMutationResponse {
  status: number | string;
  message: string;
}

export type ServiceOrderCreatePayload = {
  atendimentoId?: string;
  clienteId?: string;
  laboratorioId?: string;
  numero?: string;
  status?: ServiceOrderStatus;
  descricao?: string;
  previsao_entrega?: string;
  data_entrega?: string;
  itens?: ServiceOrderItemFormValues[];
};

export type ServiceOrderUpdatePayload = Omit<ServiceOrderCreatePayload, "itens">;
