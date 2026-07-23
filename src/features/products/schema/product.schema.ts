import { z } from "zod";

export const productSchema = z
  .object({
    id: z.string().optional(),
    nome: z.string().min(1, "Nome é obrigatório"),
    sku: z.string().min(1, "SKU é obrigatório"),
    categoria: z.string().min(1, "Categoria é obrigatória"),
    tipo: z.enum(["armacao", "lente", "acesssorio", "servico"]),
    descricao: z.string().nullable().optional(),
    preco_custo: z
      .number()
      .nonnegative("Preço de custo não pode ser negativo")
      .optional(),
    margem_lucro: z
      .number()
      .nonnegative("A margem não pode ser negativa")
      .optional()
      .default(0),

    preco_venda: z
      .number()
      .nonnegative("Preço de venda deve ser maior ou igual a zero"),

    ativo: z.enum(["ativo", "inativo"]),

    quantidade_inicial: z
      .number()
      .nonnegative("A quantidade não pode ser negativa")
      .optional()
      .default(0),
    estoque_minimo: z
      .number()
      .nonnegative("O estoque mínimo não pode ser negativo")
      .nullable()
      .optional(),
    estoque_maximo: z
      .number()
      .nonnegative("O estoque máximo não pode ser negativo")
      .nullable()
      .optional(),
  })
  .refine(
    (data) => {
      if (
        data.tipo !== "servico" &&
        data.estoque_minimo &&
        data.estoque_maximo
      ) {
        return data.estoque_maximo >= data.estoque_minimo;
      }
      return true;
    },
    {
      message: "O estoque máximo deve ser maior ou igual ao estoque mínimo",
      path: ["estoque_maximo"],
    },
  );

export type ProductFormInput = z.input<typeof productSchema>; // O que o useForm precisa aceitar (aceita undefined nos defaults)
export type ProductFormOutput = z.output<typeof productSchema>;
