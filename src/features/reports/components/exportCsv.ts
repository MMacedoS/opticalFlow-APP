import type { Report } from "../types/report.type";
import { formatCell } from "./format";

// BOM: o Excel reconhece o arquivo como UTF-8 (acentos corretos).
const BOM = String.fromCharCode(0xfeff);

const escape = (valor: string) =>
  /[";\n]/.test(valor) ? `"${valor.replaceAll('"', '""')}"` : valor;

/** Baixa as linhas do relatorio em CSV (separador ";" para o Excel pt-BR). */
export function exportReportCsv(report: Report, fileName: string) {
  const { colunas, itens } = report.linhas;
  const header = colunas.map((col) => escape(col.label)).join(";");
  const rows = itens.map((item) =>
    colunas
      .map((col) => {
        const valor = item[col.chave];
        if (col.formato === "moeda" || col.formato === "numero") {
          return valor === null || valor === undefined
            ? ""
            : String(valor).replace(".", ",");
        }
        const texto = formatCell(valor, col.formato);
        return escape(texto === "—" ? "" : texto);
      })
      .join(";"),
  );

  const blob = new Blob([BOM, [header, ...rows].join("\n")], {
    type: "text/csv;charset=utf-8",
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${fileName}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
