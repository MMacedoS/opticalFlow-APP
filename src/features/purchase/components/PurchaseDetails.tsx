import dayjs from "dayjs";

import { formatCurrencyDisplay } from "@/utils/masks";

import type { Purchase } from "../types/purchase.type";

export function PurchaseDetails({ purchase }: { purchase: Purchase }) {
  const despesa = purchase.financeiro[0];

  return (
    <div className="space-y-4 text-sm">
      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
        <dt className="text-muted-foreground">Fornecedor</dt>
        <dd>
          {purchase.fornecedor
            ? (purchase.fornecedor.nome_fantasia ??
              purchase.fornecedor.razao_social)
            : "—"}
        </dd>
        <dt className="text-muted-foreground">Filial</dt>
        <dd>{purchase.filial.nome}</dd>
        <dt className="text-muted-foreground">Data da compra</dt>
        <dd>{dayjs(purchase.dataCompra).format("DD/MM/YYYY")}</dd>
        {purchase.recebidaEm && (
          <>
            <dt className="text-muted-foreground">Recebida em</dt>
            <dd>{dayjs(purchase.recebidaEm).format("DD/MM/YYYY HH:mm")}</dd>
          </>
        )}
        {despesa && (
          <>
            <dt className="text-muted-foreground">Despesa</dt>
            <dd>
              {formatCurrencyDisplay(despesa.valor)} · {despesa.status}
              {despesa.vencimento &&
                ` · vence ${dayjs(despesa.vencimento).format("DD/MM/YYYY")}`}
            </dd>
          </>
        )}
        {purchase.observacoes && (
          <>
            <dt className="text-muted-foreground">Observações</dt>
            <dd className="whitespace-pre-wrap">{purchase.observacoes}</dd>
          </>
        )}
      </dl>

      <table className="w-full rounded-lg border text-sm">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="p-2 font-medium">Produto</th>
            <th className="p-2 text-right font-medium">Qtd.</th>
            <th className="p-2 text-right font-medium">Valor unit.</th>
            <th className="p-2 text-right font-medium">Desconto</th>
            <th className="p-2 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {purchase.itens.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">
                {item.produto.nome}
                <span className="block text-xs text-muted-foreground">
                  {item.produto.sku}
                </span>
              </td>
              <td className="p-2 text-right">{item.quantidade}</td>
              <td className="p-2 text-right">
                {formatCurrencyDisplay(item.valor_unitario)}
              </td>
              <td className="p-2 text-right">
                {item.desconto ? formatCurrencyDisplay(item.desconto) : "—"}
              </td>
              <td className="p-2 text-right font-mono">
                {formatCurrencyDisplay(
                  item.quantidade * item.valor_unitario - (item.desconto ?? 0),
                )}
              </td>
            </tr>
          ))}
        </tbody>
        <tfoot>
          <tr className="border-t font-semibold">
            <td className="p-2" colSpan={4}>
              Total
            </td>
            <td className="p-2 text-right font-mono">
              {formatCurrencyDisplay(purchase.valor_total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
