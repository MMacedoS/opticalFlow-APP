import { useState } from "react";
import dayjs from "dayjs";
import { Ban, Eye, PackageCheck, Pencil, Plus, Trash2 } from "lucide-react";

import { formatCurrencyDisplay } from "@/utils/masks";

import { PurchaseDetails } from "../components/PurchaseDetails";
import { PurchaseForm } from "../components/PurchaseForm";
import { ReceivePurchaseForm } from "../components/ReceivePurchaseForm";
import {
  useCancelPurchase,
  useDeletePurchase,
  usePurchases,
} from "../hooks/usePurchases";
import type {
  Purchase,
  PurchaseFilters,
  PurchaseStatus,
} from "../types/purchase.type";

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
  | { mode: "edit" | "view" | "receive"; purchase: Purchase }
  | null;

type ConfirmState = { action: "cancel" | "delete"; purchase: Purchase } | null;

const STATUS: Record<PurchaseStatus, { label: string; className: string }> = {
  rascunho: { label: "Rascunho", className: "bg-amber-100 text-amber-800" },
  recebida: { label: "Recebida", className: "bg-green-100 text-green-800" },
  cancelada: { label: "Cancelada", className: "bg-slate-200 text-slate-600" },
};

const supplierName = (purchase: Purchase) =>
  purchase.fornecedor
    ? (purchase.fornecedor.nome_fantasia ?? purchase.fornecedor.razao_social)
    : "Sem fornecedor";

export function PurchasePage() {
  const [filters, setFilters] = useState<PurchaseFilters>({
    page: 1,
    limit: 10,
    search: "",
  });
  const [dialog, setDialog] = useState<DialogState>(null);
  const [confirm, setConfirm] = useState<ConfirmState>(null);

  const { data, isLoading, isError } = usePurchases(filters);
  const cancelMutation = useCancelPurchase();
  const deleteMutation = useDeletePurchase();
  const purchases = data?.data.compras ?? [];
  const pagination = data?.data.pagination;

  const closeDialog = () => setDialog(null);
  const updateFilters = (patch: Partial<PurchaseFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  const dialogTitle: Record<NonNullable<DialogState>["mode"], string> = {
    create: "Nova compra",
    edit: "Editar compra",
    view: "Compra",
    receive: "Receber compra",
  };

  return (
    <CardPage
      title="Compras"
      description="Compras de fornecedores. O estoque só é atualizado ao receber a compra."
      action={
        <Button size="sm" onClick={() => setDialog({ mode: "create" })}>
          <Plus className="mr-2 size-4" />
          Nova compra
        </Button>
      }
    >
      <div className="flex flex-wrap gap-2">
        <Input
          type="search"
          placeholder="Buscar por fornecedor ou observação..."
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
                PurchaseStatus | undefined,
            })
          }
          className="rounded-lg border bg-background p-2 text-sm"
        >
          <option value="">Todos os status</option>
          <option value="rascunho">Rascunho</option>
          <option value="recebida">Recebida</option>
          <option value="cancelada">Cancelada</option>
        </select>
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3 font-medium">Data</th>
              <th className="p-3 font-medium">Fornecedor</th>
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
                  Erro ao carregar compras.
                </td>
              </tr>
            )}
            {!isLoading && !isError && purchases.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={6}>
                  Nenhuma compra encontrada.
                </td>
              </tr>
            )}
            {purchases.map((purchase) => {
              const status = STATUS[purchase.status];
              const isDraft = purchase.status === "rascunho";
              return (
                <tr key={purchase.id} className="border-t">
                  <td className="p-3 whitespace-nowrap">
                    {dayjs(purchase.dataCompra).format("DD/MM/YYYY")}
                  </td>
                  <td className="p-3">
                    {supplierName(purchase)}
                    <span className="block text-xs text-muted-foreground">
                      {purchase.filial.nome}
                    </span>
                  </td>
                  <td className="p-3">{purchase.itens.length}</td>
                  <td className="p-3 text-right font-mono">
                    {formatCurrencyDisplay(purchase.valor_total)}
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
                      {isDraft && (
                        <Button
                          size="sm"
                          onClick={() =>
                            setDialog({ mode: "receive", purchase })
                          }
                        >
                          <PackageCheck className="mr-1 size-4" />
                          Receber
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="ghost"
                        aria-label={isDraft ? "Editar" : "Ver detalhes"}
                        title={isDraft ? "Editar" : "Ver detalhes"}
                        onClick={() =>
                          setDialog({
                            mode: isDraft ? "edit" : "view",
                            purchase,
                          })
                        }
                      >
                        {isDraft ? (
                          <Pencil className="size-4" />
                        ) : (
                          <Eye className="size-4" />
                        )}
                      </Button>
                      {purchase.status !== "cancelada" && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Cancelar compra"
                          title="Cancelar compra"
                          onClick={() =>
                            setConfirm({ action: "cancel", purchase })
                          }
                        >
                          <Ban className="size-4" />
                        </Button>
                      )}
                      {isDraft && (
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Excluir"
                          title="Excluir"
                          onClick={() =>
                            setConfirm({ action: "delete", purchase })
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
        <DialogContent className="max-h-dvh overflow-y-auto max-w-4xl!">
          {dialog && (
            <>
              <DialogHeader>
                <DialogTitle>{dialogTitle[dialog.mode]}</DialogTitle>
                {dialog.mode !== "create" && (
                  <DialogDescription>
                    {supplierName(dialog.purchase)} ·{" "}
                    {formatCurrencyDisplay(dialog.purchase.valor_total)}
                  </DialogDescription>
                )}
              </DialogHeader>
              {dialog.mode === "create" && (
                <PurchaseForm onDone={closeDialog} />
              )}
              {dialog.mode === "edit" && (
                <PurchaseForm purchase={dialog.purchase} onDone={closeDialog} />
              )}
              {dialog.mode === "view" && (
                <PurchaseDetails purchase={dialog.purchase} />
              )}
              {dialog.mode === "receive" && (
                <ReceivePurchaseForm
                  purchase={dialog.purchase}
                  onDone={closeDialog}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertConfirm
        title={
          confirm?.action === "delete" ? "Excluir compra?" : "Cancelar compra?"
        }
        description={
          confirm?.action === "delete"
            ? "O rascunho será excluído permanentemente."
            : confirm?.purchase.status === "recebida"
              ? "Os produtos sairão do estoque (estorno) e a despesa será cancelada."
              : "O rascunho será marcado como cancelado."
        }
        isOpen={confirm !== null}
        onClose={() => setConfirm(null)}
        onConfirm={() => {
          if (confirm?.action === "delete")
            deleteMutation.mutate(confirm.purchase.id);
          if (confirm?.action === "cancel")
            cancelMutation.mutate(confirm.purchase.id);
          setConfirm(null);
        }}
      />
    </CardPage>
  );
}
