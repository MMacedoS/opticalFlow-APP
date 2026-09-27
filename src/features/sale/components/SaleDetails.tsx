import dayjs from "dayjs";

import { formatCurrencyDisplay } from "@/utils/masks";

import type { Sale } from "../types/sale.type";

export function SaleDetails({ sale }: { sale: Sale }) {
  const receita = sale.financeiro[0];

  return (
    <div className="space-y-4 text-sm">
      <dl className="grid gap-x-6 gap-y-1 sm:grid-cols-[auto_1fr]">
        <dt className="text-muted-foreground">Cliente</dt>
        <dd>{sale.cliente?.pessoa.nome ?? "Consumidor"}</dd>
        <dt className="text-muted-foreground">Filial</dt>
        <dd>{sale.filial.nome}</dd>
        <dt className="text-muted-foreground">Data da venda</dt>
        <dd>{dayjs(sale.dataVenda).format("DD/MM/YYYY")}</dd>
        {sale.ordem_servico && (
          <>
            <dt className="text-muted-foreground">Ordem de serviço</dt>
            <dd>
              {sale.ordem_servico.numero ?? sale.ordem_servico.id} ·{" "}
              {sale.ordem_servico.status}
            </dd>
          </>
        )}
        {sale.finalizadaEm && (
          <>
            <dt className="text-muted-foreground">Finalizada em</dt>
            <dd>{dayjs(sale.finalizadaEm).format("DD/MM/YYYY HH:mm")}</dd>
          </>
        )}
        {receita && (
          <>
            <dt className="text-muted-foreground">Receita</dt>
            <dd>
              {formatCurrencyDisplay(receita.valor)} · {receita.status}
              {receita.status !== "pago" &&
                receita.vencimento &&
                ` · vence ${dayjs(receita.vencimento).format("DD/MM/YYYY")}`}
            </dd>
          </>
        )}
        {sale.observacoes && (
          <>
            <dt className="text-muted-foreground">Observações</dt>
            <dd className="whitespace-pre-wrap">{sale.observacoes}</dd>
          </>
        )}
      </dl>

      <table className="w-full rounded-lg border text-sm">
        <thead className="bg-muted/60 text-left">
          <tr>
            <th className="p-2 font-medium">Item</th>
            <th className="p-2 text-right font-medium">Qtd.</th>
            <th className="p-2 text-right font-medium">Valor unit.</th>
            <th className="p-2 text-right font-medium">Desconto</th>
            <th className="p-2 text-right font-medium">Subtotal</th>
          </tr>
        </thead>
        <tbody>
          {sale.itens.map((item) => (
            <tr key={item.id} className="border-t">
              <td className="p-2">
                {item.produto?.nome ?? item.descricao_servico}
                <span className="block text-xs text-muted-foreground">
                  {item.produto?.sku ?? "Serviço"}
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
              {formatCurrencyDisplay(sale.valor_total)}
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}
