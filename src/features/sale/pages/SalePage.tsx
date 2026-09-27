import { useState } from "react";
import dayjs from "dayjs";
import { Ban, CheckCircle2, Eye, Pencil, Plus, Trash2 } from "lucide-react";

import { formatCurrencyDisplay } from "@/utils/masks";

import { FinalizeSaleForm } from "../components/FinalizeSaleForm";
import { SaleDetails } from "../components/SaleDetails";
import { SaleForm } from "../components/SaleForm";
import { useCancelSale, useDeleteSale, useSales } from "../hooks/useSales";
import type { Sale, SaleFilters, SaleStatus } from "../types/sale.type";

import { AlertConfirm } from "@/components/alert/AlertConfirm";
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

type DialogState =
  | { mode: "create" }
  | { mode: "edit" | "view" | "finalize"; sale: Sale }
  | null;

type ConfirmState = { action: "cancel" | "delete"; sale: Sale } | null;

const STATUS: Record<SaleStatus, { label: string; className: string }> = {
  aberta: { label: "Aberta", className: "bg-amber-100 text-amber-800" },
  finalizada: { label: "Finalizada", className: "bg-green-100 text-green-800" },
  cancelada: { label: "Cancelada", className: "bg-slate-200 text-slate-600" },
};

const DIALOG_TITLE: Record<NonNullable<DialogState>["mode"], string> = {
  create: "Nova venda",
  edit: "Editar venda",
  view: "Venda",
  finalize: "Finalizar venda",
};

const customerName = (sale: Sale) => sale.cliente?.pessoa.nome ?? "Consumidor";

export function SalePage() {
  const [filters, setFilters] = useState<SaleFilters>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [dialog, setDialog] = useState<DialogState>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const { data, isLoading, isError } = useSales(filters);
  const cancelMutation = useCancelSale();
  const deleteMutation = useDeleteSale();
  const sales = data?.data.vendas ?? [];
  const pagination = data?.data.pagination;

  const closeDialog = () => setDialog(null);
  const updateFilters = (patch: Partial<SaleFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  return (
    <CardPage
      title="Vendas"
      description="Vendas de balcão ou geradas pela ordem de serviço. O estoque baixa ao finalizar."
      action={
        <Button size="sm" onClick={() => setDialog({ mode: "create" })}>
          <Plus className="mr-2 size-4" />
          Nova venda
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Input
          type="search"
          placeholder="Buscar por cliente ou observação..."
          value={filters.search}
          onChange={(event) => updateFilters({ search: event.target.value })}
          className="max-w-sm"
        />
        <select
          aria-label="Status"
          value={filters.status ?? ""}
          onChange={(event) =>
            updateFilters({
              status: (event.target.value || undefined) as
                SaleStatus | undefined,
            })
          }
          className="rounded-lg border bg-background p-2 text-sm"
        >
          <option value="">Todos os status</option>
          <option value="aberta">Aberta</option>
          <option value="finalizada">Finalizada</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3 font-medium">Data</th>
              <th className="p-3 font-medium">Cliente</th>
              <th className="p-3 font-medium">Itens</th>
              <th className="p-3 text-right font-medium">Total</th>
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
                  Erro ao carregar vendas.
                </td>
              </tr>
            )}
            {!isLoading && !isError && sales.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={6}>
                  Nenhuma venda encontrada.
                </td>
              </tr>
            )}
            {sales.map((sale) => {
              const status = STATUS[sale.status];
              const isOpen = sale.status === "aberta";
              return (
                <tr key={sale.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">
                    {dayjs(sale.dataVenda).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-3">
                    {customerName(sale)}
                    <span className="block text-xs text-muted-foreground">
                      {sale.ordem_servico
                        ? `OS ${sale.ordem_servico.numero ?? ""}`
                        : sale.filial.nome}
                    </span>
                  </td>
                  <td className="p-3">{sale.itens.length}</td>
                  <td className="p-3 text-right font-mono">
                    {formatCurrencyDisplay(sale.valor_total)}
                  </td>
                  <td className="p-3">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${status.className}`}
                    >
                      {status.label}
                    </span>
                  </td>
                  <td className="p-3">
                    <div className="flex justify-end gap-1">
                      {isOpen && (
                        <Button
                          size="sm"
                          onClick={() => setDialog({ mode: "finalize", sale })}
                        >
                          <CheckCircle2 className="mr-1 size-4" />
                          Finalizar
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={isOpen ? "Editar" : "Ver detalhes"}
                        title={isOpen ? "Editar" : "Ver detalhes"}
                        onClick={() =>
                          setDialog({ mode: isOpen ? "edit" : "view", sale })
                        }
                      >
                        {isOpen ? (
                          <Pencil className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                      {sale.status !== "cancelada" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Cancelar venda"
                          title="Cancelar venda"
                          onClick={() => setConfirm({ action: "cancel", sale })}
                        >
                          <Ban className="size-4" />
                        </Button>
                      )}
                      {isOpen && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Excluir"
                          title="Excluir"
                          onClick={() => setConfirm({ action: "delete", sale })}
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
        <DialogContent className="max-h-dvh overflow-y-auto max-w-4xl!">
          {dialog && (
            <>
              <DialogHeader>
                <DialogTitle>{DIALOG_TITLE[dialog.mode]}</DialogTitle>
                {dialog.mode !== "create" && (
                  <DialogDescription>
                    {customerName(dialog.sale)} ·{" "}
                    {formatCurrencyDisplay(dialog.sale.valor_total)}
                  </DialogDescription>
                )}
              </DialogHeader>
              {dialog.mode === "create" && <SaleForm onDone={closeDialog} />}
              {dialog.mode === "edit" && (
                <SaleForm sale={dialog.sale} onDone={closeDialog} />
              )}
              {dialog.mode === "view" && <SaleDetails sale={dialog.sale} />}
              {dialog.mode === "finalize" && (
                <FinalizeSaleForm sale={dialog.sale} onDone={closeDialog} />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertConfirm
        title={
          confirm?.action === "delete" ? "Excluir venda?" : "Cancelar venda?"
        }
        description={
          confirm?.action === "delete"
            ? "A venda aberta será excluída permanentemente."
            : confirm?.sale.status === "finalizada"
              ? "Os produtos voltarão ao estoque (estorno) e a receita será cancelada."
              : "A venda será marcada como cancelada."
        }
        isOpen={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.action === "delete")
            deleteMutation.mutate(confirm.sale.id);
          if (confirm?.action === "cancel")
            cancelMutation.mutate(confirm.sale.id);
          setConfirm(null);
        }}
      />
    </CardPage>
  );
}
