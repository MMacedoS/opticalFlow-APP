import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileSignature } from "lucide-react";
import { useForm } from "react-hook-form";

import { EyeGridFields } from "@/features/medical-record/components/EyeGridFields";
import { SectionField } from "@/features/medical-record/components/SectionField";
import {
  buildSchema,
  sectionFields,
  toFormValues,
  toPayload,
  type FormValues,
} from "@/features/medical-record/schema/sections";
import type { SectionRecord } from "@/features/medical-record/types/medicalRecord.type";

import { useCreatePrescription } from "../hooks/usePrescriptions";
import {
  PRESCRIPTION_TYPES,
  type PrescriptionTypeConfig,
} from "../schema/prescriptionTypes";
import type { PrescriptionType } from "../types/prescription.type";

import { CardPage } from "@/components/cards/CardPage";
import { DialogForm } from "@/components/dialog/DialogForm";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type PrescriptionFormProps = {
  prontuarioId: string;
  refraction: SectionRecord | null;
};

type TypeFormProps = {
  config: PrescriptionTypeConfig;
  prontuarioId: string;
  initialRecord: SectionRecord | null;
  onSaved: () => void;
};

function PrescriptionTypeForm({
  config,
  prontuarioId,
  initialRecord,
  onSaved,
}: TypeFormProps) {
  const fields = useMemo(() => sectionFields(config), [config]);
  const createMutation = useCreatePrescription(prontuarioId);
  const formId = `prescription-${config.tipo}`;

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(fields)),
    defaultValues: toFormValues(fields, initialRecord),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await createMutation.mutateAsync({
        prontuarioId,
        tipo: config.tipo,
        [config.tipo]: toPayload(fields, values),
      });
      onSaved();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="space-y-4">
      {config.eyeGrid && (
        <EyeGridFields
          grid={config.eyeGrid}
          control={form.control}
          idPrefix={formId}
        />
      )}
      <div className="grid gap-3 md:grid-cols-2">
        {config.fields.map((field) => (
          <SectionField
            key={field.name}
            field={field}
            control={form.control}
            idPrefix={formId}
            className={field.type === "textarea" ? "md:col-span-2" : undefined}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <DialogClose
          render={
            <Button type="button" variant="ghost" size="sm">
              Fechar
            </Button>
          }
        />
        <Button type="submit" size="sm" disabled={createMutation.isPending}>
          {createMutation.isPending ? "Emitindo..." : "Emitir receita"}
        </Button>
      </div>
    </form>
  );
}

export function PrescriptionForm({
  prontuarioId,
  refraction,
}: PrescriptionFormProps) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<PrescriptionType>("oculos");
  const config = PRESCRIPTION_TYPES.find((item) => item.tipo === tipo)!;

  return (
    <DialogForm
      title="Emitir receita"
      icon={FileSignature}
      width="max-w-3xl!"
      open={open}
      onOpenChange={setOpen}
    >
      <CardPage
        title="Emitir receita"
        description={
          tipo === "oculos"
            ? "Valores preenchidos a partir da refração do prontuário. Revise antes de emitir."
            : "Preencha os dados da receita"
        }
      >
        <div
          role="radiogroup"
          aria-label="Tipo de receita"
          className="flex flex-wrap gap-2"
        >
          {PRESCRIPTION_TYPES.map((item) => (
            <button
              key={item.tipo}
              type="button"
              role="radio"
              aria-checked={item.tipo === tipo}
              onClick={() => setTipo(item.tipo)}
              className={cn(
                "rounded-lg border px-3 py-1.5 text-sm transition-colors",
                item.tipo === tipo
                  ? "border-primary bg-primary text-primary-foreground"
                  : "hover:bg-muted",
              )}
            >
              {item.label}
            </button>
          ))}
        </div>

        <PrescriptionTypeForm
          key={tipo}
          config={config}
          prontuarioId={prontuarioId}
          initialRecord={tipo === "oculos" ? refraction : null}
          onSaved={() => setOpen(false)}
        />
      </CardPage>
    </DialogForm>
  );
}
