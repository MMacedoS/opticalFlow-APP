import { useEffect, useMemo } from "react";
import { Controller, useFieldArray, useWatch } from "react-hook-form";
import { ClipboardList, Pencil, Plus, Trash2 } from "lucide-react";
import { DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { DialogForm } from "@/components/dialog/DialogForm";
import { CardPage } from "@/components/cards/CardPage";
import {
  Field,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field";
import { useCustomerList } from "@/features/customer/hooks/useCustomerList";
import { useActiveLaboratoryOptions } from "@/features/laboratory/hooks/useLaboratories";
import { useAppointmentsList } from "@/features/appointments/hooks/useAppointmentsList";
import { useProductsList } from "@/features/products/hooks/useProductsList";
import type { Product } from "@/features/products/types/product.type";
import { useServiceOrderForm } from "../hooks/useServiceOrderForm";
import type {
  ServiceOrderFormProps,
  ServiceOrderStatus,
} from "../types/service-order.type";

const STATUS_OPTIONS: Array<{ value: ServiceOrderStatus; label: string }> = [
  { value: "aberta", label: "Aberta" },
  { value: "orcamento", label: "Orçamento" },
  { value: "faturada", label: "Faturada" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
];

function formatDateTimeLocal(value?: string | null) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  const offset = date.getTimezoneOffset();
  const adjustedDate = new Date(date.getTime() - offset * 60 * 1000);

  return adjustedDate.toISOString().slice(0, 16);
}

function toIsoString(value: string) {
  if (!value) return "";

  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";

  return date.toISOString();
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
  }).format(value || 0);
}

function getAppointmentLabel(appointment: {
  id: string;
  paciente?: { nome?: string } | null;
  dataAtendimento?: string;
}) {
  const patient = appointment.paciente?.nome ?? "Paciente";
  const date = appointment.dataAtendimento
    ? new Date(appointment.dataAtendimento).toLocaleDateString("pt-BR")
    : "sem data";

  return `${patient} - ${date}`;
}

