import z from "zod/v4";

const decimal = (label: string, min: number) =>
  z
    .string()
    .trim()
    .refine(
      (value) => value !== "" && !Number.isNaN(Number(value.replace(",", "."))),
      `${label} inválido`,
    )
    .transform((value) => Number(value.replace(",", ".")))
    .refine((value) => value >= min, `${label} inválido`);

const optionalDecimal = z
  .string()
  .trim()
  .refine(
    (value) => value === "" || !Number.isNaN(Number(value.replace(",", "."))),
    "Desconto inválido",
  )
  .transform((value) => (value === "" ? 0 : Number(value.replace(",", "."))))
  .refine((value) => value >= 0, "Desconto inválido");

export const purchaseItemSchema = z
  .object({
    produtoId: z.string().min(1, "Selecione o produto"),
    quantidade: decimal("Quantidade", 0.001),
    valor_unitario: decimal("Valor", 0),
    desconto: optionalDecimal,
  })
  .refine((item) => item.desconto <= item.quantidade * item.valor_unitario, {
    path: ["desconto"],
    message: "Maior que o valor do item",
  });

export const purchaseSchema = z.object({
  filialId: z.string(),
  fornecedorId: z.string(),
  dataCompra: z.string().min(1, "Informe a data"),
  observacoes: z.string(),
  itens: z
    .array(purchaseItemSchema)
    .min(1, "Inclua pelo menos um item")
    .refine(
      (itens) => new Set(itens.map((i) => i.produtoId)).size === itens.length,
      "O mesmo produto aparece mais de uma vez",
    ),
});

export type PurchaseFormInput = z.input<typeof purchaseSchema>;
export type PurchaseFormOutput = z.output<typeof purchaseSchema>;

export const EMPTY_ITEM = {
  produtoId: "",
  quantidade: "1",
  valor_unitario: "",
  desconto: "",
};
