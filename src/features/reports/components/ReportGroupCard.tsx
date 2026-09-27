import dayjs from "dayjs";

import type { ReportGroup } from "../types/report.type";
import { formatValue } from "./format";

/** Rotulo da serie: dia (AAAA-MM-DD) ou mes (AAAA-MM). */
const pointLabel = (label?: string) =>
  label && label.length === 7
    ? dayjs(`${label}-01`).format("MM/YYYY")
    : dayjs(label).format("DD/MM");

/** Serie diaria/mensal (colunas) ou ranking (barras horizontais). */
export function ReportGroupCard({ group }: { group: ReportGroup }) {
  const max = Math.max(...group.itens.map((item) => Math.abs(item.valor)), 0);
  const width = (valor: number) =>
    max > 0
      ? `${Math.max((Math.abs(valor) / max) * 100, valor ? 2 : 0)}%`
      : "0%";

  if (group.serie) {
    const total = group.itens.reduce((sum, item) => sum + item.valor, 0);
    return (
      <section className="rounded-xl border bg-background p-4 lg:col-span-2">
        <div className="mb-3 flex items-baseline justify-between gap-2">
          <h3 className="text-sm font-semibold">{group.titulo}</h3>
          <span className="text-xs text-muted-foreground">
            Total: {formatValue(total, group.formato)}
          </span>
        </div>
        <div className="flex h-40 items-end justify-center gap-px overflow-x-auto">
          {group.itens.map((item) => (
            <div
              key={item.label}
              className="group relative flex h-full min-w-1.5 max-w-16 flex-1 items-end"
              title={`${pointLabel(item.label)}: ${formatValue(item.valor, group.formato)}`}
            >
              <div
                className={`w-full rounded-t ${item.valor < 0 ? "bg-red-400" : "bg-primary/70 group-hover:bg-primary"}`}
                style={{ height: width(item.valor) }}
              />
            </div>
          ))}
        </div>
        <div className="mt-1 flex justify-between text-xs text-muted-foreground">
          <span>{pointLabel(group.itens[0]?.label)}</span>
          <span>{pointLabel(group.itens.at(-1)?.label)}</span>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-xl border bg-background p-4">
      <h3 className="mb-3 text-sm font-semibold">{group.titulo}</h3>
      <ul className="space-y-2">
        {group.itens.map((item) => (
          <li key={item.label} className="text-sm">
            <div className="flex justify-between gap-2">
              <span className="truncate">{item.label}</span>
              <span className="shrink-0 font-medium">
                {formatValue(item.valor, group.formato)}
                {group.formato !== "numero" &&
                  item.quantidade !== undefined && (
                    <span className="ml-1 text-xs font-normal text-muted-foreground">
                      ({item.quantidade})
                    </span>
                  )}
              </span>
            </div>
            <div className="mt-1 h-1.5 rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-primary/70"
                style={{ width: width(item.valor) }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
