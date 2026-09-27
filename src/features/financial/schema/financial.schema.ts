import z from "zod/v4";

export const entrySchema = z
  .object({
    descricao: z.string().trim().min(2, "Informe a descrição"),
    categoria: z.string().trim(),
    valor: z
      .string()
      .trim()
      .refine(
        (value) =>
          !Number.isNaN(Number(value.replace(",", "."))) && value !== "",
        "Valor inválido",
      )
      .transform((value) => Number(value.replace(",", ".")))
      .refine((value) => value > 0, "O valor deve ser maior que zero"),
    vencimento: z.string(),
    pago: z.boolean(),
    forma_pagamento: z.string(),
  })
  .refine((data) => !data.pago || data.forma_pagamento !== "", {
    path: ["forma_pagamento"],
    message: "Informe a forma de pagamento",
  });

export type EntryFormInput = z.input<typeof entrySchema>;
export type EntryFormOutput = z.output<typeof entrySchema>;
