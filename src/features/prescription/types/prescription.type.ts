export type PrescriptionType = "oculos" | "lente_contato" | "medicamento";

export type PrescriptionDetail = Record<string, string | null> & {
  id: string;
  receitaId: string;
};

export interface Prescription {
  id: string;
  prontuarioId: string | null;
  tipo: PrescriptionType;
  observacoes: string | null;
  createdAt: string;
  paciente: {
    id: string;
    nome: string;
    cpf: string | null;
    data_nascimento: string | null;
  };
  profissional: {
    id: string;
    username: string | null;
    pessoa: {
      nome: string;
      optometrista: { registro_profissional: string } | null;
      oftalmologista: { registro_profissional: string } | null;
    } | null;
  } | null;
  filial: {
    id: string;
    nome: string;
    cnpj: string | null;
    empresa: { nome: string; cnpj: string };
  };
  atendimento: { id: string; dataAtendimento: string } | null;
  oculos: PrescriptionDetail | null;
  lente_contato: PrescriptionDetail | null;
  medicamento: PrescriptionDetail | null;
}

export interface PrescriptionPayload {
  prontuarioId: string;
  tipo: PrescriptionType;
  oculos?: Record<string, string | number | null>;
  lente_contato?: Record<string, string | number | null>;
  medicamento?: Record<string, string | number | null>;
}

export interface ApiResponse<T> {
  status: number;
  message: string;
  data: T;
}

export interface PrescriptionListData {
  receitas: Prescription[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}
