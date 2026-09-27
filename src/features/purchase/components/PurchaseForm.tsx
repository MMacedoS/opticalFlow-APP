import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { useBranchList } from "@/features/branch/hooks/useBranchList";
import { useProductsList } from "@/features/products/hooks/useProductsList";
import { useActiveSupplierOptions } from "@/features/supplier/hooks/useSuppliers";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrencyDisplay } from "@/utils/masks";

import { useSavePurchase } from "../hooks/usePurchases";
import {
  EMPTY_ITEM,
  purchaseSchema,
  type PurchaseFormInput,
  type PurchaseFormOutput,
} from "../schema/purchase.schema";
import type { Purchase } from "../types/purchase.type";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type PurchaseFormProps = {
  purchase?: Purchase;
  onDone: () => void;
};

const toNumber = (value: string) => Number(value.replace(",", ".")) || 0;

function toFormValues(purchase?: Purchase): PurchaseFormInput {
  return {
    filialId: purchase?.filialId ?? "",
    fornecedorId: purchase?.fornecedorId ?? "",
    dataCompra: dayjs(purchase?.dataCompra).format("YYYY-MM-DD"),
    observacoes: purchase?.observacoes ?? "",
    itens: purchase
      ? purchase.itens.map((item) => ({
          produtoId: item.produtoId,
          quantidade: String(item.quantidade),
          valor_unitario: String(item.valor_unitario),
          desconto: item.desconto ? String(item.desconto) : "",
        }))
      : [EMPTY_ITEM],
  };
}

const ITEM_FIELDS = [
  { name: "quantidade", label: "Quantidade" },
  { name: "valor_unitario", label: "Valor unitário" },
  { name: "desconto", label: "Desconto" },
] as const;

const selectClass = "w-full rounded-xl border bg-background p-2 text-sm";

export function PurchaseForm({ purchase, onDone }: PurchaseFormProps) {
  const mutation = useSavePurchase();
  const session = useAuthStore((state) => state.session);
  const precisaFilial = !session?.usuario?.filialId && !purchase;
  const branches = useBranchList({ search: "", limit: 100, page: 1 });
  const { options: supplierOptions } = useActiveSupplierOptions();
  const products = useProductsList({ search: "", limit: 500 });

  const productOptions = useMemo(
    () =>
      (products.data?.data.products ?? []).filter(
        (product) => product.tipo !== "servico" && product.ativo === "ativo",
      ),
    [products.data],
  );

  const form = useForm<PurchaseFormInput, unknown, PurchaseFormOutput>({
    resolver: zodResolver(purchaseSchema),
    defaultValues: toFormValues(purchase),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });
  const itens = useWatch({ control: form.control, name: "itens" });

  const subtotal = (index: number) => {
    const item = itens?.[index];
    if (!item) return 0;
    return Math.max(
      0,
      toNumber(item.quantidade) * toNumber(item.valor_unitario) -
        toNumber(item.desconto),
    );
  };
  const total = (itens ?? []).reduce(
    (sum, _, index) => sum + subtotal(index),
    0,
  );

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        id: purchase?.id,
        payload: {
          ...(precisaFilial &&
            values.filialId && { filialId: values.filialId }),
          fornecedorId: values.fornecedorId || null,
          dataCompra: dayjs(values.dataCompra).toISOString(),
          observacoes: values.observacoes || null,
          itens: values.itens,
        },
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  const itensError = form.formState.errors.itens;

  return (
    <form onSubmit={onSubmit} noValidate className="space-y-4">
      <div className="grid gap-3 md:grid-cols-3">
        {precisaFilial && (
          <Field>
            <FieldLabel htmlFor="purchase-filial">Filial</FieldLabel>
            <select
              id="purchase-filial"
              className={selectClass}
              {...form.register("filialId")}
            >
              <option value="">Selecione a filial</option>
              {branches.data?.data?.branches.map((branch) => (
                <option key={branch.id} value={branch.id}>
                  {branch.nome}
                </option>
              ))}
            </select>
          </Field>
        )}
        <Field>
          <FieldLabel htmlFor="purchase-fornecedor">Fornecedor</FieldLabel>
          <select
            id="purchase-fornecedor"
            className={selectClass}
            {...form.register("fornecedorId")}
          >
            <option value="">Sem fornecedor</option>
            {supplierOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </Field>
        <Controller
          name="dataCompra"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="purchase-data">Data da compra</FieldLabel>
              <Input {...field} id="purchase-data" type="date" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-2 font-medium">Produto</th>
              <th className="w-24 p-2 font-medium">Qtd.</th>
              <th className="w-32 p-2 font-medium">Valor unit.</th>
              <th className="w-28 p-2 font-medium">Desconto</th>
              <th className="w-28 p-2 text-right font-medium">Subtotal</th>
              <th className="w-10 p-2" />
            </tr>
          </thead>
          <tbody>
            {fields.map((row, index) => {
              const errors = itensError?.[index];
              return (
                <tr key={row.id} className="border-t align-top">
                  <td className="p-2">
                    <select
                      aria-label={`Produto do item ${index + 1}`}
                      className={selectClass}
                      {...form.register(`itens.${index}.produtoId`)}
                    >
                      <option value="">Selecione...</option>
                      {productOptions.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nome} ({product.sku})
                        </option>
                      ))}
                    </select>
                    {errors?.produtoId && (
                      <p className="mt-1 text-xs text-destructive">
                        {errors.produtoId.message}
                      </p>
                    )}
                  </td>
                  {ITEM_FIELDS.map(({ name, label }) => (
                    <td key={name} className="p-2">
                      <Input
                        aria-label={`${label} do item ${index + 1}`}
                        inputMode="decimal"
                        placeholder={name === "desconto" ? "0,00" : undefined}
                        {...form.register(`itens.${index}.${name}`)}
                      />
                      {errors?.[name] && (
                        <p className="mt-1 text-xs text-destructive">
                          {errors[name]?.message}
                        </p>
                      )}
                    </td>
                  ))}
                  <td className="p-2 pt-4 text-right font-mono">
                    {formatCurrencyDisplay(subtotal(index))}
                  </td>
                  <td className="p-2">
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      aria-label={`Remover item ${index + 1}`}
                      disabled={fields.length === 1}
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="size-4" />
                    </Button>
                  </td>
                </tr>
              );
            })}
          </tbody>
          <tfoot>
            <tr className="border-t bg-muted/30">
              <td className="p-2" colSpan={4}>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => append(EMPTY_ITEM)}
                >
                  <Plus className="mr-1 size-4" />
                  Adicionar item
                </Button>
              </td>
              <td className="p-2 text-right font-mono font-semibold">
                {formatCurrencyDisplay(total)}
              </td>
              <td />
            </tr>
          </tfoot>
        </table>
      </div>
      {itensError?.root?.message && (
        <p className="text-sm text-destructive">{itensError.root.message}</p>
      )}
      {itensError?.message && (
        <p className="text-sm text-destructive">{itensError.message}</p>
      )}

      <Field>
        <FieldLabel htmlFor="purchase-obs">Observações</FieldLabel>
        <Textarea
          id="purchase-obs"
          placeholder="Nº da nota fiscal, condições..."
          {...form.register("observacoes")}
        />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar rascunho"}
        </Button>
      </div>
    </form>
  );
}
