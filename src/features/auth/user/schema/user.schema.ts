import z from "zod/v4";

export const userSchema = z.object({
  username: z.string().min(1, "O nome de usuário é obrigatório"),
  email: z.string().email("Informe um e-mail válido"),
  status: z.enum(
    ["ativo", "inativo"],
    "O status deve ser 'ativo' ou 'inativo'",
  ),
  senha: z
    .string()
    .min(6, "A senha deve ter no mínimo 6 caracteres")
    .optional(),
});
