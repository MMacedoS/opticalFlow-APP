import { DialogForm } from "@/components/dialog/DialogForm";
import { useBranchForm } from "../hooks/useBranchForm";
import type { BranchFormProps } from "../types/branch.type";
import { Building, CalendarIcon, Pencil } from "lucide-react";
import { CardPage } from "@/components/cards/CardPage";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { Controller } from "react-hook-form";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverTrigger,
  PopoverContent,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { cn } from "@/lib/utils";
import { Separator } from "@/components/ui/separator";
import { ContactForm } from "@/components/ContactForm";
import { AddressForm } from "@/components/address/AddressForm";
import { maskCNPJ, maskCPF } from "@/utils/masks";

export function BranchForm({ initialValues }: BranchFormProps) {
  const { form, onSubmit, isPending, errorMessage } =
    useBranchForm(initialValues);

  const isEditing = !!initialValues;

  const enderecos = form.watch("enderecos") || [];
  const contatos = form.watch("contatos") || [];

  return (
    <>
      <DialogForm
        title={isEditing ? "Editar" : "Cadastrar"}
        icon={isEditing ? Pencil : Building}
        variant={isEditing ? "outline" : "default"}
        children={
          <>
            <CardPage
              title={isEditing ? "Editar Filial" : "Cadastrar Empresa"}
              description={"Preencha os campos abaixo"}
              children={
                <>
                  <form id="form-branch" onSubmit={onSubmit} noValidate>
                    <FieldGroup>
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <Controller
                          name="nome"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-branch-nome">
                                Empresa
                              </FieldLabel>
                              <Input {...field} placeholder="Nome da Filial" />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="cnpj"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-branch-cnpj">
                                CNPJ
                              </FieldLabel>
                              <Input
                                {...field}
                                placeholder="CNPJ"
                                value={maskCNPJ(field.value || "")}
                                onChange={(e) =>
                                  field.onChange(maskCNPJ(e.target.value))
                                }
                                maxLength={18}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="pessoa.nome"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-branch-responsavel">
                                Nome completo
                              </FieldLabel>
                              <Input
                                {...field}
                                placeholder="Nome completo do Responsável pela empresa"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="pessoa.cpf"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-branch-cpf">
                                CPF do Responsável
                              </FieldLabel>
                              <Input
                                {...field}
                                placeholder="CPF"
                                value={maskCPF(field.value || "")}
                                onChange={(e) =>
                                  field.onChange(maskCPF(e.target.value))
                                }
                                maxLength={14}
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="pessoa.data_nascimento"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-branch-data_nascimento">
                                Data de Nascimento
                              </FieldLabel>
                              <Popover>
                                <PopoverTrigger>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !field.value && "text-muted-foreground",
                                      fieldState.invalid && "border-red-500", // Feedback visual de erro
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {field.value ? (
                                      format(field.value, "PPP", {
                                        locale: ptBR,
                                      })
                                    ) : (
                                      <span>Selecione uma data</span>
                                    )}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent
                                  className="w-auto p-0"
                                  align="start"
                                >
                                  <Calendar
                                    mode="single"
                                    selected={field.value}
                                    onSelect={field.onChange}
                                    disabled={(date) =>
                                      date > new Date() ||
                                      date < new Date("1900-01-01")
                                    }
                                  />
                                </PopoverContent>
                              </Popover>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="pessoa.email"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-branch-email">
                                E-mail do Responsável
                              </FieldLabel>
                              <Input
                                {...field}
                                placeholder="E-mail"
                                type="email"
                              />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                      </div>
                    </FieldGroup>
                    <Separator className="my-4" />
                    <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-2">
                      <AddressForm
                        className="mt-4"
                        data={enderecos}
                        onChange={(data) =>
                          form.setValue("enderecos", data, {
                            shouldValidate: true,
                          })
                        }
                      />
                      <ContactForm
                        className="mt-4"
                        data={contatos}
                        onChange={(data) =>
                          form.setValue("contatos", data, {
                            shouldValidate: true,
                          })
                        }
                      />
                    </div>
                  </form>
                </>
              }
              action={<></>}
              footer={
                <>
                  <Button
                    variant="ghost"
                    size="sm"
                    type="reset"
                    form="form-branch"
                    className="mr-2 hover:bg-destructive/10 hover:text-destructive"
                    disabled={isPending}
                    onClick={() => form.reset()}
                  >
                    Limpar
                  </Button>
                  <Button
                    type="submit"
                    form="form-branch"
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
