import { useMemo, useState } from "react";
import {
  AlertTriangle,
  ArrowDownUp,
  History,
  PackagePlus,
  SlidersHorizontal,
} from "lucide-react";

import { AddItemForm } from "../components/AddItemForm";
import { LimitsForm } from "../components/LimitsForm";
import { MovementForm } from "../components/MovementForm";
import { MovementHistory } from "../components/MovementHistory";
import { useStockItems, useStocks } from "../hooks/useStock";
import type {
  ProductType,
  StockItem,
  StockItemFilters,
} from "../types/stock.type";

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
  | { mode: "movement" | "limits" | "history"; item: StockItem }
  | { mode: "add" }
  | null;

const TYPE_LABEL: Record<ProductType, string> = {
  armacao: "Armação",
  lente: "Lente",
  acessorio: "Acessório",
  servico: "Serviço",
};

const isBelowMinimum = (item: StockItem) =>
  item.minimo !== null && item.quantidade <= item.minimo;

export function StockPage() {
  const stocks = useStocks();
  const stockList = stocks.data?.data ?? [];
  const [selectedStockId, setSelectedStockId] = useState<string>();
  const estoqueId = selectedStockId ?? stockList[0]?.id;
  const stock = stockList.find((item) => item.id === estoqueId);

  const [filters, setFilters] = useState<Omit<StockItemFilters, "estoqueId">>({
    page: 1,
    limit: 20,
    search: "",
  });
  const items = useStockItems({ ...filters, estoqueId }, Boolean(estoqueId));
  const itemList = useMemo(() => items.data?.data.itens ?? [], [items.data]);
  const pagination = items.data?.data.pagination;

  const [dialog, setDialog] = useState<DialogState>(null);
  const closeDialog = () => setDialog(null);

  const existingProductIds = useMemo(
    () => new Set(itemList.map((item) => item.produtoId)),
    [itemList],
  );

  const updateFilters = (patch: Partial<typeof filters>) =>
    setFilters((prev) => ({ ...prev, ...patch, page: 1 }));

  return (
    <CardPage
      title="Estoque"
      description="Saldo por produto. O saldo muda apenas por movimentações."
      action={
        estoqueId && (
          <Button size="sm" onClick={() => setDialog({ mode: "add" })}>
            <PackagePlus className="mr-2 size-4" />
            Adicionar produto
          </Button>
        )
      }
    >
      {stocks.isLoading && <p className="text-sm">Carregando estoques...</p>}
      {!stocks.isLoading && stockList.length === 0 && (
        <p className="rounded-lg border border-dashed p-6 text-center text-sm text-muted-foreground">
          Nenhum estoque cadastrado. O estoque da filial é criado ao cadastrar o
          primeiro produto com saldo.
        </p>
      )}

      {stock && (
        <>
          <div className="flex flex-wrap items-end gap-3">
            {stockList.length > 1 && (
              <label className="grid gap-1 text-sm">
                <span className="text-muted-foreground">Filial</span>
                <select
                  value={estoqueId}
                  onChange={(event) => {
                    setSelectedStockId(event.target.value);
                    updateFilters({});
                  }}
                  className="rounded-lg border bg-background p-2"
                >
                  {stockList.map((item) => (
                    <option key={item.id} value={item.id}>
                      {item.filial.nome}
                    </option>
                  ))}
                </select>
              </label>
            )}
            <div className="flex gap-3 text-sm">
              <span className="rounded-lg bg-muted px-3 py-2">
                <strong>{stock._count.itens}</strong> produtos
              </span>
              <button
                type="button"
                onClick={() =>
                  updateFilters({ abaixoMinimo: !filters.abaixoMinimo })
                }
                aria-pressed={Boolean(filters.abaixoMinimo)}
                className={`flex items-center gap-1.5 rounded-lg px-3 py-2 ${
                  filters.abaixoMinimo
                    ? "bg-red-600 text-white"
                    : stock.abaixoMinimo > 0
                      ? "bg-red-50 text-red-700 hover:bg-red-100"
                      : "bg-muted"
                }`}
              >
                <AlertTriangle className="size-4" />
                <strong>{stock.abaixoMinimo}</strong> abaixo do mínimo
              </button>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            <Input
              type="search"
              placeholder="Buscar por nome, SKU ou categoria..."
              value={filters.search}
              onChange={(event) =>
                updateFilters({ search: event.target.value })
              }
              className="max-w-sm"
            />
            <select
              value={filters.tipo ?? ""}
              onChange={(event) =>
                updateFilters({
                  tipo: (event.target.value || undefined) as
                    ProductType | undefined,
                })
              }
              aria-label="Tipo de produto"
              className="rounded-lg border bg-background p-2 text-sm"
            >
              <option value="">Todos os tipos</option>
              <option value="armacao">Armação</option>
              <option value="lente">Lente</option>
              <option value="acessorio">Acessório</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  <th className="p-3 font-medium">Produto</th>
                  <th className="p-3 font-medium">Tipo</th>
                  <th className="p-3 text-right font-medium">Saldo</th>
                  <th className="p-3 text-right font-medium">Mín.</th>
                  <th className="p-3 text-right font-medium">Máx.</th>
                  <th className="p-3" />
                </tr>
              </thead>
              <tbody>
                {items.isLoading && (
                  <tr>
                    <td className="p-3" colSpan={6}>
                      Carregando...
                    </td>
                  </tr>
                )}
                {!items.isLoading && itemList.length === 0 && (
                  <tr>
                    <td className="p-3 text-muted-foreground" colSpan={6}>
                      Nenhum produto encontrado.
                    </td>
                  </tr>
                )}
                {itemList.map((item) => (
                  <tr key={item.id} className="border-t">
                    <td className="p-3">
                      <p className="font-medium">{item.produto.nome}</p>
                      <p className="text-xs text-muted-foreground">
                        {item.produto.sku}
                        {item.produto.ativo === "inativo" && " · inativo"}
                      </p>
                    </td>
                    <td className="p-3">{TYPE_LABEL[item.produto.tipo]}</td>
                    <td
                      className={`p-3 text-right font-mono font-semibold ${
                        isBelowMinimum(item) ? "text-red-600" : ""
                      }`}
                    >
                      {item.quantidade}
                      {isBelowMinimum(item) && (
                        <AlertTriangle
                          className="ml-1 inline size-3.5"
                          aria-label="abaixo do mínimo"
                        />
                      )}
                    </td>
                    <td className="p-3 text-right">{item.minimo ?? "—"}</td>
                    <td className="p-3 text-right">{item.maximo ?? "—"}</td>
                    <td className="p-3">
                      <div className="flex justify-end gap-1">
                        <Button
                          size="sm"
                          onClick={() => setDialog({ mode: "movement", item })}
                        >
                          <ArrowDownUp className="mr-1 size-4" />
                          Movimentar
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Limites"
                          title="Mínimo e máximo"
                          onClick={() => setDialog({ mode: "limits", item })}
                        >
                          <SlidersHorizontal className="size-4" />
                        </Button>
                        <Button
                          size="sm"
                          variant="ghost"
                          aria-label="Histórico"
                          title="Histórico"
                          onClick={() => setDialog({ mode: "history", item })}
                        >
                          <History className="size-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
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
        </>
      )}

      <Dialog
        open={dialog !== null}
        onOpenChange={(open) => !open && closeDialog()}
      >
        <DialogContent className="max-w-2xl!">
          {dialog?.mode === "add" && estoqueId && (
            <>
              <DialogHeader>
                <DialogTitle>Adicionar produto ao estoque</DialogTitle>
                <DialogDescription>{stock?.filial.nome}</DialogDescription>
              </DialogHeader>
              <AddItemForm
                estoqueId={estoqueId}
                existingProductIds={existingProductIds}
                onDone={closeDialog}
              />
            </>
          )}
          {dialog && dialog.mode !== "add" && (
            <>
              <DialogHeader>
                <DialogTitle>
                  {dialog.mode === "movement" && "Movimentar estoque"}
                  {dialog.mode === "limits" && "Mínimo e máximo"}
                  {dialog.mode === "history" && "Histórico de movimentações"}
                </DialogTitle>
                <DialogDescription>
                  {dialog.item.produto.nome} · {dialog.item.produto.sku}
                </DialogDescription>
              </DialogHeader>
              {dialog.mode === "movement" && (
                <MovementForm item={dialog.item} onDone={closeDialog} />
              )}
              {dialog.mode === "limits" && (
                <LimitsForm item={dialog.item} onDone={closeDialog} />
              )}
              {dialog.mode === "history" && (
                <MovementHistory
                  estoqueId={dialog.item.estoqueId}
                  produtoId={dialog.item.produtoId}
                />
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </CardPage>
  );
}
