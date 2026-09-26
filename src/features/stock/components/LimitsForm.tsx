import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useUpdateStockLimits } from "../hooks/useStock";
import {
  limitsSchema,
  type LimitsFormInput,
  type LimitsFormOutput,
} from "../schema/stock.schema";
import type { StockItem } from "../types/stock.type";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type LimitsFormProps = {
  item: StockItem;
  onDone: () => void;
};

const FIELDS = [
  { name: "minimo", label: "Estoque mínimo" },
  { name: "maximo", label: "Estoque máximo" },
] as const;

export function LimitsForm({ item, onDone }: LimitsFormProps) {
  const mutation = useUpdateStockLimits();
  const form = useForm<LimitsFormInput, unknown, LimitsFormOutput>({
    resolver: zodResolver(limitsSchema),
    defaultValues: {
      minimo: item.minimo?.toString() ?? "",
      maximo: item.maximo?.toString() ?? "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ id: item.id, payload: values });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-muted-foreground">
        O produto aparece como "abaixo do mínimo" quando o saldo chega ao
        mínimo. Deixe em branco para não controlar.
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        {FIELDS.map(({ name, label }) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`limits-${name}`}>{label}</FieldLabel>
                <Input {...field} id={`limits-${name}`} inputMode="decimal" />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />
        ))}
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar"}
        </Button>
      </div>
    </form>
  );
}
