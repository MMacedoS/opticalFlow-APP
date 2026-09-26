import { useState } from "react";
import { Pencil, Truck } from "lucide-react";
import { Controller } from "react-hook-form";

import { useSupplierForm } from "../hooks/useSupplierForm";
import type { Supplier } from "../types/supplier.type";

import { CardPage } from "@/components/cards/CardPage";
import { DialogForm } from "@/components/dialog/DialogForm";
import { Button } from "@/components/ui/button";
import { DialogClose } from "@/components/ui/dialog";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";

type SupplierFormProps = {
  supplier?: Supplier;
};

const TEXT_FIELDS = [
  { name: "razao_social", label: "Razão social", placeholder: "Razão social" },
  {
    name: "nome_fantasia",
    label: "Nome fantasia",
    placeholder: "Nome fantasia",
  },
  { name: "cnpj", label: "CNPJ", placeholder: "00.000.000/0000-00" },
  { name: "email", label: "E-mail", placeholder: "contato@fornecedor.com" },
  { name: "telefone", label: "Telefone", placeholder: "(00) 00000-0000" },
] as const;

export function SupplierForm({ supplier }: SupplierFormProps) {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isPending } = useSupplierForm(supplier, () =>
    setOpen(false),
  );

  const isEditing = Boolean(supplier);
  const formId = `form-supplier-${supplier?.id ?? "new"}`;

  return (
    <DialogForm
      title={isEditing ? "Editar" : "Cadastrar"}
      icon={isEditing ? Pencil : Truck}
      variant={isEditing ? "outline" : "default"}
      width="max-w-2xl!"
      open={open}
      onOpenChange={setOpen}
    >
      <CardPage
        title={isEditing ? "Editar fornecedor" : "Cadastrar fornecedor"}
        description="Empresas que fornecem produtos para as compras"
        action={<></>}
        footer={
          <>
            <DialogClose
              render={
                <Button
                  variant="ghost"
                  size="sm"
                  type="button"
                  className="mr-2"
                  disabled={isPending}
                >
                  Fechar
                </Button>
              }
            />
            <Button type="submit" form={formId} size="sm" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </>
        }
      >
        <form id={formId} onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <div className="grid gap-3 md:grid-cols-2">
              {TEXT_FIELDS.map(({ name, label, placeholder }) => (
                <Controller
                  key={name}
                  name={name}
                  control={form.control}
                  render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                      <FieldLabel htmlFor={`${formId}-${name}`}>
                        {label}
                      </FieldLabel>
                      <Input
                        {...field}
                        id={`${formId}-${name}`}
                        placeholder={placeholder}
                        value={field.value ?? ""}
                      />
                      {fieldState.invalid && (
                        <FieldError errors={[fieldState.error]} />
                      )}
                    </Field>
                  )}
                />
              ))}
              <Controller
                name="observacoes"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field
                    data-invalid={fieldState.invalid}
                    className="md:col-span-2"
                  >
                    <FieldLabel htmlFor={`${formId}-observacoes`}>
                      Observações
                    </FieldLabel>
                    <Textarea
                      {...field}
                      id={`${formId}-observacoes`}
                      placeholder="Condições de pagamento, prazos, contato..."
                      value={field.value ?? ""}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="ativo"
                control={form.control}
                render={({ field }) => (
                  <Field orientation="horizontal">
                    <Switch
                      id={`${formId}-ativo`}
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel htmlFor={`${formId}-ativo`}>Ativo</FieldLabel>
                  </Field>
                )}
              />
            </div>
          </FieldGroup>
        </form>
      </CardPage>
    </DialogForm>
  );
}
