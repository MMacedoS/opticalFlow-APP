import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Controller, useForm } from "react-hook-form";

import { useProductsList } from "@/features/products/hooks/useProductsList";

import { useAddStockItem } from "../hooks/useStock";
import {
  addItemSchema,
  type AddItemFormInput,
  type AddItemFormOutput,
} from "../schema/stock.schema";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type AddItemFormProps = {
  estoqueId: string;
  existingProductIds: Set<string>;
  onDone: () => void;
};

export function AddItemForm({
  estoqueId,
  existingProductIds,
  onDone,
}: AddItemFormProps) {
  const mutation = useAddStockItem();
  const products = useProductsList({ search: "", limit: 500 });

  const options = useMemo(
    () =>
      (products.data?.data.products ?? []).filter(
        (product) =>
          product.tipo !== "servico" &&
          product.ativo === "ativo" &&
          !existingProductIds.has(product.id),
      ),
    [existingProductIds, products.data],
  );

  const form = useForm<AddItemFormInput, unknown, AddItemFormOutput>({
    resolver: zodResolver(addItemSchema),
    defaultValues: { produtoId: "", minimo: "", maximo: "" },
  });

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({ estoqueId, ...values });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <p className="text-sm text-muted-foreground">
        O produto entra com saldo zero. Depois registre uma entrada para lançar
        a quantidade.
      </p>
      <Controller
        name="produtoId"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel htmlFor="add-item-produto">Produto</FieldLabel>
            <select
              {...field}
              id="add-item-produto"
              className="rounded-xl border bg-background p-2 text-sm"
            >
              <option value="">
                {products.isLoading
                  ? "Carregando..."
                  : options.length === 0
                    ? "Todos os produtos já estão no estoque"
                    : "Selecione um produto"}
              </option>
              {options.map((product) => (
                <option key={product.id} value={product.id}>
                  {product.nome} ({product.sku})
                </option>
              ))}
            </select>
            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />
      <div className="grid gap-3 sm:grid-cols-2">
        {(["minimo", "maximo"] as const).map((name) => (
          <Controller
            key={name}
            name={name}
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel htmlFor={`add-item-${name}`}>
                  {name === "minimo" ? "Estoque mínimo" : "Estoque máximo"}
                </FieldLabel>
                <Input {...field} id={`add-item-${name}`} inputMode="decimal" />
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
          {mutation.isPending ? "Adicionando..." : "Adicionar"}
        </Button>
      </div>
    </form>
  );
}
