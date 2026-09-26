export type SingleSectionKey =
  | "anamnese"
  | "acuidade_visual"
  | "refracao"
  | "ceratometria"
  | "biomicroscopia"
  | "fundoscopia"
  | "pressao_intraocular";

export type ListSectionKey =
  "diagnosticos" | "exames_complementares" | "evolucoes_clinicas";

export type SectionValue = string | number | null;
export type SectionRecord = Record<string, SectionValue> & { id: string };

export interface ListItem extends SectionRecord {
  prontuarioId: string;
  createdAt: string;
}

export interface MedicalRecord {
  id: string;
  empresaId: string;
  filialId: string;
  atendimentoId: string;
  pacienteId: string;
  resumo_clinico: string | null;
  createdAt: string;
  updatedAt: string;
  filial: { id: string; nome: string };
  paciente: {
    id: string;
    nome: string;
    cpf: string | null;
    email: string | null;
    data_nascimento: string | null;
    genero: string | null;
  };
  profissional: {
    id: string;
    username: string | null;
    pessoa: { id: string; nome: string } | null;
  } | null;
  atendimento: {
    id: string;
    dataAtendimento: string;
    status: string;
    queixa_principal: string | null;
    observacoes: string | null;
  };
  anamnese: SectionRecord | null;
  acuidade_visual: SectionRecord | null;
  refracao: SectionRecord | null;
  ceratometria: SectionRecord | null;
  biomicroscopia: SectionRecord | null;
  fundoscopia: SectionRecord | null;
  pressao_intraocular: SectionRecord | null;
  diagnosticos: ListItem[];
  exames_complementares: ListItem[];
  evolucoes_clinicas: ListItem[];
}

export interface MedicalRecordSummary {
  id: string;
  atendimentoId: string;
  createdAt: string;
  paciente: { id: string; nome: string };
  profissional: { id: string; pessoa: { nome: string } | null } | null;
  atendimento: { id: string; dataAtendimento: string; status: string };
  diagnosticos: { codigo: string; descricao: string | null }[];
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface MedicalRecordListData {
  prontuarios: MedicalRecordSummary[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

export interface MedicalRecordListFilters {
  page: number;
  limit: number;
  pacienteId?: string;
}

export type SectionPayload = Record<string, SectionValue>;
