import type { Pessoa } from "@/types/person.type";
import { z } from "zod";

export const ordemServicoItemSchema = z.object({
  produtoId: z.string().nullable().optional(),
  descricao_servico: z.string().nullable().optional(),
  quantidade: z.number().min(1, "A quantidade mínima é 1"),
  valor_unitario: z.number().min(0, "O valor não pode ser negativo"),
  desconto: z.number().min(0, "O desconto não pode ser negativo").default(0),
});

export const ordemServicoAninhadaSchema = z.object({
  status: z
    .enum(["aberta", "orcamento", "faturada", "finalizada", "cancelada"])
    .default("aberta")
    .optional(),
  descricao: z.string().nullable().optional(),
  valor_total: z.number().min(0).default(0),
  itens: z.array(ordemServicoItemSchema).default([]),
});

export const appointmentFormSchema = z.object({
  id: z.string().optional(),
  filialId: z.string().optional(),
  profissionalId: z.string().min(1, "Selecione um profissional").optional(),
  pacienteId: z.string().min(1, "Selecione um paciente").optional(),
  dataAtendimento: z.string().min(1, "A data e hora são obrigatórias"),
  temResponsavel: z.boolean().default(false).optional(),
  clienteId: z.string().nullable().optional(),
  convenioId: z.string().nullable().optional(),
  queixa_principal: z.string().nullable().optional(),
  status: z
    .enum(["em_espera", "em_andamento", "finalizado", "cancelado"])
    .default("em_espera")
    .optional(),
  observacoes: z.string().nullable().optional(),
  ordemServico: ordemServicoAninhadaSchema.optional(),
});

export type AppointmentSchemaType = z.infer<typeof appointmentFormSchema>;

export type appointmentFormValues = AppointmentSchemaType & {
  profissional?: {
    id: string;
    username: string;
  };
  paciente?: Pessoa;
  cliente?: {
    id: string;
    pessoa: Pessoa;
  };
};
