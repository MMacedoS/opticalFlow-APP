import { useState } from "react";
import { useForm, Controller } from "react-hook-form";
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
import type { Contato } from "../types/company.types";
import { contactSchema } from "../schema/company.schema";
import {
  Select,
  SelectItem,
  SelectTrigger,
  SelectValue,
  SelectContent,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { maskPhone } from "@/utils/masks";

type ContactProp = {
  data?: Contato[];
  onChange?: (data: Contato[]) => void;
  className?: string;
};

type ContactFormValues = z.infer<typeof contactSchema>;

const DEFAULT_FORM_VALUES = {
  id: undefined,
  tipo: "whatsapp" as const,
  contato: "",
  principal: false, // Adicionado para garantir o estado inicial do Switch
};

export function ContactForm({ data = [], onChange, className }: ContactProp) {
  const [isOpen, setIsOpen] = useState(false);
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactSchema),
    defaultValues: DEFAULT_FORM_VALUES,
  });

  const handleSaveContact = (values: ContactFormValues) => {
    const updatedList: Contato[] =
      editingIndex !== null
        ? data.map((item, index) =>
            index === editingIndex
              ? ({ ...values, id: item.id } as Contato)
              : item,
          )
        : [
            ...data,
            {
              ...values,
            } as Contato,
          ];

    onChange?.(updatedList);

    if (editingIndex !== null) {
      setEditingIndex(null);
    }

    form.reset(DEFAULT_FORM_VALUES);
  };

  const handleEdit = (index: number) => {
    setEditingIndex(index);
    const contact = data[index];
    form.reset({
      ...contact,
      id: contact.id?.toString(),
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
          <h4 className="text-sm font-semibold">Contato</h4>
          <p className="text-xs text-muted-foreground">
            {data.length}{" "}
            {data.length === 1 ? "contato cadastrado" : "contatos cadastrados"}
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
            {editingIndex !== null ? "Editando Contato" : "Novo Contato"}
          </p>

          <div className="grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <Controller
              name="tipo"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">Tipo</FieldLabel>
                  <Select onValueChange={field.onChange} value={field.value}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione..." />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                    </SelectContent>
                  </Select>
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="contato"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                  <FieldLabel className="text-xs">Número</FieldLabel>
                  <Input
                    {...field}
                    value={maskPhone(field.value || "")}
                    onChange={(e) => field.onChange(maskPhone(e.target.value))}
                    placeholder="(00) 00000-0000"
                    maxLength={15}
                  />
                  {fieldState.invalid && (
                    <FieldError errors={[fieldState.error]} />
                  )}
                </Field>
              )}
            />

            <Controller
              name="principal"
              control={form.control}
              render={({ field, fieldState }) => (
                <Field
                  data-invalid={fieldState.invalid}
                  className="flex flex-col justify-center"
                >
                  <div className="flex items-center gap-2 mt-4">
                    <Switch
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                    <FieldLabel className="text-xs m-0">
                      Contato Principal
                    </FieldLabel>
                  </div>
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
              onClick={form.handleSubmit(handleSaveContact)}
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
            Nenhum contato adicionado ainda.
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
                <p className="font-medium text-foreground capitalize">
                  {item.tipo}: {item.contato}
                  {item.principal && (
                    <span className="ml-2 text-[10px] bg-primary/10 text-primary px-2 py-0.5 rounded-full font-semibold uppercase">
                      Principal
                    </span>
                  )}
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
