import z from "zod/v4";

export const appointmentSchema = z.object({
  pacienteId: z.string().nonempty("Paciente é obrigatório"),
  profissionalId: z.string().nonempty("Profissional é obrigatório"),
  dataAtendimento: z.string().nonempty("Data do atendimento é obrigatória"),
  status: z.enum(["em_espera", "em_andamento", "finalizado", "cancelado"]),
  queixa_principal: z.string().nullable(),
  observacao: z.string().nullable(),
});
