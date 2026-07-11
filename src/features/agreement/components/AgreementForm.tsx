import { DialogForm } from "@/components/dialog/DialogForm";
import { Building, Pencil } from "lucide-react";
import { CardPage } from "@/components/cards/CardPage";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import type { AgreementProps } from "../types/agreement.type";
import { useAgreementForm } from "../hooks/useAgreementForm";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";

export function AgreementForm({ initialValues }: AgreementProps) {
  const { form, onSubmit, isPending, errorMessage } =
    useAgreementForm(initialValues);

  const isEditing = !!initialValues;

  return (
    <>
      <DialogForm
        title={isEditing ? "Editar" : "Cadastrar"}
        icon={isEditing ? Pencil : Building}
        variant={isEditing ? "outline" : "default"}
        children={
          <>
            <CardPage
              title={isEditing ? "Editar Convênio" : "Cadastrar Convênio"}
              description={"Preencha os campos abaixo"}
              children={
                <>
                  <form id="form-agreement" onSubmit={onSubmit} noValidate>
                    <FieldGroup>
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-2">
                        <Controller
                          name="nome"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-agreement-nome">
                                Convênio
                              </FieldLabel>
                              <Input {...field} placeholder="Nome da Filial" />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="registro"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-agreement-registro">
                                Registro do Convênio
                              </FieldLabel>
                              <Input
                                {...field}
                                placeholder="registro"
                                value={field.value || ""}
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
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel className="text-xs">Tipo</FieldLabel>
                              <Select
                                onValueChange={field.onChange}
                                value={field.value}
                              >
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione..." />
                                </SelectTrigger>
                                <SelectContent>
                                  <SelectItem value="ativo">Ativo</SelectItem>
                                  <SelectItem value="inativo">
                                    Inativo
                                  </SelectItem>
                                </SelectContent>
                              </Select>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </FieldGroup>
                    <Separator className="my-4" />
                  </form>
                </>
              }
              action={<></>}
              footer={
                <>
                  <DialogClose
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        type="button"
                        className="mr-2 hover:bg-destructive/10 hover:text-destructive"
                        disabled={isPending}
                        onClick={() => form.reset()}
                      >
                        Fechar
                      </Button>
                    }
                  />
                  <Button
                    type="submit"
                    form="form-agreement"
                    variant="outline"
                    size="sm"
                    disabled={isPending}
                    className="bg-primary/80 text-white hover:bg-primary/90 hover:text-primary-foreground"
                  >
                    {isPending ? "Salvando..." : "Salvar"}
                  </Button>
                </>
              }
            />

            {errorMessage && (
              <p className="text-sm text-destructive mt-2">{errorMessage}</p>
            )}
          </>
        }
      />
    </>
  );
}
