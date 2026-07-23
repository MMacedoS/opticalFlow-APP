import type { TipoProduto } from "@/constants/statusColorEvents";

export interface Product {
  id: string;
  empresaId?: string;
  nome: string;
  sku: string;
  categoria: string;
  tipo: TipoProduto;
  descricao: string;
  preco_custo?: number;
  margem_lucro?: number;
  preco_venda: number;
  ativo: "ativo" | "inativo";
  estoque_itens?: Array<{
    quantidade: number;
    minimo?: number | null;
    maximo?: number | null;
  }>;
}

export interface ProductFormHookProps {
  id?: string;
  nome: string;
  sku: string;
  categoria: string;
  tipo: TipoProduto;
  descricao?: string | null;
  preco_custo?: number | null;
  margem_lucro?: number | null;
  preco_venda: number;
  ativo: "ativo" | "inativo";
  estoque_itens?: Array<{
    quantidade: number;
    minimo?: number | null;
    maximo?: number | null;
  }>;
}

export interface ProductProps {
  initialValues?: ProductFormHookProps;
}

export interface ProductResponse {
  status: string;
  message: string;
  data: {
    products: Product[];
    pagination: {
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    };
  };
}

export interface ProductRequest {
  search?: string;
  limit?: number;
  page?: number;
}
