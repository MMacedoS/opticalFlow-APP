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
  finalizado: "text-slate-500",
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
  | "finalizado"
  | "cancelado";

export const STATUS_ATENDIMENTO_OPTIONS: Record<
  StatusAtendimento,
  { label: string; value: StatusAtendimento }
> = {
  em_espera: { label: "Em espera", value: "em_espera" },
  em_andamento: { label: "Em andamento", value: "em_andamento" },
  finalizado: { label: "Finalizado", value: "finalizado" },
  cancelado: { label: "Cancelado", value: "cancelado" },
};

export type TipoProduto = "armacao" | "lente" | "acesssorio" | "servico";
