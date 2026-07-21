export interface Pessoa {
  id: string;
  nome: string;
  cpf: string;
  email: string;
  genero: string;
  status: "ativo" | "inativo";
  contatos: Contato[];
  enderecos: Endereco[];
  usuario?: {
    id: string;
    username: string;
    email: string;
  };
}

export interface Endereco {
  id?: string;
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
  id?: string;
  tipo: "whatsapp" | "telefone";
  contato: string;
  principal?: boolean;
}
