import { useEffect, useMemo, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Eraser, Save } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  buildSchema,
  EYES,
  sectionFields,
  toFormValues,
  toPayload,
  type FormValues,
  type SingleSectionConfig,
} from "../schema/sections";
import type {
  SectionPayload,
  SectionRecord,
} from "../types/medicalRecord.type";
import { SectionField } from "./SectionField";

import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { Button } from "@/components/ui/button";

type SingleSectionFormProps = {
  config: SingleSectionConfig;
  record: SectionRecord | null;
  isPending: boolean;
  onSave: (payload: SectionPayload) => Promise<unknown>;
  onClear: () => void;
};

export function SingleSectionForm({
  config,
  record,
  isPending,
  onSave,
  onClear,
}: SingleSectionFormProps) {
  const [confirmClear, setConfirmClear] = useState(false);
  const fields = useMemo(() => sectionFields(config), [config]);
  const schema = useMemo(() => buildSchema(fields), [fields]);
  const formId = `section-${config.key}`;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: toFormValues(fields, record),
  });

  useEffect(() => {
    form.reset(toFormValues(fields, record));
  }, [fields, form, record]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onSave(toPayload(fields, values));
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form id={formId} onSubmit={onSubmit} noValidate className="space-y-4">
      <div>
        <h3 className="font-semibold">{config.title}</h3>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>

      {config.eyeGrid && (
        <div className="overflow-x-auto rounded-lg border">
          <table className="w-full text-sm">
            <thead className="bg-muted/60">
              <tr>
                <th className="p-2 text-left font-medium">Olho</th>
                {config.eyeGrid.columns.map((column) => (
                  <th key={column.suffix} className="p-2 text-left font-medium">
                    {column.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {EYES.map((eye) => (
                <tr key={eye.prefix} className="border-t">
                  <td className="p-2 font-medium whitespace-nowrap">
                    {eye.label}
                  </td>
                  {config.eyeGrid!.columns.map((column) => (
                    <td key={column.suffix} className="p-2">
                      <SectionField
                        field={{
                          name: `${eye.prefix}_${column.suffix}`,
                          label: `${eye.label} ${column.label}`,
                          type: config.eyeGrid!.type,
                          placeholder: column.placeholder,
                        }}
                        control={form.control}
                        idPrefix={formId}
                        hideLabel
                        className="min-w-24"
                      />
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
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
        {record && (
          <Button
            type="button"
            variant="ghost"
            size="sm"
            disabled={isPending}
            onClick={() => setConfirmClear(true)}
          >
            <Eraser className="mr-2 size-4" />
            Limpar seção
          </Button>
        )}
        <Button type="submit" size="sm" disabled={isPending}>
          <Save className="mr-2 size-4" />
          {isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>

      <AlertConfirm
        title={`Limpar ${config.title.toLowerCase()}?`}
        description="Os dados desta seção serão removidos do prontuário."
        isOpen={confirmClear}
        onClose={() => setConfirmClear(false)}
        onConfirm={() => {
          setConfirmClear(false);
          onClear();
        }}
      />
    </form>
  );
}
