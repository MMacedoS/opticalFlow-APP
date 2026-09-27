import { useState } from "react";
import dayjs from "dayjs";
import {
  Ban,
  CheckCircle2,
  Pencil,
  Plus,
  RotateCcw,
  Trash2,
} from "lucide-react";

import { formatCurrencyDisplay } from "@/utils/masks";

import { EntryForm } from "../components/EntryForm";
import { SettleForm } from "../components/SettleForm";
import {
  useCancelFinancialEntry,
  useDeleteFinancialEntry,
  useFinancialEntries,
  useReverseFinancialEntry,
} from "../hooks/useFinancial";
import {
  PAYMENT_METHODS,
  type FinancialEntry,
  type FinancialFilters,
  type FinancialStatus,
  type FinancialType,
} from "../types/financial.type";

import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { CardPage } from "@/components/cards/CardPage";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";

type DialogState =
  | { mode: "create" }
  | { mode: "edit" | "settle"; entry: FinancialEntry }
  | null;

type ConfirmAction = "reverse" | "cancel" | "delete";
type ConfirmState = { action: ConfirmAction; entry: FinancialEntry } | null;

const TEXTS: Record<
  FinancialType,
  {
    title: string;
    description: string;
    pendente: string;
    pago: string;
    baixar: string;
  }
> = {
  despesa: {
    title: "Contas a pagar",
    description: "Despesas de compras e lançamentos avulsos.",
    pendente: "A pagar",
    pago: "Pago",
    baixar: "Pagar",
  },
  receita: {
    title: "Contas a receber",
    description: "Receitas de vendas e lançamentos avulsos.",
    pendente: "A receber",
    pago: "Recebido",
    baixar: "Receber",
  },
};

const STATUS_STYLE: Record<FinancialStatus, string> = {
  pendente: "bg-amber-100 text-amber-800",
  pago: "bg-green-100 text-green-800",
  cancelado: "bg-slate-200 text-slate-600",
};

const CONFIRM_TEXT: Record<
  ConfirmAction,
  { title: string; description: string }
> = {
  reverse: {
    title: "Estornar baixa?",
    description: "O lançamento voltará a ficar pendente.",
  },
  cancel: {
    title: "Cancelar lançamento?",
    description: "O lançamento deixará de contar nos totais.",
  },
  delete: {
    title: "Excluir lançamento?",
    description: "O lançamento será excluído permanentemente.",
  },
};

const methodLabel = (value: string | null) =>
  PAYMENT_METHODS.find((method) => method.value === value)?.label;

function origin(entry: FinancialEntry): string {
  if (entry.compra) {
    const fornecedor = entry.compra.fornecedor;
    return `Compra${fornecedor ? ` · ${fornecedor.nome_fantasia ?? fornecedor.razao_social}` : ""}`;
  }
  if (entry.venda) {
    return `Venda${entry.venda.cliente ? ` · ${entry.venda.cliente.pessoa.nome}` : " balcão"}`;
  }
  return `Avulso${entry.criado_por?.username ? ` · por ${entry.criado_por.username}` : ""}`;
}

const isOverdue = (entry: FinancialEntry) =>
  entry.status === "pendente" &&
  entry.vencimento !== null &&
  dayjs(entry.vencimento).isBefore(dayjs(), "day");

