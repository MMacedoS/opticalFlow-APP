export interface Company {
  id: number;
  nome: string;
  cnpj: string;
  registroMunicipal?: string;
  registroEstadual?: string;
  website?: string;
  status: "ativo" | "inativo";
  endereco: Endereco[];
  contato: Contato[];
}

export interface Endereco {
  id: number;
  logradouro: string;
  numero: string;
  complemento?: string;
  bairro: string;
  cidade: string;
  uf: string;
  pais: string;
  cep: string;
}

export interface Contato {
  id: number;
  tipo: "whatsapp" | "telefone";
  valor: string;
  principal?: boolean;
}

export interface CompanyRequest {
  search: string;
  limit: number;
  page: number;
}

export interface CompanyResponse {
  status: number;
  message: string;
  data: {
    companies: Company[];
    pagination: {
      total: number;
      limit: number;
      page: number;
      pages: number;
    };
  };
}

export interface CompanyFormValues {
  nome: string;
  email: string;
  cnpj: string;
  registroEstadual?: string;
  registroMunicipal?: string;
  website?: string;
  status: "ATIVO" | "INATIVO";
  endereco: {
    logradouro: string;
    numero: string;
    complemento?: string;
    bairro: string;
    cidade: string;
    uf: string;
    pais: string;
    cep: string;
  }[];
  contato: {
    tipo: "whatsapp" | "telefone";
    valor: string;
    principal?: boolean;
  }[];
}
