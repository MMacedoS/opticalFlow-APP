import { isValidCPF } from "@/utils/validators";
import z from "zod/v4";

export const personSchema = z.object({
  id: z.string().optional(),

  nome: z.string().min(1, "O nome da pessoa é obrigatório"),

  cpf: z
    .string()
    .min(11, "O CPF deve ter no mínimo 11 caracteres")
    .transform((value) => value.replace(/\D/g, ""))
    .refine(isValidCPF, {
      message: "O CPF deve ter exatamente 11 dígitos",
    }),

  data_nascimento: z.date().optional(),

  email: z.email("O e-mail deve ser válido"),

  status: z.enum(
    ["ativo", "inativo"],
    "O status deve ser 'ativo' ou 'inativo'",
  ),
});

export type Person = z.infer<typeof personSchema>;
