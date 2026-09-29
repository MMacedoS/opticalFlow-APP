import { useState } from "react";
import { Link } from "react-router-dom";
import { Button, buttonVariants } from "@/components/ui/button";
import { CardList } from "@/components/cards/CardList";
import { SquareCheck, Ban, FileHeart } from "lucide-react";
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
import { useAuthStore } from "@/stores/auth.store";

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

  // Iniciar e finalizar sao do profissional do atendimento, e iniciar so no
  // dia marcado (as mesmas regras sao validadas na API).
  const usuarioId = useAuthStore((state) => state.session?.usuario?.id);
  const ehProfissionalDoAtendimento = Boolean(
    usuarioId && data.profissionalId === usuarioId,
  );
  const ehDiaDoAtendimento = dayjs(data.dataAtendimento).isSame(dayjs(), "day");

  const isOutdated =
    dayjs().isAfter(dayjs(data.dataAtendimento)) &&
    data.status !== "concluido" &&
    data.status !== "cancelado";

  return (
    <div
      className={`rounded-xl transition-all ${
        isOutdated ? "shadow-lg shadow-red-500/40 ring-1 ring-red-300" : ""
      }`}
    >
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
                        `O horário agendado já passou. Deseja alterar o status de "${data.paciente.nome}" para Cancelado?`,
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
                  alertDesc: `O atendimento de "${data.paciente.nome}" mudará para o status Em Andamento.`,
                },
                em_andamento: {
                  label: "Finalizar",
                  variant: "default",
                  className: "bg-green-600 hover:bg-green-700 text-white",
                  nextStatus: "concluido",
                  alertTitle: "Deseja finalizar este atendimento?",
                  alertDesc: `O atendimento de "${data.paciente.nome}" será concluído e encerrado.`,
                },
                concluido: null,
                cancelado: null,
              };

              const currentAction = actionMap[data.status as StatusAtendimento];

              if (!currentAction || !ehProfissionalDoAtendimento) return null;

              const aguardandoDia =
                data.status === "em_espera" && !ehDiaDoAtendimento;

              return (
                <Button
                  variant={currentAction.variant}
                  className={currentAction.className}
                  disabled={aguardandoDia}
                  title={
                    aguardandoDia
                      ? "A consulta só pode ser iniciada no dia do atendimento."
                      : undefined
                  }
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

            {data.status !== "cancelado" && (
              <Link
                to={`/prontuarios/atendimento/${data.id}`}
                className={buttonVariants({ variant: "outline", size: "sm" })}
                title={
                  data.prontuarioId ? "Ver prontuário" : "Abrir prontuário"
                }
              >
                <FileHeart className="mr-2 h-4 w-4" />
                Prontuário
              </Link>
            )}

            <AppointmentForm initialValues={data} onClose={() => {}} />
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
