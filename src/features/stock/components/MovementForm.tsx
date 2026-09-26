import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useCreateMovement } from "../hooks/useStock";
import {
  movementSchema,
  type MovementFormInput,
  type MovementFormOutput,
} from "../schema/stock.schema";
import type { MovementType, StockItem } from "../types/stock.type";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const TYPES: { value: MovementType; label: string; hint: string }[] = [
  { value: "entrada", label: "Entrada", hint: "Soma ao saldo" },
  { value: "saida", label: "Saída", hint: "Subtrai do saldo" },
  {
    value: "ajuste",
    label: "Ajuste de inventário",
    hint: "Define o saldo contado",
  },
];

type MovementFormProps = {
  item: StockItem;
  onDone: () => void;
};

export function MovementForm({ item, onDone }: MovementFormProps) {
  const mutation = useCreateMovement();
  const form = useForm<MovementFormInput, unknown, MovementFormOutput>({
    resolver: zodResolver(movementSchema),
    defaultValues: {
      tipo: "entrada",
      quantidade: "",
      motivo: "",
      referencia: "",
    },
  });
  const tipo = useWatch({ control: form.control, name: "tipo" });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        estoqueId: item.estoqueId,
        produtoId: item.produtoId,
        tipo: values.tipo,
        quantidade: values.quantidade,
        motivo: values.motivo || undefined,
        referencia: values.referencia || undefined,
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm">
        Saldo atual: <strong>{item.quantidade}</strong>
      </p>

      <Controller
        name="tipo"
        control={form.control}
        render={({ field }) => (
          <div
            role="radiogroup"
            aria-label="Tipo de movimentação"
            className="grid gap-2 sm:grid-cols-3"
          >
            {TYPES.map((option) => (
              <button
                key={option.value}
                type="button"
                role="radio"
                aria-checked={field.value === option.value}
                onClick={() => field.onChange(option.value)}
                className={cn(
                  "rounded-lg border p-2 text-left text-sm transition-colors",
                  field.value === option.value
                    ? "border-primary bg-primary text-primary-foreground"
                    : "hover:bg-muted",
                )}
              >
                <span className="block font-medium">{option.label}</span>
                <span className="text-xs opacity-80">{option.hint}</span>
              </button>
            ))}
          </div>
        )}
      />

      <div className="grid gap-3 sm:grid-cols-3">
        <Controller
          name="quantidade"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="movement-quantidade">
                {tipo === "ajuste" ? "Quantidade contada" : "Quantidade"}
              </FieldLabel>
              <Input
                {...field}
                id="movement-quantidade"
                inputMode="decimal"
                autoFocus
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field className="sm:col-span-2">
          <FieldLabel htmlFor="movement-motivo">Motivo</FieldLabel>
          <Input
            id="movement-motivo"
            placeholder={
              tipo === "ajuste" ? "Inventário mensal" : "Ex.: avaria, devolução"
            }
            {...form.register("motivo")}
          />
        </Field>
        <Field className="sm:col-span-3">
          <FieldLabel htmlFor="movement-referencia">Referência</FieldLabel>
          <Input
            id="movement-referencia"
            placeholder="Nº da nota, pedido..."
            {...form.register("referencia")}
          />
        </Field>
      </div>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Registrando..." : "Registrar"}
        </Button>
      </div>
    </form>
  );
}
