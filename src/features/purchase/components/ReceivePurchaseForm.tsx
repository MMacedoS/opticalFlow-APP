import dayjs from "dayjs";
import { useForm } from "react-hook-form";

import { formatCurrencyDisplay } from "@/utils/masks";

import { useReceivePurchase } from "../hooks/usePurchases";
import type { Purchase } from "../types/purchase.type";

import { Button } from "@/components/ui/button";
import { Field, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";

type ReceivePurchaseFormProps = {
  purchase: Purchase;
  onDone: () => void;
};

export function ReceivePurchaseForm({
  purchase,
  onDone,
}: ReceivePurchaseFormProps) {
  const mutation = useReceivePurchase();
  const form = useForm<{ vencimento: string }>({
    defaultValues: {
      vencimento: dayjs(purchase.dataCompra)
        .add(30, "day")
        .format("YYYY-MM-DD"),
    },
  });

  const onSubmit = form.handleSubmit(async ({ vencimento }) => {
    try {
      await mutation.mutateAsync({
        id: purchase.id,
        vencimento: vencimento ? dayjs(vencimento).toISOString() : undefined,
      });
      onDone();
    } catch {
      // O erro ja foi exibido pelo toast da mutation.
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <ul className="list-inside list-disc space-y-1 text-sm text-muted-foreground">
        <li>
          Entrada de {purchase.itens.length}{" "}
          {purchase.itens.length === 1 ? "produto" : "produtos"} no estoque de{" "}
          {purchase.filial.nome}.
        </li>
        <li>Custo dos produtos atualizado com o valor desta compra.</li>
        <li>
          Despesa de {formatCurrencyDisplay(purchase.valor_total)} lançada no
          financeiro.
        </li>
      </ul>
      <Field className="max-w-xs">
        <FieldLabel htmlFor="receive-vencimento">
          Vencimento da despesa
        </FieldLabel>
        <Input
          id="receive-vencimento"
          type="date"
          {...form.register("vencimento")}
        />
      </Field>
      <div className="flex justify-end gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={onDone}>
          Voltar
        </Button>
        <Button type="submit" size="sm" disabled={mutation.isPending}>
          {mutation.isPending ? "Recebendo..." : "Confirmar recebimento"}
        </Button>
      </div>
    </form>
  );
}
