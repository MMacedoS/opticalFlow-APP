import z from "zod/v4";

import { isValidCNPJ } from "@/utils/validators";

const optionalText = z
  .string()
  .trim()
  .transform((value) => (value === "" ? null : value));

export const supplierSchema = z.object({
  razao_social: z
    .string()
    .trim()
    .min(2, "A razão social deve ter no mínimo 2 caracteres"),
  nome_fantasia: optionalText,
  cnpj: z
    .string()
    .transform((value) => value.replace(/\D/g, ""))
    .refine((value) => value === "" || isValidCNPJ(value), "CNPJ inválido")
    .transform((value) => value || null),
  email: z
    .union([z.literal(""), z.email("Informe um e-mail válido")])
    .transform((value) => (value === "" ? null : value)),
  telefone: optionalText,
  observacoes: optionalText,
  ativo: z.boolean(),
});

export type SupplierFormInput = z.input<typeof supplierSchema>;
export type SupplierFormOutput = z.output<typeof supplierSchema>;
