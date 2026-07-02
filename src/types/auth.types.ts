export interface AuthUser {
  id: string;
  email: string;
  username: string;
  pessoaId: string | null;
}

export interface AuthPermission {
  id: string;
  modulo: string;
  acao: string;
  descricao: string;
}

export interface AuthAccess {
  id: string;
  nome: string;
  descricao: string;
  permissoes: AuthPermission[];
}

export interface AuthAtribuicaoPermission {
  permissao: AuthPermission;
}

export interface AuthAtribuicao {
  acesso: {
    id: string;
    nome: string;
    descricao: string;
    permissao: AuthAtribuicaoPermission[];
  };
}

export interface AuthResponseData {
  access_token?: string;
  accessToken?: string;
  refresh_token?: string;
  refreshToken?: string;
  usuario?: AuthUser;
  atribuicoes?: AuthAtribuicao[];
}

export interface AuthSession {
  accessToken: string;
  refreshToken?: string;
  usuario?: AuthUser;
  acessos: AuthAccess[];
  permissoes: AuthPermission[];
}
