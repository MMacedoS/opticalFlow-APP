import { DialogForm } from "@/components/dialog/DialogForm";
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
import { DialogClose } from "@/components/ui/dialog";
import { useScheduleForm } from "../hooks/useScheduleForm";
import type { ScheduleFormValues } from "../schema/scheduleSchema";
import { CalendarIcon, Pencil } from "lucide-react";
import { usePeople } from "@/features/people/hooks/usePeople";
import { useState } from "react";
import AsyncSelect from "react-select/async";
import type { SelectOption } from "@/types/type";
import { useOphthalmologistsList } from "@/features/ophthalmologist/hooks/useOphthalmologistList";
import { useOptometristsList } from "@/features/optometrist/hooks/useOptometristList";
import { useScheduleDelete } from "../hooks/useScheduleDelete";
import { AlertConfirm } from "@/components/alert/AlertConfirm";
import { useCustomerList } from "@/features/customer/hooks/useCustomerList";

interface ScheduleFormProps {
  initialValues?: Partial<ScheduleFormValues>;
  onClose: () => void;
}

export function ScheduleForm({ initialValues, onClose }: ScheduleFormProps) {
  const { form, onSubmit, isPending, errorMessage } = useScheduleForm(
    initialValues,
    onClose,
  );

  const temResponsavel = form.watch("temResponsavel");

  const [searchTerm, setSearchTerm] = useState("");
  const [searchCustomer, setSearchCustomer] = useState("");
  const [searchOftalmo, setSearchOftalmo] = useState("");
  const [searchOptometro, setSearchOptometro] = useState("");
  const [tipoProfissional, setTipoProfissional] = useState<
    "oftalmo" | "optometro"
  >("oftalmo");

  const [isAlertOpen, setIsAlertOpen] = useState(false);
  const [textAlert, setTextAlert] = useState("");
  const [descriptionAlert, setDescriptionAlert] = useState("");
  const [actionConfirm, setActionConfirm] = useState<() => void>(() => {});

  const oftalmologistas = useOphthalmologistsList({
    search: searchOftalmo,
    page: 1,
    limit: 20,
  });
  const optometristas = useOptometristsList({
    search: searchOptometro,
    page: 1,
    limit: 20,
  });

  const peoples = usePeople({ search: searchTerm, limit: 20, page: 1 });

  const customers = useCustomerList({
    search: searchCustomer,
    limit: 20,
    page: 1,
  });

  const loadOptions = async (inputValue: string): Promise<SelectOption[]> => {
    if (inputValue.trim().length < 3) {
      return [];
    }

    setSearchTerm(inputValue);

    if (peoples.data?.data.peoples) {
      return peoples.data.data.peoples.map((pessoa) => ({
        value: pessoa.id,
        label: pessoa.nome,
      }));
    }

    return [];
  };

  const loadCustomerOptions = async (
    inputValue: string,
  ): Promise<SelectOption[]> => {
    if (inputValue.trim().length < 3) {
      return [];
    }

    setSearchCustomer(inputValue);

    if (customers.data?.data.customers) {
      return customers.data.data.customers.map((customer) => ({
        value: customer.id,
        label: customer.pessoa.nome,
      }));
    }

    return [];
  };

  const loadOftalmoOptions = async (
    inputValue: string,
  ): Promise<SelectOption[]> => {
    if (inputValue.trim().length < 3) return [];
    setSearchOftalmo(inputValue);
    return (
      oftalmologistas.data?.data.ophthalmologists.map((p) => ({
        value: p.pessoa.usuario?.id || p.pessoa.id,
        label: p.pessoa.nome,
      })) || []
    );
  };

  const loadOptometroOptions = async (
    inputValue: string,
  ): Promise<SelectOption[]> => {
    if (inputValue.trim().length < 3) return [];
    setSearchOptometro(inputValue);
    return (
      optometristas.data?.data.optometrists.map((p) => ({
        value: p.pessoa.usuario?.id || p.pessoa.id,
        label: p.pessoa.nome,
      })) || []
    );
  };

  const deleteEvent = useScheduleDelete();

  const handleExcluir = (id: string) => {
    deleteEvent.mutate(id, {
      onSuccess: () => {
        setIsAlertOpen(false);
        onClose();
      },
    });
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

  const isEditing = !!initialValues?.id;

  return (
    <DialogForm
      title={isEditing ? "Editar Evento" : "Novo Evento"}
      icon={isEditing ? Pencil : CalendarIcon}
      variant={isEditing ? "destructive" : "default"}
      width="max-w-4xl!"
    >
      <CardPage
        title={isEditing ? "Modificar Consulta" : "Agendar Paciente"}
        description="Configure as informações de horário e profissionais abaixo"
        action={
          isEditing && (
            <Button
              variant="destructive"
              onClick={() => {
                if (initialValues?.id) {
                  openAlertStandart(
                    `Tem certeza de que deseja EXCLUIR evento?`,
                    `Agenda com "${initialValues.paciente?.nome}" será excluída permanentemente.`,
                    () => handleExcluir(initialValues.id as string),
                  );
                }
              }}
            >
              Deletar Agendamento
            </Button>
          )
        }
      >
        <form id="form-Schedule" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <div className="grid sm:grid-cols-1 md:grid-cols-2 gap-4">
              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <span
                    className={`text-xs font-medium ${tipoProfissional === "oftalmo" ? "text-blue-600" : "text-slate-400"}`}
                  >
                    Oftalmologista
                  </span>

                  <input
                    type="checkbox"
                    className="toggle-switch"
                    checked={tipoProfissional === "optometro"}
                    onChange={(e) => {
                      const novoTipo = e.target.checked
                        ? "optometro"
                        : "oftalmo";
                      setTipoProfissional(novoTipo);
                      form.setValue("profissionalId", "");
                    }}
                  />

                  <span
                    className={`text-xs font-medium ${tipoProfissional === "optometro" ? "text-blue-600" : "text-slate-400"}`}
                  >
                    Optometrista
                  </span>
                </div>

                <Controller
                  name="profissionalId"
                  control={form.control}
                  render={({ field, fieldState }) => {
                    const listaAtual =
                      tipoProfissional === "oftalmo"
                        ? oftalmologistas.data?.data.ophthalmologists
                        : optometristas.data?.data.optometrists;

                    const valorSelecionado = field.value
                      ? (() => {
                          const profissional = listaAtual?.find(
                            (p) => p.pessoa.usuario?.id === field.value,
                          );

                          if (profissional) {
                            return {
                              value: profissional.pessoa.usuario?.id ?? "",
                              label: profissional.pessoa.nome,
                            };
                          }
                          return null;
                        })()
                      : null;

                    return (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>
                          {tipoProfissional === "oftalmo"
                            ? "Médico Oftalmologista"
                            : "Optometrista"}
                        </FieldLabel>

                        <AsyncSelect<SelectOption, false>
                          key={tipoProfissional}
                          cacheOptions
                          defaultOptions={false}
                          isClearable
                          placeholder={`Buscar ${tipoProfissional === "oftalmo" ? "oftalmologista" : "optometrista"}...`}
                          className="text-sm"
                          classNamePrefix="react-select"
                          loadOptions={
                            tipoProfissional === "oftalmo"
                              ? loadOftalmoOptions
                              : loadOptometroOptions
                          }
                          value={valorSelecionado}
                          onChange={(option) => {
                            field.onChange(option ? option.value : null);
                          }}
                          onBlur={field.onBlur}
                          noOptionsMessage={({ inputValue }) =>
                            inputValue.length < 3
                              ? "Digite 3 ou mais caracteres"
                              : "Nenhum profissional encontrado"
                          }
                          loadingMessage={() => "Buscando profissionais..."}
                        />

                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    );
                  }}
                />
              </div>

              <div className="flex flex-col gap-4">
                <div className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id="temResponsavel"
                    {...form.register("temResponsavel")}
                    onChange={(e) => {
                      form.setValue("temResponsavel", e.target.checked);
                      if (!e.target.checked) {
                        form.setValue("clienteId", null); // Limpa o cliente se desmarcar
                      }
                    }}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 cursor-pointer"
                  />
                  <label
                    htmlFor="temResponsavel"
                    className="text-xs font-medium text-slate-600 cursor-pointer select-none"
                  >
                    O responsável financeiro/comercial é outra pessoa (Cliente)
                  </label>
                </div>

                {temResponsavel && (
                  <Controller
                    name="clienteId"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field
                        data-invalid={fieldState.invalid}
                        className="animate-in fade-in slide-in-from-top-1 duration-200"
                      >
                        <FieldLabel>
                          Cliente (Responsável Financeiro)
                        </FieldLabel>
                        <AsyncSelect<SelectOption, false>
                          cacheOptions
                          loadOptions={loadCustomerOptions}
                          defaultOptions={false}
                          isClearable
                          placeholder="Busque o responsável pelo pagamento..."
                          className="text-sm react-select-container"
                          classNamePrefix="react-select"
                          value={
                            field.value
                              ? customers.data?.data.customers
                                  .filter((p) => p.id === field.value)
                                  .map((p) => ({
                                    value: p.id,
                                    label: p.pessoa.nome,
                                  }))[0] || null
                              : null
                          }
                          onChange={(option) => {
                            field.onChange(option ? option.value : null);
                          }}
                          onBlur={field.onBlur}
                          noOptionsMessage={({ inputValue }) =>
                            inputValue.length < 3
                              ? "Digite 3 ou mais caracteres para buscar"
                              : "Nenhum cliente encontrado"
                          }
                          loadingMessage={() => "Buscando clientes..."}
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                )}
              </div>

              <Controller
                name="pessoaId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Paciente</FieldLabel>
                    <AsyncSelect<SelectOption, false>
                      cacheOptions
                      loadOptions={loadOptions}
                      defaultOptions={false}
                      isClearable
                      placeholder="Digite 3 ou mais letras do nome..."
                      className="text-sm react-select-container"
                      classNamePrefix="react-select"
                      value={
                        field.value
                          ? peoples.data?.data.peoples
                              .filter((p) => p.id === field.value)
                              .map((p) => ({
                                value: p.id,
                                label: p.nome,
                              }))[0] || null
                          : null
                      }
                      onChange={(option) => {
                        field.onChange(option ? option.value : null);
                      }}
                      onBlur={field.onBlur}
                      noOptionsMessage={({ inputValue }) =>
                        inputValue.length < 3
                          ? "Digite 3 ou mais caracteres para buscar"
                          : "Nenhum paciente encontrado"
                      }
                      loadingMessage={() => "Buscando pacientes..."}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="dataHora"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Data do Agendamento</FieldLabel>
                    <Popover>
                      <PopoverTrigger
                        render={
                          <Button
                            variant="outline"
                            className={cn(
                              "w-full justify-start text-left font-normal",
                              !field.value && "text-muted-foreground",
                              fieldState.invalid && "border-red-500",
                            )}
                          >
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {field.value ? (
                              format(new Date(field.value), "PPP HH:mm", {
                                locale: ptBR,
                              })
                            ) : (
                              <span>Selecione uma data</span>
                            )}
                          </Button>
                        }
                      />
                      <PopoverContent className="w-auto p-0" align="start">
                        <Calendar
                          mode="single"
                          selected={
                            field.value ? new Date(field.value) : undefined
                          }
                          onSelect={(date) => {
                            if (date) field.onChange(date.toISOString());
                          }}
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
                name="duracaoMin"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Duração (minutos)</FieldLabel>
                    <Input
                      type="number"
                      {...field}
                      onChange={(e) => field.onChange(Number(e.target.value))}
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
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Status</FieldLabel>
                    <select
                      {...field}
                      className="w-full h-9.5 px-3 text-sm bg-white border border-slate-300 rounded-md focus:outline-none"
                    >
                      <option value="agendado">Agendado</option>
                      <option value="confirmado">Confirmado</option>
                      <option value="cancelado">Cancelado</option>
                      <option value="finalizado">Finalizado</option>
                    </select>
                  </Field>
                )}
              />

              <Controller
                name="queixa_principal"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Motivos pela procura</FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Queixa ou detalhes extras..."
                    />
                  </Field>
                )}
              />
              <Controller
                name="observacao"
                control={form.control}
                render={({ field }) => (
                  <Field>
                    <FieldLabel>Observações / Anotações</FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Queixa ou detalhes extras..."
                    />
                  </Field>
                )}
              />
            </div>
          </FieldGroup>

          {errorMessage && (
            <p className="text-sm font-medium text-red-500 mt-2">
              {errorMessage}
            </p>
          )}

          <div className="flex justify-end gap-2 mt-6">
            <DialogClose
              render={
                <Button type="button" variant="outline" onClick={onClose}>
                  Cancelar
                </Button>
              }
            />
            <Button type="submit" disabled={isPending}>
              {isPending ? "Salvando..." : "Salvar Agendamento"}
            </Button>
          </div>
        </form>
        <AlertConfirm
          title={textAlert}
          description={descriptionAlert}
          isOpen={isAlertOpen}
          onClose={() => setIsAlertOpen(false)}
          onConfirm={actionConfirm}
        />
      </CardPage>
    </DialogForm>
  );
}
