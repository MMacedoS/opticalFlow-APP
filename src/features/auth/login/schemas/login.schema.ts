import { z } from "zod/v4";

export const loginSchema = z.object({
  email: z.email("Informe um e-mail válido"),
  senha: z
    .string({ message: "Senha é obrigatória" })
    .min(6, "A senha deve ter no mínimo 6 caracteres"),
});

export type LoginSchema = z.infer<typeof loginSchema>;
