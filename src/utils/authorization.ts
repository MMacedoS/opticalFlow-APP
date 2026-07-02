import type { AuthPermission, AuthSession } from "@/types/auth.types";

export type RequiredPermission = {
  modulo: string;
  acao: string;
};

export function hasRouteAccess(
  session: AuthSession | null,
  requiredPermission?: RequiredPermission,
): boolean {
  if (!requiredPermission) {
    return true;
  }

  return hasPermission(session?.permissoes ?? [], requiredPermission);
}

function hasPermission(
  permissoes: AuthPermission[],
  requiredPermission: RequiredPermission,
): boolean {
  const modulo = requiredPermission.modulo.toLowerCase();
  const acao = requiredPermission.acao.toLowerCase();

  return permissoes.some(
    (permissao) =>
      permissao.modulo.toLowerCase() === modulo &&
      permissao.acao.toLowerCase() === acao,
  );
}
