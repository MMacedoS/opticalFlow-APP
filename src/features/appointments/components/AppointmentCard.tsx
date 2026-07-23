import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardList } from "@/components/cards/CardList";
import { SquareCheck } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/layouts/components/ui/dropdown-menu";
import { EllipsisVertical, Trash2 } from "lucide-react";
import { AlertConfirm } from "@/components/alert/AlertConfirm";
import type { Appointment } from "../types/appointment.type";
import { useAppointmentDelete } from "../hooks/useAppointmentDelete";
import { useAppointmentStatus } from "../hooks/useAppointmentStatus";
import { AppointmentForm } from "./AppointmentForm";
import {
  statusColorMap,
  statusLabelMap,
  type StatusAtendimento,
} from "@/constants/statusColorEvents";
import dayjs from "dayjs";

export function AppointmentCard(data: Appointment) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");

  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const deleteAppointment = useAppointmentDelete();

  const handleExcluir = () => {
    deleteAppointment.mutate(data.id as string);
    setIsAlertOpen(false);
  };

  const changeStatusApi = useAppointmentStatus();

  const handleChangeStatus = ({
    newStatus,
    id,
  }: {
    newStatus: StatusAtendimento;
    id: string;
  }) => {
    changeStatusApi.mutate({ id, status: newStatus });
    setIsAlertOpen(false);
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

  return (
    <>
      <CardList
        title="Consulta"
        description={
          "Consulta agendada para o Dr. " + data.profissional?.username
        }
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
                        `Tem certeza de que deseja EXCLUIR o atendimento?`,
                        `O atendimento "${data.paciente.nome}" será excluído permanentemente.`,
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
                  {data.paciente?.nome ?? "Paciente não identificado"}
                </h4>
                <p className="text-xs text-muted-foreground mt-0.5">
                  Atendimento:{" "}
                  <span className="font-medium text-slate-600">
                    {dayjs(data.dataAtendimento).format(
                      "DD/MM/YYYY [às] HH:mm",
                    )}
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

            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold tracking-wider">
                  Convênio
                </span>
                <span className="font-medium text-slate-800">
                  {data.convenio?.nome ?? "Particular"}
                </span>
              </div>

              {data.cliente && (
                <div>
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold tracking-wider">
                    Responsável (Cliente)
                  </span>
                  <span className="font-medium text-slate-800 truncate block max-w-35.5">
                    {data.cliente.pessoa?.nome ?? "Não informado"}
                  </span>
                </div>
              )}
            </div>

            {/* Detalhes Clínicos: Queixa Principal e Observações */}
            <div className="flex flex-col gap-2 bg-slate-50 p-2 rounded-md border border-slate-100 mt-1">
              <div>
                <span className="text-muted-foreground block text-[10px] uppercase font-semibold tracking-wider">
                  Queixa Principal
                </span>
                <p className="text-xs text-slate-600 font-medium mt-0.5 whitespace-pre-line">
                  {data.queixa_principal?.trim() ||
                    "Nenhuma queixa registrada."}
                </p>
              </div>

              {data.observacao?.trim() && (
                <div className="border-t border-slate-200/60 pt-1.5 mt-0.5">
                  <span className="text-muted-foreground block text-[10px] uppercase font-semibold tracking-wider">
                    Observações Internas
                  </span>
                  <p className="text-xs text-slate-500 italic mt-0.5 whitespace-pre-line">
                    {data.observacao}
                  </p>
                </div>
              )}
            </div>
          </div>
        }
        footer={
          <>
            {(() => {
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
                  label: "Iniciar Atendimento",
                  variant: "default",
                  className: "bg-blue-600 hover:bg-blue-700 text-white",
                  nextStatus: "em_andamento",
                  alertTitle: "Deseja iniciar este atendimento?",
                  alertDesc: `O atendimento de "${data.paciente.nome}" mudará para o status Em Andamento.`,
                },
                em_andamento: {
                  label: "Finalizar Atendimento",
                  variant: "default",
                  className: "bg-green-600 hover:bg-green-700 text-white",
                  nextStatus: "finalizado",
                  alertTitle: "Deseja finalizar este atendimento?",
                  alertDesc: `O atendimento de "${data.paciente.nome}" será concluído e encerrado.`,
                },
                finalizado: null,
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

            <AppointmentForm initialValues={data} />
          </>
        }
        itemChildren={
          <>
            <AlertConfirm
              title={textAlert}
              description={descriptionAlert}
              isOpen={isAlertOpen}
              onClose={() => setIsAlertOpen(false)}
              onConfirm={actionConfirm} // Executa a função que foi guardada no estado
            />
          </>
        }
      />
    </>
  );
}
