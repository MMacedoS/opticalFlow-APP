import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardList } from "@/components/cards/CardList";
import { SquareCheck, Ban } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/layouts/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { AlertConfirm } from "@/components/alert/AlertConfirm";
import {
  statusColorMap,
  statusLabelMap,
  type StatusAtendimento,
} from "@/constants/statusColorEvents";
import dayjs from "dayjs";
import type { Order } from "../types/Order.type";

export function OrderCard(data: Order) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");

  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const handleExcluir = () => {
    setIsAlertOpen(false);
  };

  const handleChangeStatus = ({
    newStatus,
    id,
  }: {
    newStatus: StatusAtendimento;
    id: string;
  }) => {
    setIsAlertOpen(false);
    console.log("Change status to:", newStatus, "for order ID:", id);
  };

  const openAlertStandart = (
    title: string,
    description: string,
    action: () => void,
  ) => {
    setTextAlert(title);
    setDescriptionAlert(description);
    setActionConfirm(() => action);
    setIsAlertOpen(true);
  };

  const isOutdated =
    dayjs().isAfter(dayjs(data.data_entrega)) &&
    data.status !== "concluido" &&
    data.status !== "cancelado";

  return (
    <div
      className={`rounded-xl transition-all ${
        isOutdated ? "shadow-lg shadow-red-500/40 ring-1 ring-red-300" : ""
      }`}
    >
      <CardList
        title={data.numero}
        description={"Ordem de servico. " + data.descricao}
        action={
          <>
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
                    onClick={() =>
                      openAlertStandart(
                        `Tem certeza de que deseja EXCLUIR o ordem de serviço?`,
                        `O ordem de serviço "${data.numero}" será excluído permanentemente.`,
                        () => handleExcluir(),
                      )
                    }
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </>
        }
        content={
          <div className="flex flex-col gap-3 p-1 text-slate-700">
            {/* Bloco Principal: Paciente e Status */}
            <div className="flex items-start justify-between gap-4 border-b border-slate-100 pb-2">
              <div>
                <h4 className="text-sm font-semibold text-slate-900">
                  {data.cliente?.pessoa?.nome ?? "Cliente não identificado"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Data:{" "}
                  <span className="font-medium text-slate-600">
                    {dayjs(data.data_entrega).format("DD/MM/YYYY [às] HH:mm")}
                  </span>
                </p>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium border ${
                    statusColorMap[data.status as StatusAtendimento] ??
                    "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}
                >
                  {statusLabelMap[data.status as StatusAtendimento] ??
                    data.status}
                </span>
              </div>
            </div>
          </div>
        }
        footer={
          <>
            {(() => {
              if (isOutdated) {
                return (
                  <Button
                    variant="destructive"
                    className="bg-red-600 hover:bg-red-700 text-white"
                    onClick={() =>
                      openAlertStandart(
                        "Deseja cancelar este atendimento?",
                        `O horário agendado já passou. Deseja alterar o status de "${data.cliente?.pessoa?.nome}" para Cancelado?`,
                        () =>
                          handleChangeStatus({
                            newStatus: "cancelado",
                            id: data.id as string,
                          }),
                      )
                    }
                  >
                    <Ban className="mr-2 h-4 w-4" />
                    Cancelar
                  </Button>
                );
              }

              const actionMap: Record<
                StatusAtendimento,
                {
                  label: string;
                  variant: "default" | "destructive" | "outline" | "ghost";
                  className?: string;
                  nextStatus: StatusAtendimento;
                  alertTitle: string;
                  alertDesc: string;
                } | null
              > = {
                em_espera: {
                  label: "Iniciar",
                  variant: "default",
                  className: "bg-blue-600 hover:bg-blue-700 text-white",
                  nextStatus: "em_andamento",
                  alertTitle: "Deseja iniciar este atendimento?",
                  alertDesc: `O atendimento de "${data.cliente?.pessoa?.nome}" mudará para o status Em Andamento.`,
                },
                em_andamento: {
                  label: "Finalizar",
                  variant: "default",
                  className: "bg-green-600 hover:bg-green-700 text-white",
                  nextStatus: "concluido",
                  alertTitle: "Deseja finalizar este atendimento?",
                  alertDesc: `O atendimento de "${data.cliente?.pessoa?.nome}" será concluído e encerrado.`,
                },
                concluido: null,
                cancelado: null,
              };

              const currentAction = actionMap[data.status as StatusAtendimento];

              if (!currentAction) return null;

              return (
                <Button
                  variant={currentAction.variant}
                  className={currentAction.className}
                  onClick={() =>
                    openAlertStandart(
                      currentAction.alertTitle,
                      currentAction.alertDesc,
                      () =>
                        handleChangeStatus({
                          newStatus: currentAction.nextStatus,
                          id: data.id as string,
                        }),
                    )
                  }
                >
                  <SquareCheck className="mr-2 h-4 w-4" />
                  {currentAction.label}
                </Button>
              );
            })()}
          </>
        }
        itemChildren={
          <>
            <AlertConfirm
              title={textAlert}
              description={descriptionAlert}
              isOpen={isAlertOpen}
              onClose={() => setIsAlertOpen(false)}
              onConfirm={actionConfirm}
            />
          </>
        }
      />
    </div>
  );
}
