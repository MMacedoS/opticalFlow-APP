import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { formatCurrencyDisplay } from "@/utils/masks";

import { useSettleFinancialEntry } from "../hooks/useFinancial";
import {
  PAYMENT_METHODS,
  type FinancialEntry,
  type PaymentMethod,
} from "../types/financial.type";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type SettleFormProps = {
  entry: FinancialEntry;
  onDone: () => void;
};

type SettleValues = { pagoEm: string; forma_pagamento: PaymentMethod | "" };

export function SettleForm({ entry, onDone }: SettleFormProps) {
  const mutation = useSettleFinancialEntry();
  const form = useForm<SettleValues>({
    defaultValues: {
      pagoEm: dayjs().format("YYYY-MM-DD"),
      forma_pagamento: "",
    },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    if (!values.forma_pagamento) {
      form.setError("forma_pagamento", {
        message: "Informe a forma de pagamento",
      });
      return;
    }

    try {
      await mutation.mutateAsync({
        id: entry.id,
        pagoEm: dayjs(values.pagoEm).toISOString(),
        forma_pagamento: values.forma_pagamento,
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  const formaError = form.formState.errors.forma_pagamento?.message;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm">
        {entry.tipo === "despesa" ? "Pagamento" : "Recebimento"} de{" "}
        <strong>{formatCurrencyDisplay(entry.valor)}</strong>
        {entry.descricao && ` — ${entry.descricao}`}
      </p>
      <div className="grid gap-3 sm:grid-cols-2">
        <Field>
          <FieldLabel htmlFor="settle-data">
            Data do {entry.tipo === "despesa" ? "pagamento" : "recebimento"}
          </FieldLabel>
          <Input id="settle-data" type="date" {...form.register("pagoEm")} />
        </Field>
        <Field data-invalid={Boolean(formaError)}>
          <FieldLabel htmlFor="settle-forma">Forma de pagamento</FieldLabel>
          <select
            id="settle-forma"
            className="w-full rounded-xl border bg-background p-2 text-sm"
            {...form.register("forma_pagamento")}
          >
            <option value="">Selecione</option>
            {PAYMENT_METHODS.map((method) => (
              <option key={method.value} value={method.value}>
                {method.label}
              </option>
            ))}
          </select>
          {formaError && (
            <p className="text-xs text-destructive">{formaError}</p>
          )}
        </Field>
      </div>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Voltar
        </Button>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Registrando..." : "Confirmar"}
        </Button>
      </div>
    </form>
  );
}
