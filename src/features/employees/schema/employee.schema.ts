import { personSchema } from "@/features/people/schema/people.schema";
import z from "zod/v4";

export const employeeSchema = z.object({
  status: z.enum(["ativo", "inativo"]).optional(),
  cargo: z.string().optional(),
  pessoa: personSchema,
});