export function FinancialPage({ tipo }: { tipo: FinancialType }) {
  const texts = TEXTS[tipo];
  const [filters, setFilters] = useState<FinancialFilters>({
    page: 1,
    limit: 20,
    search: "",
    tipo,
    status: "pendente",
  });
  const [dialog, setDialog] = useState<DialogState>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const { data, isLoading, isError } = useFinancialEntries({
    ...filters,
    tipo,
  });
  const reverseMutation = useReverseFinancialEntry();
  const cancelMutation = useCancelFinancialEntry();
  const deleteMutation = useDeleteFinancialEntry();

  const entries = data?.data.lancamentos ?? [];
  const totals = data?.data.totais;
  const pagination = data?.data.pagination;

  const closeDialog = () => setDialog(null);
  const updateFilters = (patch: Partial<FinancialFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  const statusFilter = filters.vencidos ? "vencidos" : (filters.status ?? "");

  const runConfirm = () => {
    if (!confirm) return;
    const mutation = {
      reverse: reverseMutation,
      cancel: cancelMutation,
      delete: deleteMutation,
    }[confirm.action];
    mutation.mutate(confirm.entry.id);
    setConfirm(null);
  };

  return (
    <CardPage
      title={texts.title}
      description={texts.description}
      action={
        <Button size="sm" onClick={() => setDialog({ mode: "create" })}>
          <Plus className="mr-2 size-4" />
          Novo lançamento
        </Button>
      }
    >
      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { label: texts.pendente, value: totals?.pendente, className: "" },
          {
            label: "Vencido",
            value: totals?.vencido,
            className: "text-red-600",
          },
          {
            label: texts.pago,
            value: totals?.pago,
            className: "text-green-700",
          },
        ].map((card) => (
          <div key={card.label} className="rounded-xl border bg-background p-4">
            <p className="text-sm text-muted-foreground">{card.label}</p>
            <p className={`text-2xl font-semibold ${card.className}`}>
              {formatCurrencyDisplay(card.value ?? 0)}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-end gap-2">
        <Input
          type="search"
          placeholder="Buscar por descrição ou categoria..."
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          className="max-w-xs"
        />
        <select
          aria-label="Status"
          value={statusFilter}
          onChange={(event) => {
            const value = event.target.value;
            updateFilters({
              vencidos: value === "vencidos" || undefined,
              status:
                value === "vencidos" || value === ""
                  ? undefined
                  : (value as FinancialStatus),
            });
          }}
          className="rounded-lg border bg-background p-2 text-sm"
        >
          <option value="pendente">Pendentes</option>
          <option value="vencidos">Vencidos</option>
          <option value="pago">{texts.pago}s</option>
          <option value="cancelado">Cancelados</option>
          <option value="">Todos</option>
        </select>
        <label className="grid gap-1 text-xs text-muted-foreground">
          Vencimento de
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
              updateFilters({
                dataFim: event.target.value
                  ? dayjs(event.target.value).endOf("day").toISOString()
                  : undefined,
              })
            }
          />
        </label>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3 font-medium">Vencimento</th>
              <th className="p-3 font-medium">Descrição</th>
              <th className="p-3 font-medium">Categoria</th>
              <th className="p-3 text-right font-medium">Valor</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="p-3" colSpan={6}>
                  Carregando...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td className="p-3 text-destructive" colSpan={6}>
                  Erro ao carregar lançamentos.
                </td>
              </tr>
            )}
            {!isLoading && !isError && entries.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={6}>
                  Nenhum lançamento encontrado.
                </td>
              </tr>
            )}
            {entries.map((entry) => {
              const isAvulso = !entry.compraId && !entry.vendaId;
              const overdue = isOverdue(entry);
              return (
                <tr key={entry.id} className="border-t">
                  <td
                    className={`p-3 whitespace-nowrap ${overdue ? "font-medium text-red-600" : ""}`}
                  >
                    {entry.vencimento
                      ? dayjs(entry.vencimento).format("DD/MM/YYYY")
                      : "—"}
                    {overdue && <span className="block text-xs">vencido</span>}
                  </td>
                  <td className="p-3">
                    {entry.descricao ?? "—"}
                    <span className="block text-xs text-muted-foreground">
                      {origin(entry)}
                    </span>
                  </td>
                  <td className="p-3">{entry.categoria ?? "—"}</td>
                  <td className="p-3 text-right font-mono">
                    {formatCurrencyDisplay(entry.valor)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${STATUS_STYLE[entry.status]}`}
                    >
                      {entry.status === "pago" ? texts.pago : entry.status}
                    </span>
                    {entry.status === "pago" && (
                      <span className="block text-xs text-muted-foreground">
                        {entry.pagoEm &&
                          dayjs(entry.pagoEm).format("DD/MM/YYYY")}
                        {entry.forma_pagamento &&
                          ` · ${methodLabel(entry.forma_pagamento)}`}
                      </span>
                    )}
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      {entry.status === "pendente" && (
                        <Button
                          size="sm"
                          onClick={() => setDialog({ mode: "settle", entry })}
                        >
                          <CheckCircle2 className="mr-1 size-4" />
                          {texts.baixar}
                        </Button>
                      )}
                      {entry.status === "pago" && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() =>
                            setConfirm({ action: "reverse", entry })
                          }
                        >
                          <RotateCcw className="mr-1 size-4" />
                          Estornar
                        </Button>
                      )}
                      {isAvulso && entry.status === "pendente" && (
                        <>
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Editar"
                            title="Editar"
                            onClick={() => setDialog({ mode: "edit", entry })}
                          >
                            <Pencil className="size-4" />
                          </Button>
                          <Button
                            size="sm"
                            variant="ghost"
                            aria-label="Cancelar lançamento"
                            title="Cancelar lançamento"
                            onClick={() =>
                              setConfirm({ action: "cancel", entry })
                            }
                          >
                            <Ban className="size-4" />
                          </Button>
                        </>
                      )}
                      {isAvulso && entry.status !== "pago" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Excluir"
                          title="Excluir"
                          onClick={() =>
                            setConfirm({ action: "delete", entry })
                          }
                        >
                          <Trash2 className="size-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {pagination && pagination.totalPages > 0 && (
        <PaginationIconsOnly
          currentPage={pagination.page}
          currentLimit={pagination.limit}
          totalPages={pagination.totalPages}
          onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
          onLimitChange={(limit) => updateFilters({ limit })}
        />
      )}

      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-w-xl!">
          {dialog && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {dialog.mode === "create" &&
                    (tipo === "despesa" ? "Nova despesa" : "Nova receita")}
                  {dialog.mode === "edit" && "Editar lançamento"}
                  {dialog.mode === "settle" &&
                    (tipo === "despesa"
                      ? "Registrar pagamento"
                      : "Registrar recebimento")}
                </DialogTitle>
              </DialogHeader>
              {dialog.mode === "create" && (
                <EntryForm tipo={tipo} onDone={closeDialog} />
              )}
              {dialog.mode === "edit" && (
                <EntryForm
                  tipo={tipo}
                  entry={dialog.entry}
                  onDone={closeDialog}
                />
              )}
              {dialog.mode === "settle" && (
                <SettleForm entry={dialog.entry} onDone={closeDialog} />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertConfirm
        title={confirm ? CONFIRM_TEXT[confirm.action].title : ""}
        description={confirm ? CONFIRM_TEXT[confirm.action].description : ""}
        isOpen={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={runConfirm}
      />
    </CardPage>
  );
}

export function PayablePage() {
  return <FinancialPage tipo="despesa" />;
}

export function ReceivablePage() {
  return <FinancialPage tipo="receita" />;
}
