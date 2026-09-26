import { useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { FileSignature, Pencil } from "lucide-react";
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

import {
  useCreatePrescription,
  useUpdatePrescription,
} from "../hooks/usePrescriptions";
import {
  PRESCRIPTION_TYPES,
  type PrescriptionTypeConfig,
} from "../schema/prescriptionTypes";
import type {
  Prescription,
  PrescriptionType,
} from "../types/prescription.type";

import { CardPage } from "@/components/cards/CardPage";
import { DialogForm } from "@/components/dialog/DialogForm";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import { cn } from "@/lib/utils";

type PrescriptionFormProps = {
  prontuarioId: string;
  refraction: SectionRecord | null;
  /** Quando informado, edita esta receita (o tipo nao muda). */
  prescription?: Prescription;
};

type TypeFormProps = {
  config: PrescriptionTypeConfig;
  prontuarioId: string;
  initialRecord: SectionRecord | null;
  prescriptionId?: string;
  onSaved: () => void;
};

function PrescriptionTypeForm({
  config,
  prontuarioId,
  initialRecord,
  prescriptionId,
  onSaved,
}: TypeFormProps) {
  const fields = useMemo(() => sectionFields(config), [config]);
  const createMutation = useCreatePrescription(prontuarioId);
  const updateMutation = useUpdatePrescription(prontuarioId);
  const isPending = createMutation.isPending || updateMutation.isPending;
  const formId = `prescription-${config.tipo}-${prescriptionId ?? "new"}`;

  const form = useForm<FormValues>({
    resolver: zodResolver(buildSchema(fields)),
    defaultValues: toFormValues(fields, initialRecord),
  });

  const onSubmit = form.handleSubmit(async (values) => {
    const detail = { [config.tipo]: toPayload(fields, values) };

    try {
      if (prescriptionId) {
        await updateMutation.mutateAsync({
          id: prescriptionId,
          payload: detail,
        });
      } else {
        await createMutation.mutateAsync({
          prontuarioId,
          tipo: config.tipo,
          ...detail,
        });
      }
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
        <Button type="submit" size="sm" disabled={isPending}>
          {isPending
            ? "Salvando..."
            : prescriptionId
              ? "Salvar alterações"
              : "Emitir receita"}
        </Button>
      </div>
    </form>
  );
}

export function PrescriptionForm({
  prontuarioId,
  refraction,
  prescription,
}: PrescriptionFormProps) {
  const [open, setOpen] = useState(false);
  const [tipo, setTipo] = useState<PrescriptionType>(
    prescription?.tipo ?? "oculos",
  );
  const isEditing = Boolean(prescription);
  const config = PRESCRIPTION_TYPES.find((item) => item.tipo === tipo)!;

  return (
    <DialogForm
      title={isEditing ? "Editar" : "Emitir receita"}
      icon={isEditing ? Pencil : FileSignature}
      variant={isEditing ? "ghost" : "default"}
      width="max-w-3xl!"
      open={open}
      onOpenChange={setOpen}
    >
      <CardPage
        title={isEditing ? config.title : "Emitir receita"}
        description={
          isEditing
            ? "O tipo da receita não pode ser alterado."
            : tipo === "oculos"
              ? "Valores preenchidos a partir da refração do prontuário. Revise antes de emitir."
              : "Preencha os dados da receita"
        }
      >
        {!isEditing && (
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
        )}

        <PrescriptionTypeForm
          key={tipo}
          config={config}
          prontuarioId={prontuarioId}
          initialRecord={
            prescription
              ? (prescription[prescription.tipo] as SectionRecord | null)
              : tipo === "oculos"
                ? refraction
                : null
          }
          prescriptionId={prescription?.id}
          onSaved={() => setOpen(false)}
        />
      </CardPage>
    </DialogForm>
  );
}
