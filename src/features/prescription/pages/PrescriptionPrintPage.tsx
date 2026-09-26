import dayjs from "dayjs";
import { Printer } from "lucide-react";
import { useParams } from "react-router-dom";

import { EYES, sectionFields } from "@/features/medical-record/schema/sections";

import { usePrescription } from "../hooks/usePrescriptions";
import { PRESCRIPTION_TYPE_BY_KEY } from "../schema/prescriptionTypes";
import type { Prescription } from "../types/prescription.type";

import { PageLoading } from "@/components/loading/PageLoading";
import { Button } from "@/components/ui/button";

function professionalRegistry(prescription: Prescription): string | null {
  const pessoa = prescription.profissional?.pessoa;
  if (pessoa?.oftalmologista) {
    return `CRM ${pessoa.oftalmologista.registro_profissional}`;
  }
  if (pessoa?.optometrista) {
    return `Registro ${pessoa.optometrista.registro_profissional}`;
  }
  return null;
}

function PrescriptionDocument({
  prescription,
}: {
  prescription: Prescription;
}) {
  const config = PRESCRIPTION_TYPE_BY_KEY[prescription.tipo];
  const detail: Record<string, string | null> =
    prescription[prescription.tipo] ?? {};
  const gridNames = new Set(
    sectionFields({ eyeGrid: config.eyeGrid, fields: [] }).map((f) => f.name),
  );
  const otherFields = config.fields.filter(
    (field) => !gridNames.has(field.name) && detail[field.name],
  );
  const professionalName =
    prescription.profissional?.pessoa?.nome ??
    prescription.profissional?.username ??
    "";
  const registry = professionalRegistry(prescription);

  return (
    <article className="mx-auto flex min-h-[27cm] max-w-[19cm] flex-col gap-6 bg-white p-8 text-sm text-black print:p-0">
      <header className="border-b pb-4 text-center">
        <p className="text-lg font-semibold">
          {prescription.filial.empresa.nome}
        </p>
        <p>{prescription.filial.nome}</p>
        {(prescription.filial.cnpj ?? prescription.filial.empresa.cnpj) && (
          <p className="text-xs">
            CNPJ {prescription.filial.cnpj ?? prescription.filial.empresa.cnpj}
          </p>
        )}
      </header>

      <h1 className="text-center text-base font-semibold uppercase tracking-wide">
        {config.title}
      </h1>

      <section className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-1">
        <span className="font-medium">Paciente:</span>
        <span>{prescription.paciente.nome}</span>
        {prescription.paciente.cpf && (
          <>
            <span className="font-medium">CPF:</span>
            <span>{prescription.paciente.cpf}</span>
          </>
        )}
        <span className="font-medium">Data:</span>
        <span>{dayjs(prescription.createdAt).format("DD/MM/YYYY")}</span>
      </section>

      {config.eyeGrid && (
        <table className="w-full border-collapse text-center">
          <thead>
            <tr>
              <th className="border p-2" />
              {config.eyeGrid.columns.map((column) => (
                <th key={column.suffix} className="border p-2">
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {EYES.map((eye) => (
              <tr key={eye.prefix}>
                <th className="border p-2">{eye.label}</th>
                {config.eyeGrid!.columns.map((column) => (
                  <td key={column.suffix} className="border p-2">
                    {detail[`${eye.prefix}_${column.suffix}`] ?? "—"}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      {otherFields.length > 0 && (
        <dl className="grid grid-cols-[auto_1fr] gap-x-3 gap-y-2">
          {otherFields.map((field) => (
            <div key={field.name} className="contents">
              <dt className="font-medium">{field.label}:</dt>
              <dd className="whitespace-pre-wrap">{detail[field.name]}</dd>
            </div>
          ))}
        </dl>
      )}

      <footer className="mt-auto flex flex-col items-center pt-16">
        <div className="w-72 border-t border-black pt-1 text-center">
          <p className="font-medium">{professionalName}</p>
          {registry && <p className="text-xs">{registry}</p>}
        </div>
      </footer>
    </article>
  );
}

export function PrescriptionPrintPage() {
  const { receitaId = "" } = useParams();
  const { data, isLoading, isError } = usePrescription(receitaId);

  return (
    <div className="min-h-svh bg-muted/40 py-6 print:bg-white print:py-0">
      <div className="mx-auto mb-4 flex max-w-[19cm] justify-end print:hidden">
        <Button size="sm" onClick={() => window.print()} disabled={!data}>
          <Printer className="mr-2 size-4" />
          Imprimir
        </Button>
      </div>
      {isLoading && <PageLoading />}
      {isError && (
        <p className="text-center text-sm text-destructive">
          Não foi possível carregar a receita.
        </p>
      )}
      {data && <PrescriptionDocument prescription={data.data} />}
    </div>
  );
}
