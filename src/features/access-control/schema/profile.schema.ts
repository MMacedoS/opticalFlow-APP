import z from "zod/v4";

export const profileSchema = z.object({
  nome: z
    .string()
    .trim()
    .min(2, "O nome deve ter no mínimo 2 caracteres")
    .max(60, "O nome deve ter no máximo 60 caracteres"),
  descricao: z.string().trim(),
  /** Chaves "modulo:acao". */
  permissoes: z.array(z.string()).min(1, "Marque pelo menos uma permissão"),
});

export type ProfileFormValues = z.infer<typeof profileSchema>;

export const permissionKey = (modulo: string, acao: string) =>
  `${modulo}:${acao}`;
