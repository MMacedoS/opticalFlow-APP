import dayjs from "dayjs";

import { useStockMovements } from "../hooks/useStock";
import type { MovementType } from "../types/stock.type";

const TYPE_LABEL: Record<MovementType, string> = {
  entrada: "Entrada",
  saida: "Saída",
  ajuste: "Ajuste",
};

function signedQuantity(tipo: MovementType, quantidade: number): string {
  if (tipo === "entrada") return `+${quantidade}`;
  if (tipo === "saida") return `−${quantidade}`;
  return quantidade > 0 ? `+${quantidade}` : `${quantidade}`.replace("-", "−");
}

export function MovementHistory({
  estoqueId,
  produtoId,
}: {
  estoqueId: string;
  produtoId: string;
}) {
  const { data, isLoading, isError } = useStockMovements(estoqueId, produtoId);
  const movements = data?.data.movimentos ?? [];

  if (isLoading) return <p className="text-sm">Carregando...</p>;
  if (isError) {
    return (
      <p className="text-sm text-destructive">Erro ao carregar histórico.</p>
    );
  }
  if (movements.length === 0) {
    return (
      <p className="text-sm text-muted-foreground">
        Nenhuma movimentação registrada para este produto.
      </p>
    );
  }

  return (
    <div className="max-h-96 overflow-y-auto rounded-lg border">
      <table className="w-full text-sm">
        <thead className="sticky top-0 bg-muted text-left">
          <tr>
            <th className="p-2 font-medium">Data</th>
            <th className="p-2 font-medium">Tipo</th>
            <th className="p-2 text-right font-medium">Qtd.</th>
            <th className="p-2 font-medium">Motivo / referência</th>
          </tr>
        </thead>
        <tbody>
          {movements.map((movement) => (
            <tr key={movement.id} className="border-t">
              <td className="p-2 whitespace-nowrap">
                {dayjs(movement.createdAt).format("DD/MM/YYYY HH:mm")}
              </td>
              <td className="p-2">{TYPE_LABEL[movement.tipo]}</td>
              <td className="p-2 text-right font-mono">
                {signedQuantity(movement.tipo, movement.quantidade)}
              </td>
              <td className="p-2 text-muted-foreground">
                {[movement.motivo, movement.referencia]
                  .filter(Boolean)
                  .join(" · ") || "—"}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
