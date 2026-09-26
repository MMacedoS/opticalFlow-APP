import type { Appointment } from "@/features/appointments/types/appointment.type";
import type { Customer } from "@/features/customer/types/customer.type";

export interface Order {
  id: string;
  numero: string;
  descricao: string;
  previsao_entrega: string;
  data_entrega: string;
  cliente_id: string;
  cliente: Customer;
  atenddimento: Appointment;
  valor_total: number;
  status: "pendente" | "em andamento" | "concluido" | "cancelado";
  itens: OrderItem[];
}

export interface OrderItem {
  id: string;
  produto_id: string;
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
  valor_total: number;
}

export interface OrderFormValues {
  id?: string;
  numero: string;
  descricao: string;
  previsao_entrega: string;
  data_entrega: string;
  cliente_id: string;
  atenddimento_id: string;
  valor_total: number;
  status: "pendente" | "em andamento" | "concluido" | "cancelado";
  itens: OrderItemFormValues[];
}

export interface OrderItemFormValues {
  id?: string;
  produto_id: string;
  produto_nome: string;
  quantidade: number;
  valor_unitario: number;
}

export interface OrderProps {
  initialValues?: OrderFormValues;
}

export interface OrderFilter {
  cliente_id?: string;
  atenddimento_id?: string;
  status?: "pendente" | "em andamento" | "concluido" | "cancelado";
  data_entrega_inicio?: string;
  data_entrega_fim?: string;
  search?: string;
  limit?: number;
  page?: number;
}

export interface OrderListResponse {
  status: string;
  message: string;
  data: {
    orders: Order[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}
