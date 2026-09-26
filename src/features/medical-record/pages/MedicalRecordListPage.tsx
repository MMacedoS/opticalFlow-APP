import { useState } from "react";
import dayjs from "dayjs";
import { Link } from "react-router-dom";

import { useMedicalRecordList } from "../hooks/useMedicalRecord";
import type { MedicalRecordListFilters } from "../types/medicalRecord.type";

import { CardPage } from "@/components/cards/CardPage";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";

export function MedicalRecordListPage() {
  const [filters, setFilters] = useState<MedicalRecordListFilters>({
    page: 1,
    limit: 10,
  });
  const { data, isLoading, isError } = useMedicalRecordList(filters);
  const records = data?.data.prontuarios ?? [];
  const pagination = data?.data.pagination;

  return (
    <CardPage
      title="Prontuários"
      description="Histórico de prontuários. Para abrir um novo, use o botão Prontuário na consulta."
    >
      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-3 font-medium">Data</th>
              <th className="p-3 font-medium">Paciente</th>
              <th className="p-3 font-medium">Profissional</th>
              <th className="p-3 font-medium">Diagnósticos</th>
              <th className="p-3" />
            </tr>
          </thead>
          <tbody>
            {isLoading && (
              <tr>
                <td className="p-3" colSpan={5}>
                  Carregando...
                </td>
              </tr>
            )}
            {isError && (
              <tr>
                <td className="p-3 text-destructive" colSpan={5}>
                  Erro ao carregar prontuários.
                </td>
              </tr>
            )}
            {!isLoading && !isError && records.length === 0 && (
              <tr>
                <td className="p-3 text-muted-foreground" colSpan={5}>
                  Nenhum prontuário registrado.
                </td>
              </tr>
            )}
            {records.map((record) => (
              <tr key={record.id} className="border-t">
                <td className="p-3 whitespace-nowrap">
                  {dayjs(record.atendimento.dataAtendimento).format(
                    "DD/MM/YYYY",
                  )}
                </td>
                <td className="p-3">{record.paciente.nome}</td>
                <td className="p-3">
                  {record.profissional?.pessoa?.nome ?? "—"}
                </td>
                <td className="p-3">
                  {record.diagnosticos.map((d) => d.codigo).join(", ") || "—"}
                </td>
                <td className="p-3 text-right">
                  <Link
                    to={`/prontuarios/atendimento/${record.atendimentoId}`}
                    className="font-medium text-primary hover:underline"
                  >
                    Abrir
                  </Link>
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
          onLimitChange={(limit) =>
            setFilters((prev) => ({ ...prev, limit, page: 1 }))
          }
        />
      )}
    </CardPage>
  );
}
