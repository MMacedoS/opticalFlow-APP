import { useState } from "react";
import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import { Field, FieldLabel, FieldError } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { ChevronsUpDown, Plus, Pencil, Trash2, Check, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAutoFillAddress } from "../../features/company/hooks/useAutoFillAddress";
import type { Endereco } from "@/types/person.type";
import { addressSchema } from "@/schema/address.schema";

type ShippingAddressProp = {
  data?: Endereco[];
  onChange?: (data: Endereco[]) => void;
  className?: string;
};

type AddressFormValues = z.infer<typeof addressSchema>;

const DEFAULT_FORM_VALUES = {
  id: undefined,
  logradouro: "",
  numero: "",
  bairro: "",
  cidade: "",
  uf: "",
  cep: "",
  pais: "Brasil",
};

export function AddressForm({
  data = [],
  onChange,
  className,
}: ShippingAddressProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<AddressFormValues>({
    resolver: zodResolver(addressSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const cepValue = useWatch({
    control: form.control,
    name: "cep",
  });

  useAutoFillAddress(cepValue, form.setValue);

  const handleSaveAddress = (values: AddressFormValues) => {
    const updatedList: Endereco[] =
      editingIndex !== null
        ? data.map((item, index) =>
            index === editingIndex
              ? ({ ...values, id: item.id } as Endereco)
              : item,
          )
        : [...data, { ...values } as Endereco];

    onChange?.(updatedList);

    if (editingIndex !== null) {
      setEditingIndex(null);
    }

    form.reset(DEFAULT_FORM_VALUES);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const address = data[index];
    form.reset({
      ...address,
      id: address.id?.toString(),
    });
    setIsOpen(true);
  };

  const handleDelete = (index: number) => {
    const updatedList = data.filter((_, i) => i !== index);
    onChange?.(updatedList);

    if (editingIndex === index) {
      setEditingIndex(null);
      form.reset(DEFAULT_FORM_VALUES);
    }
  };

  const handleCancelEdit = () => {
    setEditingIndex(null);
    form.reset(DEFAULT_FORM_VALUES);
  };

  return (
    <Collapsible open={isOpen} onOpenChange={setIsOpen} className={className}>
      {/* Cabeçalho */}
      <div className="flex items-center justify-between gap-4 border-b pb-2 mb-4">
        <div>
          <h4 className="text-sm font-semibold">Endereços</h4>
          <p className="text-xs text-muted-foreground">
            {data.length}{" "}
            {data.length === 1
              ? "endereço cadastrado"
              : "endereços cadastrados"}
          </p>
        </div>
        <CollapsibleTrigger
          render={(props) => (
            <Button variant="ghost" size="icon" className="size-8" {...props}>
              <ChevronsUpDown className="size-4" />
            </Button>
          )}
        />
      </div>

      <CollapsibleContent className="space-y-4 bg-muted/40 p-4 rounded-xl border mb-4">
        <div className="space-y-3">
          <p className="text-xs font-bold text-primary uppercase tracking-wider">
            {editingIndex !== null ? "Editando Endereço" : "Novo Endereço"}
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-2">
            <Controller
              name="cep"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">CEP</FieldLabel>
                  <Input {...field} placeholder="00000-000" maxLength={8} />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="logradouro"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">Logradouro</FieldLabel>
                  <Input {...field} placeholder="Rua, Av..." />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="numero"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">Número</FieldLabel>
                  <Input {...field} placeholder="123" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="bairro"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">Bairro</FieldLabel>
                  <Input {...field} placeholder="Bairro" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="cidade"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">Cidade</FieldLabel>
                  <Input {...field} placeholder="Cidade" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
            <Controller
              name="uf"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">UF</FieldLabel>
                  <Input {...field} maxLength={2} placeholder="SP" />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            {editingIndex !== null && (
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelEdit}
              >
                <X className="size-4 mr-1" /> Cancelar
              </Button>
            )}

            <Button
              type="button"
              onClick={form.handleSubmit(handleSaveAddress)}
            >
              {editingIndex !== null ? (
                <>
                  <Check className="size-4 mr-1" /> Salvar Alteração
                </>
              ) : (
                <>
                  <Plus className="size-4 mr-1" /> Adicionar
                </>
              )}
            </Button>
          </div>
        </div>
      </CollapsibleContent>

      <div className="space-y-2">
        {data.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-4 border border-dashed rounded-lg">
            Nenhum endereço adicionado ainda.
          </p>
        ) : (
          data.map((item, index) => (
            <div
              key={item.id ?? index}
              className={`flex items-center justify-between rounded-xl border p-3 text-sm transition-colors ${
                editingIndex === index
                  ? "bg-primary/5 border-primary/50"
                  : "bg-card hover:bg-muted/30"
              }`}
            >
              <div className="space-y-0.5 pr-4">
                <p className="font-medium text-foreground">
                  {item.logradouro}, {item.numero}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.bairro && `${item.bairro}, `} {item.cidade} - {item.uf}{" "}
                  | CEP: {item.cep}
                  {item.complemento && ` (${item.complemento})`}
                </p>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-muted-foreground hover:text-foreground"
                  onClick={() => handleEdit(index)}
                  disabled={editingIndex !== null && editingIndex !== index}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="size-8 text-destructive hover:text-destructive/80"
                  onClick={() => handleDelete(index)}
                  disabled={editingIndex !== null && editingIndex !== index}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </div>
            </div>
          ))
        )}
      </div>
    </Collapsible>
  );
}
