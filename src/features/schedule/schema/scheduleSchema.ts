import type { Pessoa } from "@/types/person.type";
import { z } from "zod";

export const scheduleFormSchema = z.object({
  id: z.string().optional(),
  profissionalId: z.string().min(1, "Selecione um profissional").optional(),
  pessoaId: z.string().min(1, "Selecione um paciente").optional(),
  dataHora: z.string().min(1, "A data e hora são obrigatórias"), // ISO String

  temResponsavel: z.boolean().default(false),
  clienteId: z.string().nullable().optional(), // Mantido padrão em português
  convenioId: z.string().nullable().optional(),
  queixa_principal: z.string().nullable().optional(),
  duracaoMin: z.number(),
  status: z.enum(["agendado", "confirmado", "cancelado", "finalizado"]),
  observacao: z.string().nullable().optional(),
});

export type ScheduleFormValues = z.infer<typeof scheduleFormSchema> & {
  profissional?: {
    id: string;
    username: string;
  };
  paciente?: Pessoa;
};
