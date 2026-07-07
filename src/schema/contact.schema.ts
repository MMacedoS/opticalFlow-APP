import z from "zod/v4";

export const contactSchema = z.object({
  id: z.string().optional(),
  tipo: z.enum(
    ["whatsapp", "telefone"],
    "O tipo de contato deve ser whats ou TELEFONE",
  ),
  contato: z.string().min(1, "O valor do contato é obrigatório"),
  principal: z.boolean().optional(),
});
