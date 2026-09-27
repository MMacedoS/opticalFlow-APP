import { useAuthStore } from "@/stores/auth.store";
import { hasRouteAccess } from "@/utils/authorization";

import { useAccessUsers, useProfiles } from "../hooks/useAccess";
import { moduleLabel, type AccessProfile } from "../types/access.type";

type UserProfilesFieldProps = {
  /** Usuario ja existente (edicao); ausente no cadastro. */
  usuarioId?: string;
  /** undefined = nao alterado (mantem os perfis atuais / padrao do cargo). */
  value?: string[];
  onChange: (acessoIds: string[]) => void;
};

/** Selecao dos perfis de acesso de um usuario dentro de um cadastro. */
export function UserProfilesField({
  usuarioId,
  value,
  onChange,
}: UserProfilesFieldProps) {
  const session = useAuthStore((state) => state.session);
  const canManage = hasRouteAccess(session, {
    modulo: "acesso",
    acao: "listar",
  });
  const profiles = useProfiles();
  const users = useAccessUsers();

  if (!canManage) return null;

  const isSelf = Boolean(usuarioId && usuarioId === session?.usuario?.id);
  const current =
    users.data?.data.find((user) => user.id === usuarioId)?.acessoIds ?? [];
  const selected = new Set(value ?? current);

  const list = profiles.data?.data ?? [];
  const empresa = list.filter((profile) => !profile.sistema);
  const sistema = list
    .filter((profile) => profile.sistema)
    .sort((a, b) =>
      moduleLabel(a.nome).localeCompare(moduleLabel(b.nome), "pt-BR"),
    );

  const toggle = (id: string, on: boolean) => {
    const next = new Set(selected);
    if (on) next.add(id);
    else next.delete(id);
    onChange([...next]);
  };

  const option = (profile: AccessProfile, label: string) => (
    <label
      key={profile.id}
      className="flex items-center gap-2 rounded-md px-2 py-1 text-sm hover:bg-muted/50"
    >
      <input
        type="checkbox"
        className="size-4"
        checked={selected.has(profile.id)}
        disabled={isSelf}
        onChange={(event) => toggle(profile.id, event.target.checked)}
      />
      {label}
    </label>
  );

  return (
    <section className="space-y-2">
      <div>
        <h3 className="text-sm font-semibold">Perfis de acesso</h3>
        <p className="text-xs text-muted-foreground">
          {isSelf
            ? "Você não pode alterar o seu próprio acesso."
            : usuarioId
              ? "Vale a partir do próximo login do usuário."
              : "Sem seleção, o usuário recebe o acesso padrão do cargo."}
        </p>
      </div>

      {profiles.isLoading && <p className="text-sm">Carregando perfis...</p>}

      {empresa.length > 0 && (
        <div className="grid gap-0.5 sm:grid-cols-2 lg:grid-cols-3">
          {empresa.map((profile) => option(profile, profile.nome))}
        </div>
      )}

      <details className="rounded-lg border p-2">
        <summary className="cursor-pointer text-sm">
          Acesso completo por módulo (
          {sistema.filter((p) => selected.has(p.id)).length}/{sistema.length})
        </summary>
        <div className="mt-2 grid max-h-56 gap-0.5 overflow-y-auto sm:grid-cols-2 lg:grid-cols-3">
          {sistema.map((profile) => option(profile, moduleLabel(profile.nome)))}
        </div>
      </details>
    </section>
  );
}
