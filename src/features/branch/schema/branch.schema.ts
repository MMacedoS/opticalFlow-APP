import { personSchema } from "@/features/people/schema/people.schema";
import { addressSchema } from "@/schema/address.schema";
import { contactSchema } from "@/schema/contact.schema";
import { isValidCNPJ } from "@/utils/validators";
import z from "zod/v4";

export const branchSchema = z.object({
  nome: z.string().min(1, "O nome da filial é obrigatório"),
  cnpj: z
    .string()
    .min(14, "O CNPJ deve ter no mínimo 14 caracteres")
    .transform((value) => value.replace(/\D/g, ""))
    .refine(isValidCNPJ, {
      message: "CNPJ inválido",
    }),
  pessoa: personSchema,
  enderecos: z
    .array(addressSchema)
    .min(1, "É necessário pelo menos um endereço"),
  contatos: z.array(contactSchema).min(1, "É necessário pelo menos um contato"),
});
