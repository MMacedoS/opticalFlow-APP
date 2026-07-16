import { personSchema } from "@/schema/person.schema";
import z from "zod/v4";

export const ophthalmologistSchema = z.object({
  status: z.enum(["ativo", "inativo"]).optional(),
  registro_profissional: z
    .string()
    .min(1, "O registro profissional é obrigatório"),
  pessoa: personSchema,
});
