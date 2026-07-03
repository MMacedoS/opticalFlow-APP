import { isValidCNPJ } from "@/utils/validators";
import z from "zod/v4";

export const companySchema = z.object({
  nome: z.string().min(1, "O nome da empresa é obrigatório"),
  email: z.email("Informe um e-mail válido"),
  cnpj: z
    .string()
    .min(1, "O CNPJ é obrigatório")
    .transform((val) => val.replace(/\D/g, ""))
    .refine((val) => val.length === 14, {
      message: "O CNPJ deve conter exatamente 14 números",
    })
    .refine(isValidCNPJ, {
      message: "CNPJ inválido",
    }),
  registroEstadual: z.string().optional(),
  registroMunicipal: z.string().optional(),
  website: z.url("Informe uma URL válida").optional(),
  status: z.enum(["ATIVO", "INATIVO"], "O status deve ser ATIVO ou INATIVO"),
});

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

export const contactSchema = z.object({
  tipo: z.enum(
    ["whatsapp", "telefone"],
    "O tipo de contato deve ser whats ou TELEFONE",
  ),
  valor: z.string().min(1, "O valor do contato é obrigatório"),
  principal: z.boolean().optional(),
});
