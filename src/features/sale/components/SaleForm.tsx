import { useMemo } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import dayjs from "dayjs";
import { Plus, Trash2 } from "lucide-react";
import { Controller, useFieldArray, useForm, useWatch } from "react-hook-form";

import { useBranchList } from "@/features/branch/hooks/useBranchList";
import { useCustomerList } from "@/features/customer/hooks/useCustomerList";
import { useProductsList } from "@/features/products/hooks/useProductsList";
import { useAuthStore } from "@/stores/auth.store";
import { formatCurrencyDisplay } from "@/utils/masks";

import { useSaveSale } from "../hooks/useSales";
import {
  EMPTY_ITEM,
  saleSchema,
  type SaleFormInput,
  type SaleFormOutput,
} from "../schema/sale.schema";
import type { Sale } from "../types/sale.type";

import { Button } from "@/components/ui/button";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

type SaleFormProps = {
  sale?: Sale;
  onDone: () => void;
};

const NUMBER_FIELDS = [
  { name: "quantidade", label: "Quantidade" },
  { name: "valor_unitario", label: "Valor unitário" },
  { name: "desconto", label: "Desconto" },
] as const;

const selectClass = "w-full rounded-xl border bg-background p-2 text-sm";
const toNumber = (value: string) => Number(value.replace(",", ".")) || 0;

function toFormValues(sale?: Sale): SaleFormInput {
  return {
    filialId: sale?.filialId ?? "",
    clienteId: sale?.clienteId ?? "",
    dataVenda: dayjs(sale?.dataVenda).format("YYYY-MM-DD"),
    observacoes: sale?.observacoes ?? "",
    itens: sale
      ? sale.itens.map((item) => ({
          produtoId: item.produtoId ?? "",
          descricao_servico: item.descricao_servico ?? "",
          quantidade: String(item.quantidade),
          valor_unitario: String(item.valor_unitario),
          desconto: item.desconto ? String(item.desconto) : "",
        }))
      : [EMPTY_ITEM],
  };
}

export function SaleForm({ sale, onDone }: SaleFormProps) {
  const mutation = useSaveSale();
  const session = useAuthStore((state) => state.session);
  const precisaFilial = !session?.usuario?.filialId && !sale;
  const branches = useBranchList({ search: "", limit: 100, page: 1 });
  const products = useProductsList({ search: "", limit: 500 });

  const form = useForm<SaleFormInput, unknown, SaleFormOutput>({
    resolver: zodResolver(saleSchema),
    defaultValues: toFormValues(sale),
  });
  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });
  const itens = useWatch({ control: form.control, name: "itens" });
  const filialId = useWatch({ control: form.control, name: "filialId" });
  const customers = useCustomerList({
    search: "",
    limit: 100,
    page: 1,
    filialId: filialId || undefined,
  });

  const productOptions = useMemo(
    () =>
      (products.data?.data.products ?? []).filter(
        (product) => product.ativo === "ativo",
      ),
    [products.data],
  );

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

  const onProductChange = (index: number, produtoId: string) => {
    const product = productOptions.find((p) => p.id === produtoId);
    if (product && !itens?.[index]?.valor_unitario) {
      form.setValue(
        `itens.${index}.valor_unitario`,
        String(product.preco_venda),
      );
    }
  };

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        id: sale?.id,
        payload: {
          ...(precisaFilial &&
            values.filialId && { filialId: values.filialId }),
          clienteId: values.clienteId || null,
          dataVenda: dayjs(values.dataVenda).toISOString(),
          observacoes: values.observacoes || null,
          itens: values.itens.map((item) => ({
            produtoId: item.produtoId || null,
            descricao_servico: item.produtoId ? null : item.descricao_servico,
            quantidade: item.quantidade,
            valor_unitario: item.valor_unitario,
            desconto: item.desconto,
          })),
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
            <FieldLabel htmlFor="sale-filial">Filial</FieldLabel>
            <select
              id="sale-filial"
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
          <FieldLabel htmlFor="sale-cliente">Cliente</FieldLabel>
          <select
            id="sale-cliente"
            className={selectClass}
            {...form.register("clienteId")}
          >
            <option value="">Consumidor (sem cadastro)</option>
            {customers.data?.data?.customers.map((customer) => (
              <option key={customer.id} value={customer.id}>
                {customer.pessoa.nome}
              </option>
            ))}
          </select>
        </Field>
        <Controller
          name="dataVenda"
          control={form.control}
          render={({ field, fieldState }) => (
            <Field data-invalid={fieldState.invalid}>
              <FieldLabel htmlFor="sale-data">Data da venda</FieldLabel>
              <Input {...field} id="sale-data" type="date" />
              {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
            </Field>
          )}
        />
      </div>

      <div className="overflow-x-auto rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted/60 text-left">
            <tr>
              <th className="p-2 font-medium">Produto ou serviço</th>
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
              const hasProduct = Boolean(itens?.[index]?.produtoId);
              return (
                <tr key={row.id} className="border-t align-top">
                  <td className="space-y-1 p-2">
                    <select
                      aria-label={`Produto do item ${index + 1}`}
                      className={selectClass}
                      {...form.register(`itens.${index}.produtoId`, {
                        onChange: (event) =>
                          onProductChange(index, event.target.value),
                      })}
                    >
                      <option value="">Serviço avulso (descrever)</option>
                      {productOptions.map((product) => (
                        <option key={product.id} value={product.id}>
                          {product.nome} ({product.sku})
                        </option>
                      ))}
                    </select>
                    {!hasProduct && (
                      <Input
                        aria-label={`Descrição do serviço do item ${index + 1}`}
                        placeholder="Ex.: Montagem, ajuste de armação"
                        {...form.register(`itens.${index}.descricao_servico`)}
                      />
                    )}
                    {errors?.descricao_servico && (
                      <p className="text-xs text-destructive">
                        {errors.descricao_servico.message}
                      </p>
                    )}
                  </td>
                  {NUMBER_FIELDS.map(({ name, label }) => (
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
        <FieldLabel htmlFor="sale-obs">Observações</FieldLabel>
        <Textarea id="sale-obs" {...form.register("observacoes")} />
      </Field>

      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Cancelar
        </Button>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Salvando..." : "Salvar venda"}
        </Button>
      </div>
    </form>
  );
}
