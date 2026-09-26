import { ArrowLeft, FilePlus2 } from "lucide-react";
import { Link, useParams } from "react-router-dom";

import { ClinicalSummaryForm } from "../components/ClinicalSummaryForm";
import { ListSection } from "../components/ListSection";
import { MedicalRecordHeader } from "../components/MedicalRecordHeader";
import { SingleSectionForm } from "../components/SingleSectionForm";
import {
  useMedicalRecordActions,
  useMedicalRecordByAppointment,
  useOpenMedicalRecord,
} from "../hooks/useMedicalRecord";
import { LIST_SECTIONS, SINGLE_SECTIONS } from "../schema/sections";
import type { MedicalRecord } from "../types/medicalRecord.type";

import { CardPage } from "@/components/cards/CardPage";
import { PageLoading } from "@/components/loading/PageLoading";
import { Button, buttonVariants } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

function FilledDot({ filled }: { filled: boolean }) {
  return filled ? (
    <span
      className="size-1.5 rounded-full bg-green-500"
      aria-label="preenchido"
    />
  ) : null;
}

function MedicalRecordEditor({ record }: { record: MedicalRecord }) {
  const actions = useMedicalRecordActions(record.atendimentoId, record.id);

  return (
    <div className="space-y-4">
      <MedicalRecordHeader record={record} />

      <Tabs defaultValue={SINGLE_SECTIONS[0].key}>
        <TabsList>
          {SINGLE_SECTIONS.map((section) => (
            <TabsTrigger key={section.key} value={section.key}>
              {section.title}
              <FilledDot filled={record[section.key] !== null} />
            </TabsTrigger>
          ))}
          {LIST_SECTIONS.map((section) => (
            <TabsTrigger key={section.key} value={section.key}>
              {section.title}
              {record[section.key].length > 0 && (
                <span className="rounded-full bg-muted-foreground/15 px-1.5 text-xs">
                  {record[section.key].length}
                </span>
              )}
            </TabsTrigger>
          ))}
          <TabsTrigger value="resumo">
            Resumo
            <FilledDot filled={Boolean(record.resumo_clinico)} />
          </TabsTrigger>
        </TabsList>

        <div className="rounded-xl border bg-background p-4">
          {SINGLE_SECTIONS.map((section) => (
            <TabsContent key={section.key} value={section.key}>
              <SingleSectionForm
                config={section}
                record={record[section.key]}
                isPending={actions.save.isPending || actions.clear.isPending}
                onSave={(payload) =>
                  actions.save.mutateAsync({ section: section.key, payload })
                }
                onClear={() => actions.clear.mutate(section.key)}
              />
            </TabsContent>
          ))}
          {LIST_SECTIONS.map((section) => (
            <TabsContent key={section.key} value={section.key}>
              <ListSection
                config={section}
                items={record[section.key]}
                isPending={
                  actions.addItem.isPending || actions.removeItem.isPending
                }
                onAdd={(payload) =>
                  actions.addItem.mutateAsync({ section: section.key, payload })
                }
                onRemove={(itemId) =>
                  actions.removeItem.mutate({ section: section.key, itemId })
                }
              />
            </TabsContent>
          ))}
          <TabsContent value="resumo">
            <ClinicalSummaryForm
              value={record.resumo_clinico}
              isPending={actions.updateSummary.isPending}
              onSave={(value) => actions.updateSummary.mutateAsync(value)}
            />
          </TabsContent>
        </div>
      </Tabs>
    </div>
  );
}

export function MedicalRecordPage() {
  const { atendimentoId = "" } = useParams();
  const { record, notOpened, isLoading, isError } =
    useMedicalRecordByAppointment(atendimentoId);
  const openRecord = useOpenMedicalRecord(atendimentoId);

  return (
    <CardPage
      title="Prontuário"
      description="Registro clínico do atendimento"
      action={
        <Link
          to="/consultas"
          className={buttonVariants({ variant: "ghost", size: "sm" })}
        >
          <ArrowLeft className="mr-2 size-4" />
          Consultas
        </Link>
      }
    >
      {isLoading && <PageLoading />}

      {notOpened && (
        <div className="flex flex-col items-center gap-3 rounded-xl border border-dashed p-8 text-center">
          <p className="text-sm text-muted-foreground">
            Este atendimento ainda não tem prontuário.
          </p>
          <Button
            onClick={() => openRecord.mutate()}
            disabled={openRecord.isPending}
          >
            <FilePlus2 className="mr-2 size-4" />
            {openRecord.isPending ? "Abrindo..." : "Abrir prontuário"}
          </Button>
        </div>
      )}

      {isError && !notOpened && (
        <p className="text-sm text-destructive">
          Não foi possível carregar o prontuário.
        </p>
      )}

      {record && <MedicalRecordEditor record={record} />}
    </CardPage>
  );
}
