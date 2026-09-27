import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useCatalog, useSaveProfile } from "../hooks/useAccess";
import {
  permissionKey,
  profileSchema,
  type ProfileFormValues,
} from "../schema/profile.schema";
import { ACTIONS, moduleLabel, type AccessProfile } from "../types/access.type";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ProfileFormProps = {
  profile?: AccessProfile;
  onDone: () => void;
};

export function ProfileForm({ profile, onDone }: ProfileFormProps) {
  const readOnly = profile ? !profile.editavel : false;
  const mutation = useSaveProfile();
  const catalog = useCatalog();

  const modules = useMemo(
    () =>
      [...(catalog.data?.data ?? [])].sort((a, b) =>
        moduleLabel(a.modulo).localeCompare(moduleLabel(b.modulo), "pt-BR"),
      ),
    [catalog.data],
  );

  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nome: profile?.nome ?? "",
      descricao: profile?.descricao ?? "",
      permissoes:
        profile?.permissoes.map((p) => permissionKey(p.modulo, p.acao)) ?? [],
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        id: profile?.id,
        payload: {
          nome: values.nome,
          descricao: values.descricao || null,
          permissoes: values.permissoes.map((key) => {
            const [modulo, acao] = key.split(":");
            return { modulo, acao };
          }),
        },
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Controller
          name="nome"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="profile-nome">Nome do perfil</FieldLabel>
              <Input
                {...field}
                id="profile-nome"
                placeholder="Recepção, Optometrista, Gerente..."
                disabled={readOnly}
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <FieldLabel htmlFor="profile-descricao">Descrição</FieldLabel>
          <Input
            id="profile-descricao"
            disabled={readOnly}
            {...form.register("descricao")}
          />
        </Field>
      </div>

      <Controller
        name="permissoes"
        control={form.control}
        render={({ field, fieldState }) => {
          const selected = new Set(field.value);
          const setMany = (keys: string[], on: boolean) => {
            const next = new Set(selected);
            keys.forEach((key) => (on ? next.add(key) : next.delete(key)));
            field.onChange([...next]);
          };

          return (
            <div className="space-y-2">
              <div className="max-h-[55vh] overflow-auto rounded-lg border">
                <table className="w-full text-sm">
                  <thead className="sticky top-0 bg-muted text-left">
                    <tr>
                      <th className="p-2 font-medium">Módulo</th>
                      {ACTIONS.map((action) => {
                        const keys = modules
                          .filter((m) => m.acoes.includes(action.value))
                          .map((m) => permissionKey(m.modulo, action.value));
                        const all =
                          keys.length > 0 && keys.every((k) => selected.has(k));
                        return (
                          <th
                            key={action.value}
                            className="p-2 text-center font-medium"
                          >
                            <label className="flex flex-col items-center gap-1">
                              {action.label}
                              <input
                                type="checkbox"
                                className="size-4"
                                aria-label={`Marcar ${action.label} em todos os módulos`}
                                checked={all}
                                disabled={readOnly}
                                onChange={(event) =>
                                  setMany(keys, event.target.checked)
                                }
                              />
                            </label>
                          </th>
                        );
                      })}
                    </tr>
                  </thead>
                  <tbody>
                    {catalog.isLoading && (
                      <tr>
                        <td className="p-2" colSpan={ACTIONS.length + 1}>
                          Carregando módulos...
                        </td>
                      </tr>
                    )}
                    {modules.map((module) => {
                      const rowKeys = module.acoes.map((acao) =>
                        permissionKey(module.modulo, acao),
                      );
                      const rowAll = rowKeys.every((k) => selected.has(k));
                      return (
                        <tr
                          key={module.modulo}
                          className="border-t hover:bg-muted/30"
                        >
                          <td className="p-2">
                            <label className="flex items-center gap-2">
                              <input
                                type="checkbox"
                                className="size-4"
                                aria-label={`Marcar todas as ações de ${moduleLabel(module.modulo)}`}
                                checked={rowAll}
                                disabled={readOnly}
                                onChange={(event) =>
                                  setMany(rowKeys, event.target.checked)
                                }
                              />
                              {moduleLabel(module.modulo)}
                            </label>
                          </td>
                          {ACTIONS.map((action) => {
                            const key = permissionKey(
                              module.modulo,
                              action.value,
                            );
                            const available = module.acoes.includes(
                              action.value,
                            );
                            return (
                              <td
                                key={action.value}
                                className="p-2 text-center"
                              >
                                {available && (
                                  <input
                                    type="checkbox"
                                    className="size-4"
                                    aria-label={`${action.label} ${moduleLabel(module.modulo)}`}
                                    checked={selected.has(key)}
                                    disabled={readOnly}
                                    onChange={(event) =>
                                      setMany([key], event.target.checked)
                                    }
                                  />
                                )}
                              </td>
                            );
                          })}
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
              <p className="text-xs text-muted-foreground">
                {selected.size} permissões marcadas. "Listar" libera a tela do
                módulo no menu.
              </p>
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </div>
          );
        }}
      />

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          {readOnly ? "Fechar" : "Cancelar"}
        </Button>
        {!readOnly && (
          <Button type="submit" size="sm" disabled={mutation.isPending}>
            {mutation.isPending ? "Salvando..." : "Salvar perfil"}
          </Button>
        )}
      </div>
    </form>
  );
}
