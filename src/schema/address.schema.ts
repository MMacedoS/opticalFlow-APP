import z from "zod/v4";

export const addressSchema = z.object({
  id: z.string().optional(),
  logradouro: z.string().min(1, "O logradouro é obrigatório"),
  numero: z.string().min(1, "O número é obrigatório"),
  bairro: z.string().min(1, "O bairro é obrigatório"),
  cidade: z.string().min(1, "A cidade é obrigatória"),
  uf: z
    .string()
    .min(2, "O estado deve ter no mínimo 2 caracteres")
    .max(2, "O estado deve ter no máximo 2 caracteres"),
  pais: z.string().min(1, "O país é obrigatório"),
  cep: z
    .string()
    .min(8, "O CEP deve ter no mínimo 8 caracteres")
    .max(9, "O CEP deve ter no máximo 9 caracteres"),
});
