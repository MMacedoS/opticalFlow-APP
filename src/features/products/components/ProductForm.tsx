import { DialogForm } from "@/components/dialog/DialogForm";
import { Package, Pencil } from "lucide-react";
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
import type { ProductProps } from "../types/product.type";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DialogClose } from "@/components/ui/dialog";
import { useProductForm } from "../hooks/useProductForm";
import { formatCurrencyDisplay, parseCurrencyInput } from "@/utils/masks";
import { useState } from "react";

export function ProductForm({ initialValues }: ProductProps) {
  const { form, onSubmit, isPending, errorMessage } =
    useProductForm(initialValues);

  const isEditing = !!initialValues;

  const [margemLucro, setMargemLucro] = useState<number>(() => {
    const custo = form.getValues("preco_custo") || 0;
    const venda = form.getValues("preco_venda") || 0;

    if (custo > 0 && venda > 0 && venda > custo) {
      return Math.round(((venda - custo) / venda) * 100);
    }
    return 0;
  });

  const currentTipo = form.watch("tipo");

  return (
    <DialogForm
      title={isEditing ? "Editar Item" : "Cadastrar Item"}
      icon={isEditing ? Pencil : Package}
    >
      <CardPage
        title={
          isEditing ? "Editar Produto / Serviço" : "Cadastrar Produto / Serviço"
        }
        description="Preencha os dados do catálogo de itens abaixo"
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
              form="form-Product"
              variant="outline"
              size="sm"
              disabled={isPending}
              className="bg-primary/80 text-white hover:bg-primary/90 hover:text-primary-foreground"
            >
              {isPending ? "Salvando..." : "Salvar"}
            </Button>
          </>
        }
      >
        <form id="form-Product" onSubmit={onSubmit} noValidate>
          <FieldGroup>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              <Controller
                name="nome"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Nome do Item / Serviço</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Ex: Consulta, Lente HD, Armação..."
                      onChange={(e) => {
                        field.onChange(e.target.value);

                        if (!isEditing) {
                          const skuGerado = e.target.value
                            .toUpperCase()
                            .normalize("NFD")
                            .replace(/[\u0300-\u036f]/g, "")
                            .replace(/[^A-Z0-9\s]/g, "")
                            .trim()
                            .split(/\s+/)
                            .map((palavra) => palavra.substring(0, 3))
                            .join("-")
                            .substring(0, 15);

                          form.setValue("sku", skuGerado, {
                            shouldValidate: true,
                          });
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="sku"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Código / SKU</FieldLabel>
                    <Input
                      {...field}
                      placeholder="Ex: CON-001, LNT-404"
                      onChange={(e) => {
                        field.onChange(
                          e.target.value.toUpperCase().replace(/\s/g, "-"),
                        );
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="categoria"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Categoria</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione uma categoria..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Clinico">
                          Clínico / Consultas
                        </SelectItem>
                        <SelectItem value="Lentes de Grau">
                          Lentes de Grau
                        </SelectItem>
                        <SelectItem value="Armacoes">Armações</SelectItem>
                        <SelectItem value="Acessorios">Acessórios</SelectItem>
                        <SelectItem value="Exames">
                          Exames Especializados
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="tipo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Tipo de Item</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="servico">
                          Serviço (Consulta/Exame)
                        </SelectItem>
                        <SelectItem value="armacao">Armação</SelectItem>
                        <SelectItem value="lente">Lente</SelectItem>
                        <SelectItem value="acesssorio">Acessório</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="preco_custo"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Preço de Custo</FieldLabel>
                    <Input
                      type="text"
                      placeholder="R$ 0,00"
                      value={formatCurrencyDisplay(field.value)}
                      onChange={(e) => {
                        const novoCusto = parseCurrencyInput(e.target.value);
                        field.onChange(novoCusto);

                        if (margemLucro > 0 && margemLucro < 100) {
                          const novoPrecoVenda =
                            novoCusto / (1 - margemLucro / 100);
                          form.setValue(
                            "preco_venda",
                            Math.round(novoPrecoVenda * 100) / 100,
                            { shouldValidate: true },
                          );
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="margem_lucro"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Margem de Lucro (%)</FieldLabel>
                    <Input
                      type="number"
                      placeholder="0%"
                      min="0"
                      max="99.9"
                      value={field.value ?? ""}
                      onChange={(e) => {
                        const novaMargem = Math.min(
                          99.9,
                          Math.max(0, parseFloat(e.target.value) || 0),
                        );
                        field.onChange(novaMargem);

                        const custoAtual = form.getValues("preco_custo") || 0;

                        if (custoAtual > 0) {
                          const novoPrecoVenda =
                            custoAtual / (1 - novaMargem / 100);
                          form.setValue(
                            "preco_venda",
                            Math.round(novoPrecoVenda * 100) / 100,
                            { shouldValidate: true },
                          );
                        }
                      }}
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />

              <Controller
                name="preco_venda"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Preço de Venda</FieldLabel>
                    <Input
                      type="text"
                      placeholder="R$ 0,00"
                      value={formatCurrencyDisplay(field.value)}
                      onChange={(e) => {
                        const novoPrecoVenda = parseCurrencyInput(
                          e.target.value,
                        );
                        field.onChange(novoPrecoVenda);

                        const custoAtual = form.getValues("preco_custo") || 0;
                        if (custoAtual > 0 && novoPrecoVenda > custoAtual) {
                          const novaMargemCalculada =
                            ((novoPrecoVenda - custoAtual) / novoPrecoVenda) *
                            100;
                          setMargemLucro(Math.round(novaMargemCalculada));
                        }
                      }}
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
                    <FieldLabel>Status Comercial</FieldLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione..." />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ativo">Ativo</SelectItem>
                        <SelectItem value="inativo">Inativo</SelectItem>
                      </SelectContent>
                    </Select>
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
            </div>

            <div className="mt-1">
              {currentTipo && currentTipo !== "servico" && (
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4 p-3 bg-slate-50 border border-slate-200 rounded-lg animate-in fade-in duration-200 col-span-1 md:col-span-2">
                  {/* 8. CONTROLLER: quantidade_inicial */}
                  <Controller
                    name="quantidade_inicial"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Qtd. Inicial</FieldLabel>
                        <Input
                          type="number"
                          placeholder="0"
                          disabled={isEditing} // Trava o campo se for edição
                          value={field.value ?? 0}
                          onChange={(e) =>
                            field.onChange(e.target.valueAsNumber || 0)
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* 9. CONTROLLER: estoque_minimo */}
                  <Controller
                    name="estoque_minimo"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Estoque Mínimo</FieldLabel>
                        <Input
                          type="number"
                          placeholder="Mínimo"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              isNaN(e.target.valueAsNumber)
                                ? null
                                : e.target.valueAsNumber,
                            )
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />

                  {/* 10. CONTROLLER: estoque_maximo */}
                  <Controller
                    name="estoque_maximo"
                    control={form.control}
                    render={({ field, fieldState }) => (
                      <Field data-invalid={fieldState.invalid}>
                        <FieldLabel>Estoque Máximo</FieldLabel>
                        <Input
                          type="number"
                          placeholder="Máximo"
                          value={field.value ?? ""}
                          onChange={(e) =>
                            field.onChange(
                              isNaN(e.target.valueAsNumber)
                                ? null
                                : e.target.valueAsNumber,
                            )
                          }
                        />
                        {fieldState.invalid && (
                          <FieldError errors={[fieldState.error]} />
                        )}
                      </Field>
                    )}
                  />
                </div>
              )}
            </div>
            <div className="mt-3 col-span-1 md:col-span-2">
              <Controller
                name="descricao"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>Descrição Detalhada</FieldLabel>
                    <Input
                      {...field}
                      value={field.value ?? ""}
                      placeholder="Informações adicionais sobre o produto ou serviço..."
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
        </form>
      </CardPage>

      {errorMessage && (
        <p className="text-sm text-destructive mt-2 text-center">
          {errorMessage}
        </p>
      )}
    </DialogForm>
  );
}
