import z from "zod";

export const serviceOrderItemSchema = z
  .object({
    id: z.string().optional(),
    produtoId: z.string().optional(),
    descricao_servico: z.string().optional(),
    quantidade: z.number().min(0.000001, "A quantidade deve ser maior que zero"),
    valor_unitario: z
      .number()
      .min(0, "O valor unitário não pode ser negativo"),
    desconto: z.number().min(0, "O desconto não pode ser negativo").default(0),
  })
  .refine(
    (item) =>
      Boolean(item.produtoId?.trim()) || Boolean(item.descricao_servico?.trim()),
    {
      message: "Cada item deve conter produtoId ou descricao_servico",
      path: ["descricao_servico"],
    },
  );

export const serviceOrderSchema = z.object({
  id: z.string().optional(),
  atendimentoId: z.string().optional(),
  clienteId: z.string().optional(),
  laboratorioId: z.string().optional(),
  numero: z.string().optional(),
  status: z
    .enum(["aberta", "orcamento", "faturada", "finalizada", "cancelada"])
    .default("aberta"),
  descricao: z.string().optional(),
  previsao_entrega: z.string().optional(),
  data_entrega: z.string().optional(),
  itens: z.array(serviceOrderItemSchema).default([]),
});

export type ServiceOrderSchemaValues = z.infer<typeof serviceOrderSchema>;