export function ServiceOrderForm({
  initialValues,
  triggerLabel,
}: ServiceOrderFormProps) {
  const { form, onSubmit, isPending, errorMessage, isEditing } =
    useServiceOrderForm(initialValues);

  const customerList = useCustomerList({ page: 1, limit: 1000, search: "" });
  const { options: laboratoryOptions } = useActiveLaboratoryOptions();
  const appointmentsList = useAppointmentsList({ limit: 1000, search: "" });
  const productsList = useProductsList({ limit: 1000, search: "" });

  const products = productsList.data?.data?.products ?? [];
  const items = useWatch({
    control: form.control,
    name: "itens",
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "itens",
  });

  const total = useMemo(
    () =>
      (items ?? []).reduce((acc, item) => {
        const quantity = Number(item?.quantidade) || 0;
        const unitValue = Number(item?.valor_unitario) || 0;
        const discount = Number(item?.desconto) || 0;

        return acc + Math.max(0, quantity * unitValue - discount);
      }, 0),
    [items],
  );

  useEffect(() => {
    if (!fields.length) {
      append({
        id: undefined,
        produtoId: "",
        descricao_servico: "",
        quantidade: 1,
        valor_unitario: 0,
        desconto: 0,
      });
    }
  }, [append, fields.length]);

  const dialogTriggerLabel =
    triggerLabel || (isEditing ? "Editar Ordem" : "Nova Ordem de Serviço");

  return (
    <DialogForm
      title={dialogTriggerLabel}
      icon={isEditing ? Pencil : ClipboardList}
      variant={isEditing ? "outline" : "default"}
      width="max-w-6xl!"
    >
      <CardPage
        title={isEditing ? "Editar Ordem de Serviço" : "Nova Ordem de Serviço"}
        description="Preencha os dados da ordem de serviço e, se necessário, vincule itens."
      >
        <form id="form-service-order" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              <Controller
                name="numero"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Número</FieldLabel>
                    <Input
                      {...field}
                      value={field.value || ""}
                      placeholder="Ex.: OS-0001"
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
                    <FieldLabel>Status</FieldLabel>
                    <select
                      {...field}
                      className="border rounded-xl p-2 text-sm bg-background"
                    >
                      {STATUS_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="laboratorioId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Laboratório</FieldLabel>
                    <select
                      {...field}
                      value={field.value || ""}
                      className="border rounded-xl p-2 text-sm bg-background"
                    >
                      <option value="">Sem laboratório</option>
                      {field.value &&
                        !laboratoryOptions.some(
                          (option) => option.value === field.value,
                        ) && (
                          <option value={field.value}>
                            Laboratório atual (inativo)
                          </option>
                        )}
                      {laboratoryOptions.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="clienteId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Cliente</FieldLabel>
                    <select
                      {...field}
                      value={field.value || ""}
                      className="border rounded-xl p-2 text-sm bg-background"
                    >
                      <option value="">Sem cliente vinculado</option>
                      {customerList.data?.data?.customers.map((customer) => (
                        <option key={customer.id} value={customer.id}>
                          {customer.pessoa.nome}
                        </option>
                      ))}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="atendimentoId"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Atendimento</FieldLabel>
                    <select
                      {...field}
                      value={field.value || ""}
                      className="border rounded-xl p-2 text-sm bg-background"
                    >
                      <option value="">Sem atendimento vinculado</option>
                      {appointmentsList.data?.data?.appointments.map(
                        (appointment) => (
                          <option key={appointment.id} value={appointment.id}>
                            {getAppointmentLabel(appointment)}
                          </option>
                        ),
                      )}
                    </select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="previsao_entrega"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Previsão de entrega</FieldLabel>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeLocal(field.value)}
                      onChange={(event) =>
                        field.onChange(toIsoString(event.target.value))
                      }
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="data_entrega"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Data de entrega</FieldLabel>
                    <Input
                      type="datetime-local"
                      value={formatDateTimeLocal(field.value)}
                      onChange={(event) =>
                        field.onChange(toIsoString(event.target.value))
                      }
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

          <Controller
            name="descricao"
            control={form.control}
            render={({ field, fieldState }) => (
              <Field data-invalid={fieldState.invalid}>
                <FieldLabel>Descrição</FieldLabel>
                <Textarea
                  {...field}
                  value={field.value || ""}
                  placeholder="Descreva o serviço solicitado, observações ou contexto da ordem."
                />
                {fieldState.invalid && (
                  <FieldError errors={[fieldState.error]} />
                )}
              </Field>
            )}
          />

          <Separator className="my-4" />

          <div className="space-y-4">
            <div className="flex items-center justify-between gap-2">
              <div>
                <h3 className="text-sm font-semibold">Itens da ordem</h3>
                <p className="text-xs text-muted-foreground">
                  Adicione, remova ou ajuste produtos e serviços da ordem.
                </p>
              </div>

              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() =>
                  append({
                    id: undefined,
                    produtoId: "",
                    descricao_servico: "",
                    quantidade: 1,
                    valor_unitario: 0,
                    desconto: 0,
                  })
                }
              >
                <Plus className="mr-2 h-4 w-4" />
                Adicionar item
              </Button>
            </div>

            {fields.map((field, index) => {
              const selectedProductId = form.watch(`itens.${index}.produtoId`);
              const selectedProduct = products.find(
                (product) => product.id === selectedProductId,
              ) as Product | undefined;

              return (
                <div
                  key={field.id}
                  className="rounded-2xl border border-border/70 p-4"
                >
                  <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
                    <Controller
                      name={`itens.${index}.produtoId`}
                      control={form.control}
                      render={({ field: itemField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Produto</FieldLabel>
                          <select
                            {...itemField}
                            value={itemField.value || ""}
                            className="border rounded-xl p-2 text-sm bg-background"
                            onChange={(event) => {
                              const nextValue = event.target.value;
                              itemField.onChange(nextValue);

                              const selected = products.find(
                                (product) => product.id === nextValue,
                              );

                              if (selected) {
                                form.setValue(
                                  `itens.${index}.descricao_servico`,
                                  form.getValues(
                                    `itens.${index}.descricao_servico`,
                                  ) || selected.nome,
                                );

                                if (
                                  !form.getValues(
                                    `itens.${index}.valor_unitario`,
                                  )
                                ) {
                                  form.setValue(
                                    `itens.${index}.valor_unitario`,
                                    selected.preco_venda,
                                  );
                                }
                              }
                            }}
                          >
                            <option value="">Serviço sem produto</option>
                            {products.map((product) => (
                              <option key={product.id} value={product.id}>
                                {product.nome}
                              </option>
                            ))}
                          </select>
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`itens.${index}.descricao_servico`}
                      control={form.control}
                      render={({ field: itemField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Descrição do serviço</FieldLabel>
                          <Input
                            {...itemField}
                            value={itemField.value || ""}
                            placeholder="Ex.: Ajuste, conserto, exame"
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`itens.${index}.quantidade`}
                      control={form.control}
                      render={({ field: itemField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Quantidade</FieldLabel>
                          <Input
                            type="number"
                            min="0.000001"
                            step="0.01"
                            value={itemField.value}
                            onChange={(event) =>
                              itemField.onChange(Number(event.target.value))
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`itens.${index}.valor_unitario`}
                      control={form.control}
                      render={({ field: itemField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Valor unitário</FieldLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={itemField.value}
                            onChange={(event) =>
                              itemField.onChange(Number(event.target.value))
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />

                    <Controller
                      name={`itens.${index}.desconto`}
                      control={form.control}
                      render={({ field: itemField, fieldState }) => (
                        <Field data-invalid={fieldState.invalid}>
                          <FieldLabel>Desconto</FieldLabel>
                          <Input
                            type="number"
                            min="0"
                            step="0.01"
                            value={itemField.value}
                            onChange={(event) =>
                              itemField.onChange(Number(event.target.value))
                            }
                          />
                          {fieldState.invalid && (
                            <FieldError errors={[fieldState.error]} />
                          )}
                        </Field>
                      )}
                    />
                  </div>

                  <div className="mt-3 flex items-center justify-between gap-2">
                    <p className="text-xs text-muted-foreground">
                      Subtotal:{" "}
                      <span className="font-medium text-foreground">
                        {formatCurrency(
                          Math.max(
                            0,
                            (Number(form.watch(`itens.${index}.quantidade`)) ||
                              0) *
                              (Number(
                                form.watch(`itens.${index}.valor_unitario`),
                              ) || 0) -
                              (Number(form.watch(`itens.${index}.desconto`)) ||
                                0),
                          ),
                        )}
                      </span>
                      {selectedProduct ? ` - ${selectedProduct.nome}` : ""}
                    </p>

                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => remove(index)}
                    >
                      <Trash2 className="mr-2 h-4 w-4" />
                      Remover
                    </Button>
                  </div>
                </div>
              );
            })}

            {!fields.length && (
              <p className="text-sm text-muted-foreground">
                Nenhum item adicionado à ordem de serviço.
              </p>
            )}
          </div>

          <Separator className="my-4" />

          <div className="flex items-center justify-between gap-2 rounded-2xl bg-muted/50 p-4">
            <div>
              <p className="text-sm font-medium">Total estimado</p>
              <p className="text-xs text-muted-foreground">
                Calculado a partir da quantidade, valor unitário e desconto dos
                itens.
              </p>
            </div>
            <p className="text-lg font-semibold">{formatCurrency(total)}</p>
          </div>
        </form>

        {errorMessage && (
          <p className="mt-3 text-sm text-destructive">{errorMessage}</p>
        )}

        <div className="mt-4 flex justify-end gap-2">
          <DialogClose
            render={
              <Button
                variant="ghost"
                size="sm"
                type="button"
                disabled={isPending}
                onClick={() => form.reset()}
              >
                Fechar
              </Button>
            }
          />
          <Button
            type="submit"
            form="form-service-order"
            size="sm"
            disabled={isPending}
            className="bg-primary/80 text-white hover:bg-primary/90 hover:text-primary-foreground"
          >
            {isPending ? "Salvando..." : "Salvar"}
          </Button>
        </div>
      </CardPage>
    </DialogForm>
  );
}
