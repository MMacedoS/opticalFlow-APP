export interface Permission {
  modulo: string;
  acao: string;
}

export interface CatalogModule {
  modulo: string;
  acoes: string[];
}

export interface AccessProfile {
  id: string;
  nome: string;
  descricao: string | null;
  empresaId: string | null;
  sistema: boolean;
  editavel: boolean;
  usuarios: number;
  permissoes: Permission[];
}

export interface AccessUser {
  id: string;
  email: string;
  username: string | null;
  status: "ativo" | "inativo";
  pessoa: { nome: string } | null;
  acessoIds: string[];
}

export interface ProfilePayload {
  nome?: string;
  descricao?: string | null;
  permissoes?: Permission[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export const ACTIONS = [
  { value: "listar", label: "Listar" },
  { value: "detalhar", label: "Ver" },
  { value: "criar", label: "Criar" },
  { value: "atualizar", label: "Editar" },
  { value: "deletar", label: "Excluir" },
] as const;

/** Nome legivel de cada modulo de permissao. */
export const MODULE_LABELS: Record<string, string> = {
  acesso: "Permissões",
  agenda: "Agenda",
  arquivo: "Arquivos",
  atendimento: "Consultas",
  auditoria: "Auditoria",
  cliente: "Clientes",
  compra: "Compras",
  convenio: "Convênios",
  empresa: "Empresas",
  estoque: "Estoque",
  "estoque-item": "Itens de estoque",
  filial: "Filiais",
  "financeiro-lancamento": "Financeiro",
  fornecedor: "Fornecedores",
  funcionario: "Funcionários",
  laboratorio: "Laboratórios",
  "movimento-estoque": "Movimentações de estoque",
  notificacao: "Notificações",
  oftalmologista: "Oftalmologistas",
  optometrista: "Optometristas",
  "ordem-servico": "Ordens de serviço",
  "ordem-servico-item": "Itens de OS",
  pessoa: "Pessoas",
  produto: "Produtos",
  prontuario: "Prontuários",
  receita: "Receitas",
  responsavel: "Responsáveis",
  usuario: "Usuários",
  venda: "Vendas",
};

export const moduleLabel = (modulo: string) => MODULE_LABELS[modulo] ?? modulo;
