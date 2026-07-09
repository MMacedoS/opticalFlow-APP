import z from "zod/v4";

export const agreementSchema = z.object({
  id: z.string().optional(),
  nome: z.string().min(1, "O nome do convênio é obrigatório"),
  registro: z.string().min(1, "O registro do convênio é obrigatório"),
  ativo: z.enum(["ativo", "inativo"], {}),
});
