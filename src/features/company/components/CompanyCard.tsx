import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/layouts/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { EllipsisVertical, SquareCheck, Trash2 } from "lucide-react";

import type { Company } from "../types/company.types";
import { CompanyForm } from "./CompanyForm";
import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { useState } from "react";
import { useCompanyStatus } from "../hooks/useCompanyStatus";
import { useCompanyDelete } from "../hooks/useCompanyDelete";
import { maskCNPJ } from "@/utils/masks";
import { WhatsappButton } from "@/components/contactButton/Whatsapp";

export function CompanyCard(data: Company) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");

  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const deleteCompany = useCompanyDelete();

  const handleExcluir = () => {
    deleteCompany.mutate(data.id as string);
    setIsAlertOpen(false);
  };

  const changeStatusApi = useCompanyStatus();

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
      <Card className="rounded-4xl border border-border/70 shadow-lg bg-zinc-100 hover:bg-zinc-300 transition-colors duration-200">
        <CardHeader>
          <CardTitle className="text-sm font-semibold text-foreground">
            {data.nome}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {data.website}
          </CardDescription>
          <CardAction>
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
                        `Tem certeza de que deseja EXCLUIR a empresa?`,
                        `A empresa "${data.nome}" será excluída permanentemente.`,
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
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">
            CNPJ: {maskCNPJ(data.cnpj) || "N/A"}
          </p>
          <p className="text-xs text-muted-foreground">
            Telefone:{" "}
            {data.contatos.length > 0
              ? data.contatos[0].contato || "N/A"
              : "N/A"}
            {data.contatos.length > 0 && data.contatos[0].tipo ? (
              <WhatsappButton
                numero="${data.contatos[0].contato}"
                message="Olá, gostaria de entrar em contato com a empresa ${data.nome}."
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
          <p className="text-xs text-muted-foreground">
            Registro Estadual: {data.registro_estadual || "N/A"}
          </p>
          <p className="text-xs text-muted-foreground">
            Registro Municipal: {data.registro_municipal || "N/A"}
          </p>
        </CardContent>
        <Separator className="my-2" />
        <CardFooter className="flex justify-end gap-2">
          {data.status === "ativo" ? (
            <Button
              variant="destructive"
              onClick={() =>
                abrirAlertaGenerico(
                  "Tem certeza de que deseja DESATIVAR a empresa?",
                  `A empresa "${data.nome}" será desativada.`,
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
                  `A empresa "${data.nome}" será ativada.`,
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
          <CompanyForm initialData={data} />
        </CardFooter>
      </Card>
      <AlertConfirm
        title={textAlert}
        description={descriptionAlert}
        isOpen={isAlertOpen}
        onClose={() => setIsAlertOpen(false)}
        onConfirm={actionConfirm} // Executa a função que foi guardada no estado
      />
    </>
  );
}
