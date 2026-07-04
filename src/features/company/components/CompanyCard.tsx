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
import { EllipsisVertical, Trash2 } from "lucide-react";

import type { Company } from "../types/company.types";
import { CompanyForm } from "./CompanyForm";

export function CompanyCard(data: Company) {
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
                  <DropdownMenuItem>
                    <Trash2 />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardAction>
        </CardHeader>
        <CardContent className="space-y-2">
          <p className="text-xs text-muted-foreground">CNPJ: {data.cnpj}</p>
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
        <CardFooter className="flex justify-end">
          <CompanyForm initialData={data} />
        </CardFooter>
      </Card>
    </>
  );
}
