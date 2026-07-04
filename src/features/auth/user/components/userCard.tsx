import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/layouts/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { EllipsisVertical, SquareCheck, Trash2 } from "lucide-react";
import { CardList } from "@/components/cards/CardList";
import type { User } from "../types/user.types";
import { maskCNPJ } from "@/utils/masks";
import { useState } from "react";
import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { useUserStatus } from "../hooks/useUserStatus";
import { UserForm } from "./userForm";

export function UserCard(data: User) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");

  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const handleExcluir = () => {
    setIsAlertOpen(false);
  };

  const changeStatusApi = useUserStatus();

  const handleMudarStatus = ({
    newStatus,
    id,
  }: {
    newStatus: string;
    id: string;
  }) => {
    changeStatusApi.mutate({
      id: id,
      status: newStatus as "ativo" | "inativo",
    });
    setIsAlertOpen(false);
  };

  const abrirAlertaGenerico = (
    title: string,
    description: string,
    confirmFn: () => void,
  ) => {
    setTextAlert(title);
    setDescriptionAlert(description);
    setActionConfirm(() => confirmFn);
    setIsAlertOpen(true);
  };
  return (
    <>
      <CardList
        title={data.username}
        description={data.email}
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
                      abrirAlertaGenerico(
                        "Tem certeza de que deseja EXCLUIR o usuário?",
                        `O usuário "${data.username}" será excluído.`,
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
              CNPJ: {maskCNPJ(data.empresa?.cnpj) || "N/A"}
            </p>
            <p className="text-xs text-muted-foreground">
              Situação:{" "}
              <span
                className={`${
                  data.status === "ativo"
                    ? "text-green-500"
                    : data.status === "inativo"
                      ? "text-red-500"
                      : "text-yellow-500"
                }`}
              >
                {data.status}{" "}
              </span>
            </p>
          </>
        }
        footer={
          <>
            {data.status === "ativo" ? (
              <Button
                variant="destructive"
                onClick={() =>
                  abrirAlertaGenerico(
                    "Tem certeza de que deseja DESATIVAR a empresa?",
                    `A empresa "${data.username}" será desativada.`,
                    () =>
                      handleMudarStatus({
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
                  abrirAlertaGenerico(
                    "Tem certeza de que deseja ATIVAR a empresa?",
                    `A empresa "${data.username}" será ativada.`,
                    () =>
                      handleMudarStatus({
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
            <UserForm initialValues={data} />
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
    </>
  );
}
