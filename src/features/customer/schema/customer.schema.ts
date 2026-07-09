import { addressSchema } from "@/schema/address.schema";
import { contactSchema } from "@/schema/contact.schema";
import { personSchema } from "@/schema/person.schema";
import z from "zod/v4";

export const customerSchema = z.object({
  status: z.enum(["ativo", "inativo"]).optional(),
  pessoa: personSchema,
  endereco: z
    .array(addressSchema)
    .min(1, "É necessário pelo menos um endereço")
    .optional(),
  contato: z
    .array(contactSchema)
    .min(1, "É necessário pelo menos um contato")
    .optional(),
});
