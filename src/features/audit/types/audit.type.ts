export interface AuditEntry {
  id: string;
  empresaId: string | null;
  filialId: string | null;
  usuarioId: string | null;
  atendimentoId: string | null;
  entidade: string;
  entidadeId: string | null;
  acao: string;
  dados_antes: unknown;
  dados_depois: unknown;
  ip: string | null;
  user_agent: string | null;
  createdAt: string;
  filial: { id: string; nome: string } | null;
  usuario: {
    id: string;
    email: string;
    username: string | null;
    pessoa: { nome: string } | null;
  } | null;
}

export interface AuditFilters {
  page: number;
  limit: number;
  search?: string;
  usuarioId?: string;
  entidade?: string;
  acao?: string;
  dataInicio?: string;
  dataFim?: string;
}

export interface AuditListData {
  audits: AuditEntry[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface AuditOptions {
  entidades: string[];
  acoes: string[];
  usuarios: { id: string; nome: string; email: string }[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

/** Nome legivel das acoes gravadas (verbos HTTP e rotas de acao). */
const ACTION_LABELS: Record<string, string> = {
  criar: "Criou",
  atualizar: "Alterou",
  deletar: "Excluiu",
  login: "Entrou no sistema",
  status: "Alterou status",
  finalizar: "Finalizou",
  cancelar: "Cancelou",
  receber: "Recebeu",
  baixar: "Deu baixa",
  estornar: "Estornou",
  usuario: "Alterou perfis do usuário",
  "ordem-servico": "Gerou ordem de serviço",
  "marcar-lida": "Marcou como lida",
  "marcar-nao-lida": "Marcou como não lida",
  config: "Alterou configuração",
};

/** Rotas de secao clinica (anamnese, refracao...) viram "Registrou <secao>". */
export const actionLabel = (acao: string) =>
  ACTION_LABELS[acao] ?? `Registrou ${acao.replaceAll("-", " ")}`;
