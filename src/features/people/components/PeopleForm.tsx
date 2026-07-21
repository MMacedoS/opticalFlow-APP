import { DialogForm } from "@/components/dialog/DialogForm";
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
import { ContactForm } from "@/components/contacts/ContactForm";
import { AddressForm } from "@/components/address/AddressForm";
import { maskCPF } from "@/utils/masks";
import type { PeopleProps } from "../types/people.type";
import { usePeopleForm } from "../hooks/usePeopleForm";
import { DialogClose } from "@/components/ui/dialog";

export function PeopleForm({ initialValues }: PeopleProps) {
  const { form, onSubmit, isPending, errorMessage } =
    usePeopleForm(initialValues);

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
              title={isEditing ? "Editar Pessoa" : "Cadastrar Pessoa"}
              description={"Preencha os campos abaixo"}
              children={
                <>
                  <form id="form-People" onSubmit={onSubmit} noValidate>
                    <FieldGroup>
                      <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
                        <Controller
                          name="nome"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-People-responsavel">
                                Nome completo
                              </FieldLabel>
                              <Input {...field} placeholder="Nome completo" />
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="cpf"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-People-cpf">
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
                          name="data_nascimento"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-People-data_nascimento">
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
                          name="email"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-People-email">
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
                        <Controller
                          name="status"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                              <FieldLabel htmlFor="form-People-status">
                                Status
                              </FieldLabel>
                              <select
                                {...field}
                                className={cn(
                                  "border rounded-lg p-2",
                                  fieldState.invalid && "border-red-500", // Feedback visual de erro
                                )}
                              >
                                <option value="ativo">Ativo</option>
                                <option value="inativo">Inativo</option>
                              </select>
                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </Field>
                          )}
                        />
                        <Controller
                          name="is_cliente"
                          control={form.control}
                          render={({ field, fieldState }) => (
                            <div className="flex flex-col gap-1.5 py-5">
                              <div className="flex items-center gap-2">
                                <input
                                  type="checkbox"
                                  id="is_cliente"
                                  checked={!!field.value}
                                  onChange={(e) =>
                                    field.onChange(e.target.checked)
                                  }
                                  onBlur={field.onBlur}
                                  className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                                />
                                <label
                                  htmlFor="is_cliente"
                                  className="text-sm font-medium text-slate-700 cursor-pointer select-none"
                                >
                                  Esta pessoa é um Cliente
                                </label>
                              </div>

                              <p className="text-xs text-slate-400 pl-6">
                                Marque esta opção para permitir que esta pessoa
                                seja vinculada a lançamentos financeiros e
                                ordens de serviço.
                              </p>

                              {fieldState.invalid && (
                                <FieldError errors={[fieldState.error]} />
                              )}
                            </div>
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
                  <DialogClose
                    render={
                      <Button
                        variant="ghost"
                        size="sm"
                        type="reset"
                        form="form-People"
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
                    form="form-People"
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
