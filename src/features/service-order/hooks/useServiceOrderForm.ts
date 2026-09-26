import { useMemo } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { serviceOrderSchema } from "../schema/serviceOrder.schema";
import { getApiErrorMessage } from "../api/helpers";
import { createServiceOrderItem } from "../api/createServiceOrderItem";
import { deleteServiceOrderItem } from "../api/deleteServiceOrderItem";
import { updateServiceOrderItem } from "../api/updateServiceOrderItem";
import { useServiceOrderCreate } from "./useServiceOrderCreate";
import { useServiceOrderUpdate } from "./useServiceOrderUpdate";
import type {
  ServiceOrder,
  ServiceOrderCreatePayload,
  ServiceOrderFormValues,
  ServiceOrderUpdatePayload,
} from "../types/service-order.type";

type ServiceOrderFormInput = z.input<typeof serviceOrderSchema>;
type ServiceOrderFormOutput = z.output<typeof serviceOrderSchema>;

const DEFAULT_VALUES: ServiceOrderFormInput = {
  atendimentoId: "",
  clienteId: "",
  laboratorioId: "",
  numero: "",
  status: "aberta",
  descricao: "",
  previsao_entrega: "",
  data_entrega: "",
  itens: [],
};

function normalizeOptionalString(value?: string | null) {
  const normalized = value?.trim();
  return normalized ? normalized : undefined;
}

function normalizeItem(item: ServiceOrderFormValues["itens"][number]) {
  return {
    produtoId: normalizeOptionalString(item.produtoId),
    descricao_servico: normalizeOptionalString(item.descricao_servico),
    quantidade: Number(item.quantidade),
    valor_unitario: Number(item.valor_unitario),
    desconto: Number(item.desconto || 0),
  };
}

function buildCreatePayload(
  values: ServiceOrderFormOutput,
): ServiceOrderCreatePayload {
  return {
    atendimentoId: normalizeOptionalString(values.atendimentoId),
    clienteId: normalizeOptionalString(values.clienteId),
    laboratorioId: normalizeOptionalString(values.laboratorioId),
    numero: normalizeOptionalString(values.numero),
    status: values.status,
    descricao: normalizeOptionalString(values.descricao),
    previsao_entrega: normalizeOptionalString(values.previsao_entrega),
    data_entrega: normalizeOptionalString(values.data_entrega),
    itens: values.itens.map(normalizeItem),
  };
}

function buildUpdatePayload(
  values: ServiceOrderFormOutput,
): ServiceOrderUpdatePayload {
  return {
    atendimentoId: normalizeOptionalString(values.atendimentoId),
    clienteId: normalizeOptionalString(values.clienteId),
    laboratorioId: normalizeOptionalString(values.laboratorioId),
    numero: normalizeOptionalString(values.numero),
    status: values.status,
    descricao: normalizeOptionalString(values.descricao),
    previsao_entrega: normalizeOptionalString(values.previsao_entrega),
    data_entrega: normalizeOptionalString(values.data_entrega),
  };
}

export function useServiceOrderForm(
  initialValues?: Partial<ServiceOrderFormValues> | ServiceOrder,
) {
  const queryClient = useQueryClient();
  const createMutation = useServiceOrderCreate();
  const updateMutation = useServiceOrderUpdate();

  const values = useMemo<ServiceOrderFormInput | undefined>(() => {
    if (!initialValues) return undefined;

    return {
      id: initialValues.id,
      atendimentoId: initialValues.atendimentoId ?? "",
      clienteId: initialValues.clienteId ?? "",
      laboratorioId: initialValues.laboratorioId ?? "",
      numero: initialValues.numero ?? "",
      status: initialValues.status ?? "aberta",
      descricao: initialValues.descricao ?? "",
      previsao_entrega: initialValues.previsao_entrega ?? "",
      data_entrega: initialValues.data_entrega ?? "",
      itens:
        initialValues.itens?.map((item) => ({
          id: item.id,
          produtoId: item.produtoId ?? "",
          descricao_servico: item.descricao_servico ?? "",
          quantidade: item.quantidade,
          valor_unitario: item.valor_unitario,
          desconto: item.desconto ?? 0,
        })) ?? [],
    };
  }, [initialValues]);

  const form = useForm<ServiceOrderFormInput, unknown, ServiceOrderFormOutput>({
    resolver: zodResolver(serviceOrderSchema),
    defaultValues: DEFAULT_VALUES,
    values,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;

    if (errors.numero?.message) return errors.numero.message;
    if (errors.status?.message) return errors.status.message;
    if (errors.descricao?.message) return errors.descricao.message;
    if (!Array.isArray(errors.itens) && errors.itens?.root?.message) {
      return errors.itens.root.message;
    }

    const firstItemError = Array.isArray(errors.itens)
      ? errors.itens.find((item) => Boolean(item))
      : undefined;
    if (firstItemError?.descricao_servico?.message) {
      return firstItemError.descricao_servico.message;
    }
    if (firstItemError?.quantidade?.message)
      return firstItemError.quantidade.message;
    if (firstItemError?.valor_unitario?.message) {
      return firstItemError.valor_unitario.message;
    }

    return null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues?.id) {
        const serviceOrderId = initialValues.id;

        await updateMutation.mutateAsync({
          id: serviceOrderId,
          payload: buildUpdatePayload(values),
        });

        const initialItems = initialValues.itens ?? [];
        const initialItemsById = new Map(
          initialItems
            .filter((item) => item.id)
            .map((item) => [item.id as string, item]),
        );
        const removedItems = initialItems.filter(
          (item) =>
            item.id &&
            !values.itens.some((currentItem) => currentItem.id === item.id),
        );

        await Promise.all(
          removedItems.map((item) => deleteServiceOrderItem(item.id as string)),
        );

        await Promise.all(
          values.itens.map(async (item) => {
            const payload = {
              descricao_servico: normalizeOptionalString(
                item.descricao_servico,
              ),
              quantidade: Number(item.quantidade),
              valor_unitario: Number(item.valor_unitario),
              desconto: Number(item.desconto || 0),
            };

            if (item.id) {
              const initialItem = initialItemsById.get(item.id);
              const hasProductChanged =
                normalizeOptionalString(initialItem?.produtoId) !==
                normalizeOptionalString(item.produtoId);

              if (hasProductChanged) {
                await deleteServiceOrderItem(item.id);
                await createServiceOrderItem({
                  ordemServicoId: serviceOrderId,
                  produtoId: normalizeOptionalString(item.produtoId),
                  ...payload,
                });
                return;
              }

              await updateServiceOrderItem(item.id, payload);
              return;
            }

            await createServiceOrderItem({
              ordemServicoId: serviceOrderId,
              produtoId: normalizeOptionalString(item.produtoId),
              ...payload,
            });
          }),
        );

        queryClient.invalidateQueries({ queryKey: ["serviceOrdersList"] });

        if (values.itens.length !== (initialValues.itens?.length ?? 0)) {
          toast.success("Itens da ordem atualizados com sucesso.", {
            action: {
              label: "Fechar",
              onClick: () => toast.dismiss(),
            },
          });
        }

        return;
      }

      await createMutation.mutateAsync(buildCreatePayload(values));
      form.reset(DEFAULT_VALUES);
    } catch (error) {
      toast.error(getApiErrorMessage(error), {
        action: {
          label: "Fechar",
          onClick: () => toast.dismiss(),
        },
      });
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
    isEditing: Boolean(initialValues?.id),
  };
}
