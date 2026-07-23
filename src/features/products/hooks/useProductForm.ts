import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMemo } from "react";
import { productSchema, type ProductFormInput } from "../schema/product.schema";
import { useProductCreate } from "./useProductCreate";
import { useProductUpdate } from "./useProductUpdate";
import type { ProductFormHookProps } from "../types/product.type";

export function useProductForm(initialValues?: ProductFormHookProps) {
  const createMutation = useProductCreate();
  const updateMutation = useProductUpdate();

  const defaultValuesMapped = useMemo<ProductFormInput>(() => {
    if (!initialValues) {
      return {
        nome: "",
        sku: "",
        categoria: "",
        tipo: "servico",
        descricao: "",
        preco_custo: 0,
        margem_lucro: 0,
        preco_venda: 0,
        ativo: "ativo",
        quantidade_inicial: 0,
        estoque_minimo: null,
        estoque_maximo: null,
      };
    }

    const estoqueAtual = initialValues.estoque_itens?.[0];

    return {
      id: initialValues.id,
      nome: initialValues.nome,
      sku: initialValues.sku,
      categoria: initialValues.categoria,
      tipo: initialValues.tipo,
      descricao: initialValues.descricao ?? "",
      preco_custo: initialValues.preco_custo ?? 0,
      margem_lucro: initialValues.margem_lucro ?? 0,
      preco_venda: initialValues.preco_venda,
      ativo: initialValues.ativo,

      quantidade_inicial: estoqueAtual?.quantidade ?? 0,

      estoque_minimo: estoqueAtual?.minimo ?? null,
      estoque_maximo: estoqueAtual?.maximo ?? null,
    };
  }, [initialValues]);

  const form = useForm<ProductFormInput>({
    resolver: zodResolver(productSchema),
    defaultValues: defaultValuesMapped,
    values: defaultValuesMapped,
  });

  const errorMessage = useMemo(() => {
    const errors = form.formState.errors;
    const errorKeys = Object.keys(errors);

    if (errorKeys.length === 0) {
      return null;
    }

    const firstKey = errorKeys[0];
    const firstError = errors[firstKey as keyof typeof errors];

    return firstError?.message || null;
  }, [form.formState.errors]);

  const onSubmit = form.handleSubmit(async (values) => {
    try {
      if (initialValues?.id) {
        await updateMutation.mutateAsync({
          id: initialValues.id,
          ...values,
        });
      } else {
        await createMutation.mutateAsync(values);
        form.reset();
      }
    } catch (error) {
      console.error("Erro ao enviar o formulário:", error);
    }
  });

  return {
    form,
    onSubmit,
    isPending: createMutation.isPending || updateMutation.isPending,
    errorMessage,
  };
}
