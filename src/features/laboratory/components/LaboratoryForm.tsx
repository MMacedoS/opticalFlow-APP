import { useState } from "react";
import { FlaskConical, Pencil } from "lucide-react";
import { Controller } from "react-hook-form";

import { useLaboratoryForm } from "../hooks/useLaboratoryForm";
import type { Laboratory } from "../types/laboratory.type";

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

type LaboratoryFormProps = {
  laboratory?: Laboratory;
};

const TEXT_FIELDS = [
  { name: "nome", label: "Nome", placeholder: "Nome do laboratório" },
  { name: "cnpj", label: "CNPJ", placeholder: "00.000.000/0000-00" },
  { name: "email", label: "E-mail", placeholder: "contato@laboratorio.com" },
  { name: "telefone", label: "Telefone", placeholder: "(00) 00000-0000" },
] as const;

export function LaboratoryForm({ laboratory }: LaboratoryFormProps) {
  const [open, setOpen] = useState(false);
  const { form, onSubmit, isPending } = useLaboratoryForm(laboratory, () =>
    setOpen(false),
  );

  const isEditing = Boolean(laboratory);
  const formId = `form-laboratory-${laboratory?.id ?? "new"}`;

  return (
    <DialogForm
      title={isEditing ? "Editar" : "Cadastrar"}
      icon={isEditing ? Pencil : FlaskConical}
      variant={isEditing ? "outline" : "default"}
      width="max-w-2xl!"
      open={open}
      onOpenChange={setOpen}
    >
      <CardPage
        title={isEditing ? "Editar laboratório" : "Cadastrar laboratório"}
        description="Laboratórios que recebem as ordens de serviço"
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
