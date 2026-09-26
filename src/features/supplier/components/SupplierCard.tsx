import { useState } from "react";
import { EllipsisVertical, Power, Trash2 } from "lucide-react";

import { useSupplierDelete, useSupplierUpdate } from "../hooks/useSuppliers";
import type { Supplier } from "../types/supplier.type";
import { SupplierForm } from "./SupplierForm";

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

const formatCnpj = (cnpj: string) =>
  cnpj.replace(/^(\d{2})(\d{3})(\d{3})(\d{4})(\d{2})$/, "$1.$2.$3/$4-$5");

type PendingAction = {
  title: string;
  description: string;
  run: () => void;
};

export function SupplierCard({ supplier }: { supplier: Supplier }) {
  const [pendingAction, setPendingAction] = useState<PendingAction | null>(
    null,
  );
  const deleteMutation = useSupplierDelete();
  const updateMutation = useSupplierUpdate();

  const confirmDelete = () =>
    setPendingAction({
      title: "Excluir fornecedor?",
      description: `"${supplier.razao_social}" será excluído permanentemente. Fornecedores com compras não podem ser excluídos, apenas inativados.`,
      run: () => deleteMutation.mutate(supplier.id),
    });

  const confirmToggle = () =>
    setPendingAction({
      title: supplier.ativo ? "Inativar fornecedor?" : "Ativar fornecedor?",
      description: supplier.ativo
        ? `"${supplier.razao_social}" deixará de aparecer na seleção das compras.`
        : `"${supplier.razao_social}" voltará a aparecer na seleção das compras.`,
      run: () =>
        updateMutation.mutate({
          id: supplier.id,
          payload: { ativo: !supplier.ativo },
        }),
    });

  return (
    <CardList
      title={supplier.nome_fantasia ?? supplier.razao_social}
      description={
        supplier.cnpj ? `CNPJ ${formatCnpj(supplier.cnpj)}` : "Sem CNPJ"
      }
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
          {supplier.nome_fantasia && <p>{supplier.razao_social}</p>}
          <p>E-mail: {supplier.email ?? "—"}</p>
          <p>Telefone: {supplier.telefone ?? "—"}</p>
          <p>
            Situação:{" "}
            <span
              className={supplier.ativo ? "text-green-600" : "text-red-500"}
            >
              {supplier.ativo ? "ativo" : "inativo"}
            </span>
          </p>
        </div>
      }
      footer={
        <>
          <Button
            variant={supplier.ativo ? "destructive" : "default"}
            size="sm"
            onClick={confirmToggle}
          >
            <Power className="mr-2 size-4" />
            {supplier.ativo ? "Inativar" : "Ativar"}
          </Button>
          <SupplierForm supplier={supplier} />
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
