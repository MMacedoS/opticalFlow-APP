import { useState } from "react";
import dayjs from "dayjs";
import { Printer, Trash2 } from "lucide-react";
import { Link } from "react-router-dom";

import type { SectionRecord } from "@/features/medical-record/types/medicalRecord.type";

import {
  useDeletePrescription,
  usePrescriptions,
} from "../hooks/usePrescriptions";
import { PRESCRIPTION_TYPE_BY_KEY } from "../schema/prescriptionTypes";
import type { Prescription } from "../types/prescription.type";
import { PrescriptionForm } from "./PrescriptionForm";

import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { Button, buttonVariants } from "@/components/ui/button";

type PrescriptionPanelProps = {
  prontuarioId: string;
  refraction: SectionRecord | null;
};

function summary(prescription: Prescription): string {
  if (prescription.tipo === "medicamento") {
    const med = prescription.medicamento;
    return [med?.medicamento, med?.posologia].filter(Boolean).join(" — ");
  }

  const detail = prescription.oculos ?? prescription.lente_contato;
  const grau = prescription.tipo === "oculos" ? "esferico" : "grau";
  return `OD ${detail?.[`od_${grau}`] ?? "—"} · OE ${detail?.[`oe_${grau}`] ?? "—"}`;
}

export function PrescriptionPanel({
  prontuarioId,
  refraction,
}: PrescriptionPanelProps) {
  const [toDelete, setToDelete] = useState<Prescription | null>(null);
  const { data, isLoading, isError } = usePrescriptions(prontuarioId);
  const deleteMutation = useDeletePrescription(prontuarioId);
  const prescriptions = data?.data.receitas ?? [];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-start justify-between gap-2">
        <div>
          <h3 className="font-semibold">Receitas</h3>
          <p className="text-sm text-muted-foreground">
            Receitas emitidas neste atendimento
          </p>
        </div>
        <PrescriptionForm prontuarioId={prontuarioId} refraction={refraction} />
      </div>

      {isLoading && <p className="text-sm">Carregando receitas...</p>}
      {isError && (
        <p className="text-sm text-destructive">Erro ao carregar receitas.</p>
      )}
      {!isLoading && !isError && prescriptions.length === 0 && (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Nenhuma receita emitida.
        </p>
      )}

      <ul className="space-y-2">
        {prescriptions.map((prescription) => (
          <li
            key={prescription.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-lg border bg-background p-3 text-sm"
          >
            <div>
              <p className="font-medium">
                {PRESCRIPTION_TYPE_BY_KEY[prescription.tipo].title}
              </p>
              <p className="text-muted-foreground">
                {dayjs(prescription.createdAt).format("DD/MM/YYYY HH:mm")} ·{" "}
                {summary(prescription)}
              </p>
            </div>
            <div className="flex gap-2">
              <Link
                to={`/receitas/${prescription.id}/imprimir`}
                target="_blank"
                rel="noopener"
                className={buttonVariants({ variant: "outline", size: "sm" })}
              >
                <Printer className="mr-2 size-4" />
                Imprimir
              </Link>
              <PrescriptionForm
                prontuarioId={prontuarioId}
                refraction={refraction}
                prescription={prescription}
              />
              <Button
                variant="ghost"
                size="sm"
                aria-label="Excluir receita"
                disabled={deleteMutation.isPending}
                onClick={() => setToDelete(prescription)}
              >
                <Trash2 className="size-4" />
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <AlertConfirm
        title="Excluir receita?"
        description="A receita será excluída permanentemente."
        isOpen={toDelete !== null}
        onClose={() => setToDelete(null)}
        onConfirm={() => {
          if (toDelete) deleteMutation.mutate(toDelete.id);
          setToDelete(null);
        }}
      />
    </div>
  );
}
