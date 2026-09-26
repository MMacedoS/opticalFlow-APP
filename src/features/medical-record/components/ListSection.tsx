import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import { useForm } from "react-hook-form";

import {
  buildSchema,
  toFormValues,
  toPayload,
  type FieldConfig,
  type FormValues,
  type ListSectionConfig,
} from "../schema/sections";
import type { ListItem, SectionPayload } from "../types/medicalRecord.type";
import { SectionField } from "./SectionField";

import { Button } from "@/components/ui/button";

type ListSectionProps = {
  config: ListSectionConfig;
  items: ListItem[];
  isPending: boolean;
  onAdd: (payload: SectionPayload) => Promise<unknown>;
  onRemove: (itemId: string) => void;
};

function formatValue(field: FieldConfig, value: unknown): string {
  if (value === null || value === undefined || value === "") return "—";
  if (field.type === "date") return dayjs(String(value)).format("DD/MM/YYYY");
  if (field.type === "datetime") {
    return dayjs(String(value)).format("DD/MM/YYYY HH:mm");
  }
  return String(value);
}

export function ListSection({
  config,
  items,
  isPending,
  onAdd,
  onRemove,
}: ListSectionProps) {
  const schema = useMemo(() => buildSchema(config.fields), [config.fields]);
  const emptyValues = useMemo(
    () => toFormValues(config.fields, null, config.defaults),
    [config.defaults, config.fields],
  );
  const formId = `list-${config.key}`;

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: emptyValues,
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await onAdd(toPayload(config.fields, values));
      form.reset(emptyValues);
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <div className="space-y-4">
      <div>
        <h3 className="font-semibold">{config.title}</h3>
        <p className="text-sm text-muted-foreground">{config.description}</p>
      </div>

      {items.length === 0 ? (
        <p className="rounded-lg border border-dashed p-4 text-sm text-muted-foreground">
          Nenhum registro.
        </p>
      ) : (
        <ul className="space-y-2">
          {items.map((item) => (
            <li
              key={item.id}
              className="flex items-start justify-between gap-3 rounded-lg border bg-background p-3 text-sm"
            >
              <dl className="grid flex-1 gap-x-4 gap-y-1 sm:grid-cols-[auto_1fr]">
                {config.fields.map((field) => (
                  <div key={field.name} className="contents">
                    <dt className="text-muted-foreground">{field.label}</dt>
                    <dd className="whitespace-pre-wrap">
                      {formatValue(field, item[field.name])}
                    </dd>
                  </div>
                ))}
              </dl>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-label={`Remover ${config.itemTitle.toLowerCase()}`}
                disabled={isPending}
                onClick={() => onRemove(item.id)}
              >
                <Trash2 className="size-4" />
              </Button>
            </li>
          ))}
        </ul>
      )}

      <form
        id={formId}
        onSubmit={onSubmit}
        noValidate
        className="space-y-3 rounded-lg bg-muted/40 p-3"
      >
        <p className="text-sm font-medium">
          Adicionar {config.itemTitle.toLowerCase()}
        </p>
        <div className="grid gap-3 md:grid-cols-3">
          {config.fields.map((field) => (
            <SectionField
              key={field.name}
              field={field}
              control={form.control}
              idPrefix={formId}
              className={
                field.type === "textarea" ? "md:col-span-3" : undefined
              }
            />
          ))}
        </div>
        <div className="flex justify-end">
          <Button type="submit" size="sm" disabled={isPending}>
            <Plus className="mr-2 size-4" />
            Adicionar
          </Button>
        </div>
      </form>
    </div>
  );
}
