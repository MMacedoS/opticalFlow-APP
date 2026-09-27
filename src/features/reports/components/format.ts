import dayjs from "dayjs";

import { formatCurrencyDisplay } from "@/utils/masks";

import type { ReportColumn, ValueFormat } from "../types/report.type";

const numero = new Intl.NumberFormat("pt-BR", { maximumFractionDigits: 2 });

export function formatValue(valor: number, formato: ValueFormat): string {
  if (formato === "moeda") return formatCurrencyDisplay(valor);
  if (formato === "percentual") return `${numero.format(valor)}%`;
  if (formato === "dias") return `${numero.format(valor)} dia(s)`;
  return numero.format(valor);
}

export function formatCell(
  valor: string | number | null | undefined,
  formato: ReportColumn["formato"],
): string {
  if (valor === null || valor === undefined || valor === "") return "—";
  if (formato === "data") return dayjs(valor).format("DD/MM/YYYY");
  if (formato === "dataHora") return dayjs(valor).format("DD/MM/YYYY HH:mm");
  if (formato === "moeda") return formatCurrencyDisplay(Number(valor));
  if (formato === "numero") return numero.format(Number(valor));
  return String(valor);
}
