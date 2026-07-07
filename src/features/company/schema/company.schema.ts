import { addressSchema } from "@/schema/address.schema";
import { contactSchema } from "@/schema/contact.schema";
import { isValidCNPJ } from "@/utils/validators";
import z from "zod/v4";

export const companySchema = z.object({
  nome: z.string().min(1, "O nome da empresa é obrigatório"),
  razao: z.string().min(1, "A razão social é obrigatória"),
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
  registro_estadual: z.string().optional(),
  registro_municipal: z.string().optional(),
  website: z.url("Informe uma URL válida").optional(),
  enderecos: z.array(addressSchema).optional(),
  contatos: z.array(contactSchema).optional(),
});
