import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardList } from "@/components/cards/CardList";
import { maskCNPJ } from "@/utils/masks";
import { WhatsappButton } from "@/components/contactButton/Whatsapp";
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
import type { Customer } from "../types/customer.type";
import { CustomerForm } from "./CustomerForm";
import { useCustomerDelete } from "../hooks/useCustomerDelete";
import { useCustomerStatus } from "../hooks/useCustomerStatus";

export function CustomerCard(data: Customer) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");

  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const deleteCustomer = useCustomerDelete();

  const handleExcluir = () => {
    deleteCustomer.mutate(data.id as string);
    setIsAlertOpen(false);
  };

  const changeStatusApi = useCustomerStatus();

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
        title={data.pessoa.nome}
        description={data.pessoa.email || "N/A"}
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
                        `Tem certeza de que deseja EXCLUIR Cliente?`,
                        `Cliente "${data.pessoa.nome}" será excluída permanentemente.`,
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
            <p>CPF: {maskCNPJ(data.pessoa.cpf)}</p>
            <p>Responsável: {data.pessoa?.nome}</p>
            <p className="text-xs text-muted-foreground">
              Telefone:{" "}
              {data.pessoa.contatos && data.pessoa.contatos.length > 0
                ? data.pessoa.contatos[0].contato || "N/A"
                : "N/A"}
              {data.pessoa.contatos &&
              data.pessoa.contatos.length > 0 &&
              data.pessoa.contatos[0].tipo ? (
                <WhatsappButton
                  numero="${data.contatos[0].contato}"
                  message="Olá, gostaria de entrar em contato com Cliente ${data.nome}."
                />
              ) : (
                ""
              )}
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
                  openAlertStandart(
                    "Tem certeza de que deseja DESATIVAR Cliente?",
                    `Cliente "${data.pessoa.nome}" será desativada.`,
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
                    "Tem certeza de que deseja ATIVAR Cliente?",
                    `Cliente "${data.pessoa.nome}" será ativada.`,
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

            <CustomerForm
              initialValues={{ ...data, pessoa: data.pessoa || {} }}
            />
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
