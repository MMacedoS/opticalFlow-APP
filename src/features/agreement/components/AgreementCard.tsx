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
import type { Agreement } from "../types/agreement.type";
import { useAgreementDelete } from "../hooks/useAgreementDelete";
import { useAgreementStatus } from "../hooks/useAgreementStatus";
import { AgreementForm } from "./AgreementForm";

export function AgreementCard(data: Agreement) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");

  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const deleteAgreement = useAgreementDelete();

  const handleExcluir = () => {
    deleteAgreement.mutate(data.id as string);
    setIsAlertOpen(false);
  };

  const changeStatusApi = useAgreementStatus();

  const handleChangeStatus = ({
    newStatus,
    id,
  }: {
    newStatus: "ativo" | "inativo";
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
        title={data.nome}
        description={data.registro}
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
                        `Tem certeza de que deseja EXCLUIR o convenio?`,
                        `A convenio "${data.nome}" será excluída permanentemente.`,
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
          <>
            <p className="text-xs text-muted-foreground">
              Situação:{" "}
              <span
                className={`${
                  data.ativo === "ativo"
                    ? "text-green-500"
                    : data.ativo === "inativo"
                      ? "text-red-500"
                      : "text-yellow-500"
                }`}
              >
                {data.ativo}{" "}
              </span>
            </p>
          </>
        }
        footer={
          <>
            {data.ativo === "ativo" ? (
              <Button
                variant="destructive"
                onClick={() =>
                  openAlertStandart(
                    "Tem certeza de que deseja DESATIVAR o convenio?",
                    `O convenio "${data.nome}" será desativado.`,
                    () =>
                      handleChangeStatus({
                        newStatus: "inativo",
                        id: data.id as string,
                      }),
                  )
                }
              >
                <SquareCheck className="mr-2 h-4 w-4" />
                Desativar
              </Button>
            ) : (
              <Button
                variant="default"
                className="bg-green-300 text-amber-50 hover:bg-green-400 hover:text-amber-50"
                onClick={() =>
                  openAlertStandart(
                    "Tem certeza de que deseja ATIVAR a convenio?",
                    `O convenio "${data.nome}" será ativada.`,
                    () =>
                      handleChangeStatus({
                        newStatus: "ativo",
                        id: data.id as string,
                      }),
                  )
                }
              >
                <SquareCheck className="mr-2 h-4 w-4" />
                Ativar
              </Button>
            )}

            <AgreementForm initialValues={data} />
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
