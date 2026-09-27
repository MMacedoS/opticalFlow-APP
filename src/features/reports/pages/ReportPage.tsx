import { useState } from "react";
import dayjs from "dayjs";
import { Download, Printer } from "lucide-react";
import { Navigate, useParams } from "react-router-dom";

import { ReportGroupCard } from "../components/ReportGroupCard";
import { exportReportCsv } from "../components/exportCsv";
import { formatCell, formatValue } from "../components/format";
import { useReport } from "../hooks/useReport";
import {
  REPORTS,
  type ReportFilters,
  type ReportKey,
} from "../types/report.type";

import { CardPage } from "@/components/cards/CardPage";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

const PRESETS = [
  {
    label: "Este mês",
    range: () => [dayjs().startOf("month"), dayjs().endOf("month")],
  },
  {
    label: "Mês passado",
    range: () => [
      dayjs().subtract(1, "month").startOf("month"),
      dayjs().subtract(1, "month").endOf("month"),
    ],
  },
  {
    label: "Últimos 30 dias",
    range: () => [dayjs().subtract(29, "day"), dayjs()],
  },
  {
    label: "Este ano",
    range: () => [dayjs().startOf("year"), dayjs().endOf("year")],
  },
] as const;

const toFilters = ([inicio, fim]: readonly dayjs.Dayjs[]): ReportFilters => ({
  dataInicio: inicio.format("YYYY-MM-DD"),
  dataFim: fim.format("YYYY-MM-DD"),
});

function isReportKey(value?: string): value is ReportKey {
  return Boolean(value && value in REPORTS);
}

export function ReportPage() {
  const { tipo } = useParams();
  if (!isReportKey(tipo)) return <Navigate to="/dashboard" replace />;
  // key: troca de relatorio reinicia filtros e estado.
  return <ReportView key={tipo} tipo={tipo} />;
}

function ReportView({ tipo }: { tipo: ReportKey }) {
  const config = REPORTS[tipo];
  const [filters, setFilters] = useState<ReportFilters>(() =>
    toFilters(PRESETS[0].range()),
  );
  const { data, isLoading, isError, isFetching } = useReport(
    config.endpoint,
    filters,
  );
  const report = data?.data;

  const setDate = (patch: Partial<ReportFilters>) =>
    setFilters((prev) => ({ ...prev, ...patch }));

  return (
    <CardPage title={config.title} description={config.description}>
      <div className="flex flex-wrap items-end gap-2 print:hidden">
        <label className="grid gap-1 text-xs text-muted-foreground">
          De
          <Input
            type="date"
            value={filters.dataInicio}
            onChange={(event) =>
              event.target.value && setDate({ dataInicio: event.target.value })
            }
          />
        </label>
        <label className="grid gap-1 text-xs text-muted-foreground">
          até
          <Input
            type="date"
            value={filters.dataFim}
            onChange={(event) =>
              event.target.value && setDate({ dataFim: event.target.value })
            }
          />
        </label>
        <div className="flex flex-wrap gap-1">
          {PRESETS.map((preset) => {
            const presetFilters = toFilters(preset.range());
            const active =
              presetFilters.dataInicio === filters.dataInicio &&
              presetFilters.dataFim === filters.dataFim;
            return (
              <Button
                key={preset.label}
                size="sm"
                variant={active ? "default" : "outline"}
                onClick={() => setFilters(presetFilters)}
              >
                {preset.label}
              </Button>
            );
          })}
        </div>
        <div className="ml-auto flex gap-2">
          <Button
            size="sm"
            variant="outline"
            disabled={!report?.linhas.itens.length}
            onClick={() =>
              report &&
              exportReportCsv(
                report,
                `relatorio-${tipo}-${filters.dataInicio}-a-${filters.dataFim}`,
              )
            }
          >
            <Download className="mr-1 size-4" />
            CSV
          </Button>
          <Button size="sm" variant="outline" onClick={() => window.print()}>
            <Printer className="mr-1 size-4" />
            Imprimir
          </Button>
        </div>
      </div>

      {isLoading && <p className="text-sm">Carregando relatório...</p>}
      {isError && (
        <p className="text-sm text-destructive">
          Não foi possível gerar o relatório. Verifique o período e suas
          permissões.
        </p>
      )}

      {report && (
        <div className={`space-y-4 ${isFetching ? "opacity-60" : ""}`}>
          <p className="text-xs text-muted-foreground">
            Período: {dayjs(report.periodo.inicio).format("DD/MM/YYYY")} a{" "}
            {dayjs(report.periodo.fim).format("DD/MM/YYYY")}
          </p>

          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
            {report.indicadores.map((card) => (
              <div
                key={card.label}
                className="rounded-xl border bg-background p-4"
              >
                <p className="text-sm text-muted-foreground">{card.label}</p>
                <p
                  className={`text-2xl font-semibold ${card.valor < 0 ? "text-red-600" : ""}`}
                >
                  {formatValue(card.valor, card.formato)}
                </p>
              </div>
            ))}
          </div>

          {report.grupos.length > 0 && (
            <div className="grid gap-3 lg:grid-cols-2">
              {report.grupos.map((group) => (
                <ReportGroupCard key={group.titulo} group={group} />
              ))}
            </div>
          )}

          <div className="overflow-x-auto rounded-lg border">
            <table className="w-full text-sm">
              <thead className="bg-muted/60 text-left">
                <tr>
                  {report.linhas.colunas.map((col) => (
                    <th
                      key={col.chave}
                      className={`p-3 font-medium ${col.formato === "moeda" || col.formato === "numero" ? "text-right" : ""}`}
                    >
                      {col.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {report.linhas.itens.length === 0 && (
                  <tr>
                    <td
                      className="p-3 text-muted-foreground"
                      colSpan={report.linhas.colunas.length}
                    >
                      Nenhum registro no período.
                    </td>
                  </tr>
                )}
                {report.linhas.itens.map((item, index) => (
                  <tr key={index} className="border-t hover:bg-muted/30">
                    {report.linhas.colunas.map((col) => (
                      <td
                        key={col.chave}
                        className={`p-3 ${col.formato === "moeda" || col.formato === "numero" ? "text-right tabular-nums" : ""}`}
                      >
                        {formatCell(item[col.chave], col.formato)}
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {report.linhas.truncado && (
            <p className="text-xs text-muted-foreground">
              Mostrando {report.linhas.itens.length} de {report.linhas.total}{" "}
              registros. Os totais acima consideram todos. Reduza o período para
              ver os demais.
            </p>
          )}
        </div>
      )}
    </CardPage>
  );
}
