import z from "zod";

export const OrderSchema = z.object({
  id: z.string().optional(),
  clienteId: z.string().optional(),
  profissionalId: z.string().optional(),
  pacienteId: z.string().optional(),
  dataAtendimento: z.string().optional(),
  temResponsavel: z.boolean().optional(),
  convenioId: z.string().nullable().optional(),
  queixa_principal: z.string().nullable().optional(),
  status: z
    .enum(["aberta", "orcamento", "faturada", "finalizada", "cancelada"])
    .default("aberta")
    .optional(),
  observacoes: z.string().nullable().optional(),
  ordemServico: z
    .object({
      status: z
        .enum(["aberta", "orcamento", "faturada", "finalizada", "cancelada"])
        .default("aberta")
        .optional(),
      descricao: z.string().nullable().optional(),
      valor_total: z.number().min(0).default(0),
      itens: z
        .array(
          z.object({
            produtoId: z.string().nullable().optional(),
            descricao_servico: z.string().nullable().optional(),
            quantidade: z.number().min(1, "A quantidade mínima é 1"),
            valor_unitario: z.number().min(0, "O valor não pode ser negativo"),
            desconto: z
              .number()
              .min(0, "O desconto não pode ser negativo")
              .default(0),
          }),
        )
        .default([]),
    })
    .optional(),
});
