import { addressSchema } from "@/schema/address.schema";
import { contactSchema } from "@/schema/contact.schema";
import { isValidCPF } from "@/utils/validators";
import z from "zod/v4";

export const personSchema = z.object({
  nome: z.string().min(1, "O nome da pessoa é obrigatório"),

  cpf: z
    .string()
    .min(11, "O CPF deve ter no mínimo 11 caracteres")
    .transform((value) => value.replace(/\D/g, ""))
    .refine(isValidCPF, {
      message: "O CPF deve ter exatamente 11 dígitos",
    }),

  data_nascimento: z.date().optional(),
  is_cliente: z.boolean().optional(),

  email: z.email("O e-mail deve ser válido"),

  status: z.enum(["ativo", "inativo"]).optional(),

  enderecos: z
    .array(addressSchema)
    .min(1, "É necessário pelo menos um endereço")
    .optional(),
  contatos: z
    .array(contactSchema)
    .min(1, "É necessário pelo menos um contato")
    .optional(),
});

export type Person = z.infer<typeof personSchema>;
