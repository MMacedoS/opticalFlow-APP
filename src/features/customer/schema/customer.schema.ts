import { personSchema } from "@/schema/person.schema";
import z from "zod/v4";

export const customerSchema = z.object({
  status: z.enum(["ativo", "inativo"]).optional(),
  convenioId: z.string().optional(),
  pessoa: personSchema,
});
