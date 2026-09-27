import { useState } from "react";
import dayjs from "dayjs";
import {
  Ban,
  CheckCheck,
  EllipsisVertical,
  ReceiptText,
  ShoppingCart,
  Trash2,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { CardList } from "@/components/cards/CardList";
import { AlertConfirm } from "@/components/alert/AlertConfirm";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/layouts/components/ui/dropdown-menu";
import { useNavigate } from "react-router-dom";
import { useCreateSaleFromServiceOrder } from "@/features/sale";
import { ServiceOrderForm } from "./ServiceOrderForm";
import { useServiceOrderDelete } from "../hooks/useServiceOrderDelete";
import { useServiceOrderStatus } from "../hooks/useServiceOrderStatus";
import type {
  ServiceOrder,
  ServiceOrderStatus,
} from "../types/service-order.type";

const STATUS_STYLES: Record<ServiceOrderStatus, string> = {
  aberta: "bg-blue-50 text-blue-700 border-blue-200",
  orcamento: "bg-amber-50 text-amber-700 border-amber-200",
  faturada: "bg-violet-50 text-violet-700 border-violet-200",
  finalizada: "bg-green-50 text-green-700 border-green-200",
  cancelada: "bg-rose-50 text-rose-700 border-rose-200",
};

const STATUS_LABELS: Record<ServiceOrderStatus, string> = {
  aberta: "Aberta",
  orcamento: "Orçamento",
  faturada: "Faturada",
  finalizada: "Finalizada",
  cancelada: "Cancelada",
};

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function formatDate(date?: string | null) {
  if (!date) return "Não informada";

  const parsedDate = dayjs(date);
  return parsedDate.isValid()
    ? parsedDate.format("DD/MM/YYYY HH:mm")
    : "Não informada";
}

export function ServiceOrderCard(data: ServiceOrder) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [alertTitle, setAlertTitle] = useState("");
  const [alertDescription, setAlertDescription] = useState("");
  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});
  const deleteServiceOrder = useServiceOrderDelete();
  const updateStatus = useServiceOrderStatus();

  const items = Array.isArray(data.itens) ? data.itens : [];
  const status = data.status ?? "aberta";
  const createSale = useCreateSaleFromServiceOrder();
  const navigate = useNavigate();
  const canDelete = items.length === 0;
  const patientName =
    data.atendimento?.paciente?.nome ?? "Paciente não informado";
  const customerName = data.cliente?.pessoa?.nome ?? "Cliente não informado";

  const openAlertStandart = (
    title: string,
    description: string,
    action: () => void,
  ) => {
    setAlertTitle(title);
    setAlertDescription(description);
    setActionConfirm(() => action);
    setIsAlertOpen(true);
  };

  const handleDelete = () => {
    deleteServiceOrder.mutate(data.id, {
      onSuccess: () => setIsAlertOpen(false),
    });
  };

  const handleStatusChange = (status: ServiceOrderStatus) => {
    updateStatus.mutate(
      { id: data.id, status },
      {
        onSuccess: () => setIsAlertOpen(false),
      },
    );
  };

  const primaryActionMap: Partial<
    Record<
      ServiceOrderStatus,
      {
        label: string;
        icon: typeof ReceiptText;
        nextStatus: ServiceOrderStatus;
        className: string;
      }
    >
  > = {
    aberta: {
      label: "Enviar para orçamento",
      icon: ReceiptText,
      nextStatus: "orcamento",
      className: "bg-amber-500 hover:bg-amber-600 text-white",
    },
    orcamento: {
      label: "Faturar ordem",
      icon: ReceiptText,
      nextStatus: "faturada",
      className: "bg-violet-600 hover:bg-violet-700 text-white",
    },
    faturada: {
      label: "Finalizar ordem",
      icon: CheckCheck,
      nextStatus: "finalizada",
      className: "bg-green-600 hover:bg-green-700 text-white",
    },
  };

  const primaryAction = primaryActionMap[status];
  const PrimaryActionIcon = primaryAction?.icon;

  return (
    <>
      <CardList
        title={data.numero || `OS ${data.id.slice(0, 8)}`}
        description={data.descricao || "Sem descrição informada"}
        action={
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button variant="ghost" size="sm" {...props}>
                  <EllipsisVertical />
                </Button>
              )}
            />
            <DropdownMenuContent>
              <DropdownMenuGroup>
                <DropdownMenuItem
                  disabled={
                    status === "cancelada" ||
                    (data.itens?.length ?? 0) === 0 ||
                    createSale.isPending
                  }
                  onClick={() =>
                    createSale.mutate(data.id, {
                      onSuccess: () => navigate("/vendas"),
                    })
                  }
                >
                  <ShoppingCart className="mr-2 h-4 w-4" />
                  Gerar venda
                </DropdownMenuItem>
                <DropdownMenuItem
                  disabled={!canDelete || deleteServiceOrder.isPending}
                  onClick={() =>
                    openAlertStandart(
                      "Excluir ordem de serviço?",
                      canDelete
                        ? `A ordem ${data.numero || data.id} será removida permanentemente.`
                        : "Não é possível excluir uma ordem com itens vinculados.",
                      handleDelete,
                    )
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        content={
          <div className="space-y-2 text-sm">
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="font-medium">{customerName}</p>
                <p className="text-muted-foreground">{patientName}</p>
              </div>
              <span
                className={`inline-flex items-center rounded-full border px-2 py-1 text-xs font-medium ${STATUS_STYLES[status]}`}
              >
                {STATUS_LABELS[status]}
              </span>
            </div>

            <div className="space-y-1 text-muted-foreground">
              <p>Entrega prevista: {formatDate(data.previsao_entrega)}</p>
              <p>Entrega final: {formatDate(data.data_entrega)}</p>
              <p>Laboratório: {data.laboratorio?.nome ?? "Não vinculado"}</p>
              <p>Itens vinculados: {items.length}</p>
            </div>
          </div>
        }
        footer={
          <>
            <div className="mr-auto text-sm font-semibold">
              Total: {formatCurrency(data.valor_total)}
            </div>
            <ServiceOrderForm
              initialValues={data}
              triggerLabel="Editar Ordem"
            />
            {primaryAction && PrimaryActionIcon && (
              <Button
                size="sm"
                className={primaryAction.className}
                onClick={() =>
                  openAlertStandart(
                    `Alterar status para ${STATUS_LABELS[primaryAction.nextStatus]}?`,
                    `A ordem ${data.numero || data.id} será atualizada para ${STATUS_LABELS[primaryAction.nextStatus]}.`,
                    () => handleStatusChange(primaryAction.nextStatus),
                  )
                }
              >
                <PrimaryActionIcon className="mr-2 h-4 w-4" />
                {primaryAction.label}
              </Button>
            )}
            {status !== "cancelada" && status !== "finalizada" && (
              <Button
                size="sm"
                variant="destructive"
                onClick={() =>
                  openAlertStandart(
                    "Cancelar ordem de serviço?",
                    `A ordem ${data.numero || data.id} será marcada como cancelada.`,
                    () => handleStatusChange("cancelada"),
                  )
                }
              >
                <Ban className="mr-2 h-4 w-4" />
                Cancelar
              </Button>
            )}
            <Button
              size="sm"
              variant="outline"
              disabled={!canDelete || deleteServiceOrder.isPending}
              onClick={() =>
                openAlertStandart(
                  "Excluir ordem de serviço?",
                  canDelete
                    ? `A ordem ${data.numero || data.id} será removida permanentemente.`
                    : "Não é possível excluir uma ordem com itens vinculados.",
                  handleDelete,
                )
              }
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Excluir
            </Button>
          </>
        }
        itemChildren={
          <AlertConfirm
            title={alertTitle}
            description={alertDescription}
            isOpen={isAlertOpen}
            onClose={() => setIsAlertOpen(false)}
            onConfirm={actionConfirm}
          />
        }
      />
      {!canDelete && (
        <p className="mt-2 text-xs text-muted-foreground">
          Esta ordem possui itens vinculados e não pode ser excluída.
        </p>
      )}
    </>
  );
}
