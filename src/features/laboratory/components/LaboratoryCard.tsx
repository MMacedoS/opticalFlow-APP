import { useState } from "react";
import { EllipsisVertical, Power, Trash2 } from "lucide-react";

import {
  useLaboratoryDelete,
  useLaboratoryUpdate,
} from "../hooks/useLaboratories";
import type { Laboratory } from "../types/laboratory.type";
import { LaboratoryForm } from "./LaboratoryForm";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/app/layouts/components/ui/dropdown-menu";
import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { CardList } from "@/components/cards/CardList";
import { Button } from "@/components/ui/button";

type PendingAction = {
  title: string;
  description: string;
  run: () => void;
};

export function LaboratoryCard({ laboratory }: { laboratory: Laboratory }) {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const deleteMutation = useLaboratoryDelete();
  const updateMutation = useLaboratoryUpdate();

  const confirmDelete = () =>
    setPendingAction({
      title: "Excluir laboratório?",
      description: `"${laboratory.nome}" será excluído permanentemente. Laboratórios com ordens de serviço não podem ser excluídos, apenas inativados.`,
      run: () => deleteMutation.mutate(laboratory.id),
    });

  const confirmToggle = () =>
    setPendingAction({
      title: laboratory.ativo ? "Inativar laboratório?" : "Ativar laboratório?",
      description: laboratory.ativo
        ? `"${laboratory.nome}" deixará de aparecer na seleção das ordens de serviço.`
        : `"${laboratory.nome}" voltará a aparecer na seleção das ordens de serviço.`,
      run: () =>
        updateMutation.mutate({
          id: laboratory.id,
          payload: { ativo: !laboratory.ativo },
        }),
    });

  return (
    <CardList
      title={laboratory.nome}
      description={laboratory.cnpj ? `CNPJ ${laboratory.cnpj}` : "Sem CNPJ"}
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
              <DropdownMenuItem onClick={confirmDelete}>
                <Trash2 className="mr-2 size-4" />
                Excluir
              </DropdownMenuItem>
            </DropdownMenuGroup>
          </DropdownMenuContent>
        </DropdownMenu>
      }
      content={
        <div className="space-y-1 text-xs text-muted-foreground">
          <p>E-mail: {laboratory.email ?? "—"}</p>
          <p>Telefone: {laboratory.telefone ?? "—"}</p>
          <p>
            Situação:{" "}
            <span
              className={laboratory.ativo ? "text-green-600" : "text-red-500"}
            >
              {laboratory.ativo ? "ativo" : "inativo"}
            </span>
          </p>
        </div>
      }
      footer={
        <>
          <Button
            variant={laboratory.ativo ? "destructive" : "default"}
            size="sm"
            onClick={confirmToggle}
          >
            <Power className="mr-2 size-4" />
            {laboratory.ativo ? "Inativar" : "Ativar"}
          </Button>
          <LaboratoryForm laboratory={laboratory} />
        </>
      }
      itemChildren={
        <AlertConfirm
          title={pendingAction?.title ?? ""}
          description={pendingAction?.description ?? ""}
          isOpen={pendingAction !== null}
          onClose={() => setPendingAction(null)}
          onConfirm={() => {
            pendingAction?.run();
            setPendingAction(null);
          }}
        />
      }
    />
  );
}
