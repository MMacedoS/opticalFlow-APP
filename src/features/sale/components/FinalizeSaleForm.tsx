import dayjs from "dayjs";
import { useForm, useWatch } from "react-hook-form";

import { formatCurrencyDisplay } from "@/utils/masks";

import { useFinalizeSale } from "../hooks/useSales";
import type { Sale } from "../types/sale.type";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type FinalizeSaleFormProps = {
  sale: Sale;
  onDone: () => void;
};

export function FinalizeSaleForm({ sale, onDone }: FinalizeSaleFormProps) {
  const mutation = useFinalizeSale();
  const form = useForm<{ pago: boolean; vencimento: string }>({
    defaultValues: {
      pago: true,
      vencimento: dayjs(sale.dataVenda).add(30, "day").format("YYYY-MM-DD"),
    },
  });
  const pago = useWatch({ control: form.control, name: "pago" });
  const produtos = sale.itens.filter((item) => item.produtoId).length;

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      await mutation.mutateAsync({
        id: sale.id,
        pago: values.pago,
        vencimento:
          !values.pago && values.vencimento
            ? dayjs(values.vencimento).toISOString()
            : undefined,
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
        {produtos > 0 && (
          <li>
            Baixa no estoque dos produtos (serviços não movimentam estoque).
          </li>
        )}
        <li>
          Receita de {formatCurrencyDisplay(sale.valor_total)} lançada no
          financeiro.
        </li>
        {sale.ordem_servico && <li>A ordem de serviço passa para faturada.</li>}
      </ul>
      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" className="size-4" {...form.register("pago")} />
        Pagamento recebido agora
      </label>
      {!pago && (
        <Field className="max-w-xs">
          <FieldLabel htmlFor="sale-vencimento">
            Vencimento da receita
          </FieldLabel>
          <Input
            id="sale-vencimento"
            type="date"
            {...form.register("vencimento")}
          />
        </Field>
      )}
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Voltar
        </Button>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Finalizando..." : "Finalizar venda"}
        </Button>
      </div>
    </form>
  );
}
