import type {
  AuthAccess,
  AuthPermission,
  AuthResponseData,
  AuthSession,
} from "@/types/auth.types";

export function normalizeAuthSession(
  data: AuthResponseData,
  fallbackSession?: Partial<AuthSession>,
): AuthSession {
  const accessToken =
    data.access_token ?? data.accessToken ?? fallbackSession?.accessToken ?? "";

  const refreshToken =
    data.refresh_token ?? data.refreshToken ?? fallbackSession?.refreshToken;

  const acessos: AuthAccess[] = (data.atribuicoes ?? []).map(({ acesso }) => ({
    id: acesso.id,
    nome: acesso.nome,
    descricao: acesso.descricao,
    permissoes: (acesso.permissao ?? []).map(({ permissao }) => ({
      id: permissao.id,
      modulo: permissao.modulo,
      acao: permissao.acao,
      descricao: permissao.descricao,
    })),
  }));

  const permissoes = flattenPermissions(acessos);

  return {
    accessToken,
    refreshToken,
    usuario: data.usuario ?? fallbackSession?.usuario,
    acessos: acessos.length > 0 ? acessos : (fallbackSession?.acessos ?? []),
    permissoes:
      permissoes.length > 0 ? permissoes : (fallbackSession?.permissoes ?? []),
  };
}

function flattenPermissions(acessos: AuthAccess[]): AuthPermission[] {
  const map = new Map<string, AuthPermission>();

  for (const acesso of acessos) {
    for (const permissao of acesso.permissoes) {
      map.set(permissao.id, permissao);
    }
  }

  return Array.from(map.values());
}
