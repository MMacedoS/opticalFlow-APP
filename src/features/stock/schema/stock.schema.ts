import z from "zod/v4";

const decimal = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value !== "" && !Number.isNaN(Number(value.replace(",", "."))),
      `${label} deve ser um número`,
    )
    .transform((value) => Number(value.replace(",", ".")));

const optionalDecimal = (label: string) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value === "" || !Number.isNaN(Number(value.replace(",", "."))),
      `${label} deve ser um número`,
    )
    .transform((value) =>
      value === "" ? null : Number(value.replace(",", ".")),
    )
    .refine(
      (value) => value === null || value >= 0,
      `${label} não pode ser negativo`,
    );

export const movementSchema = z
  .object({
    tipo: z.enum(["entrada", "saida", "ajuste"]),
    quantidade: decimal("Quantidade"),
    motivo: z.string().trim(),
    referencia: z.string().trim(),
  })
  .refine(
    (data) =>
      data.tipo === "ajuste" ? data.quantidade >= 0 : data.quantidade > 0,
    {
      path: ["quantidade"],
      message: "Informe uma quantidade maior que zero",
    },
  );

export type MovementFormInput = z.input<typeof movementSchema>;
export type MovementFormOutput = z.output<typeof movementSchema>;

export const limitsSchema = z
  .object({
    minimo: optionalDecimal("Mínimo"),
    maximo: optionalDecimal("Máximo"),
  })
  .refine(
    (data) =>
      data.minimo === null ||
      data.maximo === null ||
      data.minimo <= data.maximo,
    { path: ["maximo"], message: "O máximo deve ser maior ou igual ao mínimo" },
  );

export type LimitsFormInput = z.input<typeof limitsSchema>;
export type LimitsFormOutput = z.output<typeof limitsSchema>;

export const addItemSchema = limitsSchema.and(
  z.object({ produtoId: z.string().min(1, "Selecione um produto") }),
);

export type AddItemFormInput = z.input<typeof addItemSchema>;
export type AddItemFormOutput = z.output<typeof addItemSchema>;
