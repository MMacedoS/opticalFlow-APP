import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Controller, useForm, useWatch } from "react-hook-form";

import { useSaveFinancialEntry } from "../hooks/useFinancial";
import {
  entrySchema,
  type EntryFormInput,
  type EntryFormOutput,
} from "../schema/financial.schema";
import {
  PAYMENT_METHODS,
  type FinancialEntry,
  type FinancialType,
  type PaymentMethod,
} from "../types/financial.type";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type EntryFormProps = {
  tipo: FinancialType;
  entry?: FinancialEntry;
  onDone: () => void;
};

const SUGESTOES: Record<FinancialType, string[]> = {
  despesa: [
    "Aluguel",
    "Salários",
    "Energia",
    "Água",
    "Internet",
    "Impostos",
    "Fornecedores",
  ],
  receita: ["Vendas", "Serviços", "Convênios", "Outras receitas"],
};

const selectClass = "w-full rounded-xl border bg-background p-2 text-sm";

export function EntryForm({ tipo, entry, onDone }: EntryFormProps) {
  const mutation = useSaveFinancialEntry();
  const isEditing = Boolean(entry);

  const form = useForm<EntryFormInput, unknown, EntryFormOutput>({
    resolver: zodResolver(entrySchema),
    defaultValues: {
      descricao: entry?.descricao ?? "",
      categoria: entry?.categoria ?? "",
      valor: entry ? String(entry.valor) : "",
      vencimento: entry?.vencimento
        ? dayjs(entry.vencimento).format("YYYY-MM-DD")
        : dayjs().format("YYYY-MM-DD"),
      pago: false,
      forma_pagamento: "",
    },
  });
  const pago = useWatch({ control: form.control, name: "pago" });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        id: entry?.id,
        payload: {
          ...(!isEditing && { tipo }),
          descricao: values.descricao,
          categoria: values.categoria || null,
          valor: values.valor,
          vencimento: values.vencimento
            ? dayjs(values.vencimento).toISOString()
            : null,
          ...(!isEditing &&
            values.pago && {
              pago: true,
              forma_pagamento: values.forma_pagamento as PaymentMethod,
            }),
        },
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-3 md:grid-cols-2">
        <Controller
          name="descricao"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid} className="md:col-span-2">
              <FieldLabel htmlFor="entry-descricao">Descrição</FieldLabel>
              <Input
                {...field}
                id="entry-descricao"
                placeholder={
                  tipo === "despesa"
                    ? "Aluguel de outubro"
                    : "Serviço de ajuste"
                }
              />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <FieldLabel htmlFor="entry-categoria">Categoria</FieldLabel>
          <Input
            id="entry-categoria"
            list="entry-categorias"
            placeholder="Escolha ou digite"
            {...form.register("categoria")}
          />
          <datalist id="entry-categorias">
            {SUGESTOES[tipo].map((sugestao) => (
              <option key={sugestao} value={sugestao} />
            ))}
          </datalist>
        </Field>
        <Controller
          name="valor"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="entry-valor">Valor (R$)</FieldLabel>
              <Input {...field} id="entry-valor" inputMode="decimal" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
        <Field>
          <FieldLabel htmlFor="entry-vencimento">Vencimento</FieldLabel>
          <Input
            id="entry-vencimento"
            type="date"
            {...form.register("vencimento")}
          />
        </Field>
      </div>

      {!isEditing && (
        <div className="space-y-3 rounded-lg bg-muted/40 p-3">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              className="size-4"
              {...form.register("pago")}
            />
            {tipo === "despesa" ? "Já foi pago" : "Já foi recebido"}
          </label>
          {pago && (
            <Controller
              name="forma_pagamento"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid} className="max-w-xs">
                  <FieldLabel htmlFor="entry-forma">
                    Forma de pagamento
                  </FieldLabel>
                  <select {...field} id="entry-forma" className={selectClass}>
                    <option value="">Selecione</option>
                    {PAYMENT_METHODS.map((method) => (
                      <option key={method.value} value={method.value}>
                        {method.label}
                      </option>
                    ))}
                  </select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          )}
        </div>
      )}

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
