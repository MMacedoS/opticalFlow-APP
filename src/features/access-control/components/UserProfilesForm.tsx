import { useState } from "react";

import { useSetUserProfiles } from "../hooks/useAccess";
import {
  moduleLabel,
  type AccessProfile,
  type AccessUser,
} from "../types/access.type";

import { Button } from "@/components/ui/button";

type UserProfilesFormProps = {
  user: AccessUser;
  profiles: AccessProfile[];
  onDone: () => void;
};

export function UserProfilesForm({
  user,
  profiles,
  onDone,
}: UserProfilesFormProps) {
  const mutation = useSetUserProfiles();
  const [selected, setSelected] = useState(new Set(user.acessoIds));

  const empresa = profiles.filter((profile) => !profile.sistema);
  const sistema = profiles
    .filter((profile) => profile.sistema)
    .sort((a, b) =>
      moduleLabel(a.nome).localeCompare(moduleLabel(b.nome), "pt-BR"),
    );

  const toggle = (id: string, on: boolean) =>
    setSelected((prev) => {
      const next = new Set(prev);
      if (on) next.add(id);
      else next.delete(id);
      return next;
    });

  const save = async () => {
    try {
      await mutation.mutateAsync({
        usuarioId: user.id,
        acessoIds: [...selected],
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  };

  const option = (profile: AccessProfile, label: string, hint?: string) => (
    <label
      key={profile.id}
      className="flex items-start gap-2 rounded-lg p-2 text-sm hover:bg-muted/50"
    >
      <input
        type="checkbox"
        className="mt-0.5 size-4"
        checked={selected.has(profile.id)}
        onChange={(event) => toggle(profile.id, event.target.checked)}
      />
      <span>
        {label}
        {hint && (
          <span className="block text-xs text-muted-foreground">{hint}</span>
        )}
      </span>
    </label>
  );

  return (
    <div className="space-y-4">
      <section>
        <h3 className="mb-1 text-sm font-semibold">Perfis da empresa</h3>
        {empresa.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            Nenhum perfil criado. Crie na aba Perfis.
          </p>
        ) : (
          <div className="grid gap-1 sm:grid-cols-2">
            {empresa.map((profile) =>
              option(
                profile,
                profile.nome,
                `${profile.permissoes.length} permissões${profile.descricao ? ` · ${profile.descricao}` : ""}`,
              ),
            )}
          </div>
        )}
      </section>

      <section>
        <div className="mb-1 flex items-center justify-between">
          <h3 className="text-sm font-semibold">
            Acesso completo por módulo (padrão)
          </h3>
          <div className="flex gap-2 text-xs">
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() =>
                setSelected(
                  (prev) => new Set([...prev, ...sistema.map((p) => p.id)]),
                )
              }
            >
              Marcar todos
            </button>
            <button
              type="button"
              className="text-primary hover:underline"
              onClick={() =>
                setSelected((prev) => {
                  const next = new Set(prev);
                  sistema.forEach((p) => next.delete(p.id));
                  return next;
                })
              }
            >
              Desmarcar todos
            </button>
          </div>
        </div>
        <div className="grid max-h-64 gap-0.5 overflow-y-auto rounded-lg border p-1 sm:grid-cols-2 lg:grid-cols-3">
          {sistema.map((profile) => option(profile, moduleLabel(profile.nome)))}
        </div>
      </section>

      <p className="text-xs text-muted-foreground">
        A mudança vale a partir do próximo login do usuário.
      </p>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancelar
        </Button>
        <Button size="sm" onClick={save} disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar acessos"}
        </Button>
      </div>
    </div>
  );
}
