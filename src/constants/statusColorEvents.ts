export type StatusEventos =
  | "agendado"
  | "confirmado"
  | "finalizado"
  | "cancelado";

export const statusColorEvents: Record<StatusEventos, string> = {
  agendado: "!bg-blue !border-blue-200 !text-white-700",
  confirmado: "!bg-green-600 !border-green-50 !text-green-100",
  cancelado: "!bg-rose-600 !border-rose-200 !text-rose-100 line-through",
  finalizado: "!bg-slate-100 !border-slate-300 !text-slate-600",
};

export const statusColorMap: Record<StatusAtendimento, string> = {
  em_espera: "text-green-500",
  em_andamento: "text-blue-500",
  concluido: "text-slate-500",
  cancelado: "text-red-500",
};

export const statusLabelMap: Record<string, string> = {
  em_espera: "Em espera",
  em_andamento: "Em andamento",
  finalizado: "Finalizado",
  cancelado: "Cancelado",
};

export type StatusAtendimento =
  | "em_espera"
  | "em_andamento"
  | "concluido"
  | "cancelado";

export const STATUS_ATENDIMENTO_OPTIONS: Record<
  StatusAtendimento,
  { label: string; value: StatusAtendimento }
> = {
  em_espera: { label: "Em espera", value: "em_espera" },
  em_andamento: { label: "Em andamento", value: "em_andamento" },
  concluido: { label: "Concluido", value: "concluido" },
  cancelado: { label: "Cancelado", value: "cancelado" },
};

export type TipoProduto = "armacao" | "lente" | "acesssorio" | "servico";

export type StatusOrder =
  | "aberta"
  | "orcamento"
  | "faturada"
  | "finalizada"
  | "cancelada";

export const STATUS_ORDER_OPTIONS: Record<
  StatusOrder,
  { label: string; value: StatusOrder }
> = {
  aberta: { label: "Aberta", value: "aberta" },
  orcamento: { label: "Orçamento", value: "orcamento" },
  faturada: { label: "Faturada", value: "faturada" },
  finalizada: { label: "Finalizada", value: "finalizada" },
  cancelada: { label: "Cancelada", value: "cancelada" },
};
