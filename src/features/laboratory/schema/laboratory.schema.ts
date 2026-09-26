import z from "zod/v4";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const laboratorySchema = z.object({
  nome: z.string().trim().min(2, "O nome deve ter no mínimo 2 caracteres"),
  cnpj: optionalText.transform((value) => value?.replace(/\D/g, "") || null),
  email: z
    .union([z.literal(""), z.email("Informe um e-mail válido")])
    .transform((value) => (value === "" ? null : value)),
  telefone: optionalText,
  ativo: z.boolean(),
});

export type LaboratoryFormInput = z.input<typeof laboratorySchema>;
export type LaboratoryFormOutput = z.output<typeof laboratorySchema>;
