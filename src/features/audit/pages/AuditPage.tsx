import { useState } from "react";
import dayjs from "dayjs";
import { Eye } from "lucide-react";

import { moduleLabel } from "@/features/access-control/types/access.type";

import { useAuditOptions, useAudits } from "../hooks/useAudit";
import {
  actionLabel,
  type AuditEntry,
  type AuditFilters,
} from "../types/audit.type";

import { CardPage } from "@/components/cards/CardPage";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

const ACTION_STYLE: Record<string, string> = {
  criar: "bg-green-100 text-green-800",
  atualizar: "bg-blue-100 text-blue-800",
  deletar: "bg-red-100 text-red-800",
  cancelar: "bg-red-100 text-red-800",
  estornar: "bg-amber-100 text-amber-800",
  login: "bg-slate-100 text-slate-700",
};

const userName = (entry: AuditEntry) =>
  entry.usuario
    ? (entry.usuario.pessoa?.nome ??
      entry.usuario.username ??
      entry.usuario.email)
    : "Sistema";

const selectClass = "rounded-lg border bg-background p-2 text-sm";

function AuditDetail({ entry }: { entry: AuditEntry }) {
  const rows: [string, string | null][] = [
    ["Quando", dayjs(entry.createdAt).format("DD/MM/YYYY HH:mm:ss")],
    [
      "Usuário",
      `${userName(entry)}${entry.usuario ? ` (${entry.usuario.email})` : ""}`,
    ],
    ["Módulo", moduleLabel(entry.entidade)],
    ["Ação", actionLabel(entry.acao)],
    ["Registro", entry.entidadeId],
    ["Filial", entry.filial?.nome ?? null],
    ["IP", entry.ip],
    ["Navegador", entry.user_agent],
  ];

  return (
    <div className="space-y-4 text-sm">
      <dl className="grid gap-x-4 gap-y-2 sm:grid-cols-[8rem_1fr]">
        {rows.map(([label, value]) => (
          <div key={label} className="contents">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="break-all">{value || "—"}</dd>
          </div>
        ))}
      </dl>
      <div>
        <h3 className="mb-1 font-semibold">Dados enviados</h3>
        {entry.dados_depois ? (
          <pre className="max-h-80 overflow-auto rounded-lg bg-muted p-3 text-xs">
            {JSON.stringify(entry.dados_depois, null, 2)}
          </pre>
        ) : (
          <p className="text-muted-foreground">
            Sem dados (ex.: exclusão ou login).
          </p>
        )}
        <p className="mt-1 text-xs text-muted-foreground">
          Senhas e tokens são ocultados.
        </p>
      </div>
    </div>
  );
}

export function AuditPage() {
  const [filters, setFilters] = useState<AuditFilters>({ page: 1, limit: 20 });
  const [selected, setSelected] = useState<AuditEntry | null>(null);

  const { data, isLoading, isError } = useAudits(filters);
  const options = useAuditOptions().data?.data;

  const entries = data?.data.audits ?? [];
  const pagination = data?.data.pagination;

  const updateFilters = (patch: Partial<AuditFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  return (
    <CardPage
      title="Auditoria"
      description="Quem fez o quê e quando. Os registros são automáticos e não podem ser alterados."
    >
      <div className="flex flex-wrap items-end gap-2">
        <Input
          type="search"
          placeholder="Buscar por usuário, IP ou registro..."
          value={filters.search ?? ""}
          onChange={(event) =>
            updateFilters({ search: event.target.value || undefined })
          }
          className="max-w-xs"
        />
        <select
          aria-label="Usuário"
          value={filters.usuarioId ?? ""}
          onChange={(event) =>
            updateFilters({ usuarioId: event.target.value || undefined })
          }
          className={selectClass}
        >
          <option value="">Todos os usuários</option>
          {options?.usuarios.map((usuario) => (
            <option key={usuario.id} value={usuario.id}>
              {usuario.nome}
            </option>
          ))}
        </select>
        <select
          aria-label="Módulo"
          value={filters.entidade ?? ""}
          onChange={(event) =>
            updateFilters({ entidade: event.target.value || undefined })
          }
          className={selectClass}
        >
          <option value="">Todos os módulos</option>
          {options?.entidades.map((entidade) => (
            <option key={entidade} value={entidade}>
              {moduleLabel(entidade)}
            </option>
          ))}
        </select>
        <select
          aria-label="Ação"
          value={filters.acao ?? ""}
          onChange={(event) =>
            updateFilters({ acao: event.target.value || undefined })
          }
          className={selectClass}
        >
          <option value="">Todas as ações</option>
          {options?.acoes.map((acao) => (
            <option key={acao} value={acao}>
              {actionLabel(acao)}
            </option>
          ))}
        </select>
        <label className="grid gap-1 text-xs text-muted-foreground">
          De
          <Input
            type="date"
            value={filters.dataInicio ?? ""}
            onChange={(event) =>
              updateFilters({ dataInicio: event.target.value || undefined })
            }
          />
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          até
          <Input
            type="date"
            value={filters.dataFim ?? ""}
            onChange={(event) =>
              updateFilters({ dataFim: event.target.value || undefined })
            }
          />
        </label>
      </div>

      {isLoading && <p className="text-sm">Carregando...</p>}
      {isError && (
        <p className="text-sm text-destructive">
          Erro ao carregar a auditoria.
        </p>
      )}

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3 font-medium">Quando</th>
              <th className="p-3 font-medium">Usuário</th>
              <th className="p-3 font-medium">Ação</th>
              <th className="p-3 font-medium">Módulo</th>
              <th className="p-3 font-medium">IP</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {!isLoading && entries.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={6}>
                  Nenhum registro encontrado.
                </td>
              </tr>
            )}
            {entries.map((entry) => (
              <tr key={entry.id} className="border-t hover:bg-muted/30">
                <td className="whitespace-nowrap p-3">
                  {dayjs(entry.createdAt).format("DD/MM/YYYY HH:mm")}
                </td>
                <td className="p-3">
                  <span className="font-medium">{userName(entry)}</span>
                  {entry.filial && (
                    <span className="block text-xs text-muted-foreground">
                      {entry.filial.nome}
                    </span>
                  )}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2 py-0.5 text-xs ${ACTION_STYLE[entry.acao] ?? "bg-purple-100 text-purple-800"}`}
                  >
                    {actionLabel(entry.acao)}
                  </span>
                </td>
                <td className="p-3">{moduleLabel(entry.entidade)}</td>
                <td className="p-3 text-xs text-muted-foreground">
                  {entry.ip?.replace("::ffff:", "") ?? "—"}
                </td>
                <td className="p-3 text-right">
                  <Button
                    size="sm"
                    variant="ghost"
                    aria-label="Ver detalhes"
                    onClick={() => setSelected(entry)}
                  >
                    <Eye className="size-4" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 1 && (
        <PaginationIconsOnly
          currentPage={pagination.page}
          currentLimit={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) => updateFilters({ limit })}
        />
      )}

      <Dialog
        open={selected !== null}
        onOpenChange={(open) => !open && setSelected(null)}
      >
        <DialogContent className="max-h-dvh overflow-y-auto max-w-2xl!">
          <DialogHeader>
            <DialogTitle>Detalhe da auditoria</DialogTitle>
            <DialogDescription>
              {selected &&
                `${actionLabel(selected.acao)} · ${moduleLabel(selected.entidade)}`}
            </DialogDescription>
          </DialogHeader>
          {selected && <AuditDetail entry={selected} />}
        </DialogContent>
      </Dialog>
    </CardPage>
  );
}
