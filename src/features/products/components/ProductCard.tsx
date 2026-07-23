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
import type { Product } from "../types/product.type";
import { useProductStatus } from "../hooks/useProductStatus";
import { useProductDelete } from "../hooks/useProductDelete";
import { ProductForm } from "./ProductForm";
import { formatCurrencyDisplay } from "@/utils/masks";

export function ProductCard(data: Product) {
  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");

  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const deleteProduct = useProductDelete();

  const handleExcluir = () => {
    deleteProduct.mutate(data.id as string);
    setIsAlertOpen(false);
  };

  const changeStatusApi = useProductStatus();

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
        description={data.descricao || "Sem descrição"}
        action={
          <DropdownMenu>
            <DropdownMenuTrigger
              render={(props) => (
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 text-slate-500 hover:text-slate-900"
                  {...props}
                >
                  <EllipsisVertical className="h-4 w-4" />
                </Button>
              )}
            />
            <DropdownMenuContent align="end">
              <DropdownMenuGroup>
                <DropdownMenuItem
                  className="text-red-600 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                  onClick={() =>
                    openAlertStandart(
                      "Tem certeza de que deseja EXCLUIR o produto?",
                      `O produto "${data.nome}" será excluído permanentemente.`,
                      () => handleExcluir(),
                    )
                  }
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir produto
                </DropdownMenuItem>
              </DropdownMenuGroup>
            </DropdownMenuContent>
          </DropdownMenu>
        }
        content={
          <div className="flex flex-col p-2">
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Produto
                </span>
                <h4 className="text-base font-semibold tracking-tight text-slate-900">
                  {data.nome ?? "Sem nome"}
                </h4>
              </div>

              <div className="text-right">
                <span
                  className={`inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-medium border ${
                    data.ativo === "ativo"
                      ? "bg-emerald-50 text-emerald-700 border-emerald-200"
                      : data.ativo === "inativo"
                        ? "bg-rose-50 text-rose-700 border-rose-200"
                        : "bg-amber-50 text-amber-700 border-amber-200"
                  }`}
                >
                  <span
                    className={`h-1.5 w-1.5 rounded-full ${
                      data.ativo === "ativo"
                        ? "bg-emerald-500"
                        : data.ativo === "inativo"
                          ? "bg-rose-500"
                          : "bg-amber-500"
                    }`}
                  />
                  {data.ativo === "ativo"
                    ? "Ativo"
                    : data.ativo === "inativo"
                      ? "Inativo"
                      : data.ativo}
                </span>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 border-b border-slate-100 pb-3">
              <div className="space-y-0.5">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Valor
                </span>
                <h4 className="text-base font-semibold tracking-tight text-slate-900">
                  {formatCurrencyDisplay(data.preco_venda) ?? "Sem nome"}
                </h4>
              </div>
              <div className="text-right">
                <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                  Estoque
                </span>
                <h4 className="text-base font-semibold tracking-tight text-slate-900">
                  {data.estoque_itens?.[0]?.quantidade ?? 0}
                </h4>
              </div>
            </div>
          </div>
        }
        footer={
          <div className="flex w-full items-center justify-between gap-3 pt-2">
            {data.ativo === "ativo" ? (
              <Button
                variant="outline"
                className="bg-amber-600 border-slate-200 text-slate-700 hover:bg-slate-50 hover:text-slate-900"
                onClick={() =>
                  openAlertStandart(
                    "Tem certeza de que deseja DESATIVAR o produto?",
                    `O produto "${data.nome}" será desativado.`,
                    () =>
                      handleChangeStatus({
                        newStatus: "inativo",
                        id: data.id as string,
                      }),
                  )
                }
              >
                <SquareCheck className="mr-2 h-4 w-4 text-slate-500" />
                Desativar
              </Button>
            ) : (
              <Button
                variant="outline"
                className="bg-blue-200 border-emerald-200 text-emerald-700 hover:bg-emerald-50 hover:text-emerald-800"
                onClick={() =>
                  openAlertStandart(
                    "Tem certeza de que deseja ATIVAR o produto?",
                    `O produto "${data.nome}" será ativado.`,
                    () =>
                      handleChangeStatus({
                        newStatus: "ativo",
                        id: data.id as string,
                      }),
                  )
                }
              >
                <SquareCheck className="mr-2 h-4 w-4 text-emerald-600" />
                Ativar
              </Button>
            )}

            <ProductForm initialValues={data} />
          </div>
        }
        itemChildren={
          <AlertConfirm
            title={textAlert}
            description={descriptionAlert}
            isOpen={isAlertOpen}
            onClose={() => setIsAlertOpen(false)}
            onConfirm={actionConfirm}
          />
        }
      />
    </>
  );
}
