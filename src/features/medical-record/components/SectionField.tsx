import { Controller, type Control } from "react-hook-form";

import type { FieldConfig, FormValues } from "../schema/sections";

import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SectionFieldProps = {
  field: FieldConfig;
  control: Control<FormValues>;
  idPrefix: string;
  hideLabel?: boolean;
  className?: string;
};

const INPUT_TYPE: Record<string, string> = {
  number: "text",
  datetime: "datetime-local",
  date: "date",
};

export function SectionField({
  field: config,
  control,
  idPrefix,
  hideLabel,
  className,
}: SectionFieldProps) {
  const id = `${idPrefix}-${config.name}`;

  return (
    <Controller
      name={config.name}
      control={control}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid} className={className}>
          <FieldLabel
            htmlFor={id}
            className={hideLabel ? "sr-only" : undefined}
          >
            {config.label}
          </FieldLabel>
          {config.type === "textarea" ? (
            <Textarea
              {...field}
              id={id}
              placeholder={config.placeholder}
              value={field.value ?? ""}
            />
          ) : (
            <Input
              {...field}
              id={id}
              type={INPUT_TYPE[config.type ?? ""] ?? "text"}
              inputMode={config.type === "number" ? "decimal" : undefined}
              placeholder={config.placeholder}
              value={field.value ?? ""}
            />
          )}
          {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
        </Field>
      )}
    />
  );
}
