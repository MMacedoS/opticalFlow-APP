import { useState } from "react";

import { SupplierCard } from "../components/SupplierCard";
import { SupplierForm } from "../components/SupplierForm";
import { useSuppliers } from "../hooks/useSuppliers";
import type { SupplierFilters } from "../types/supplier.type";

import { CardPage } from "@/components/cards/CardPage";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { Input } from "@/components/ui/input";

export function SupplierPage() {
  const [filters, setFilters] = useState<SupplierFilters>({
    page: 1,
    limit: 12,
    search: "",
  });

  const { data, isLoading, isError } = useSuppliers(filters);
  const suppliers = data?.data.fornecedores ?? [];
  const pagination = data?.data.pagination;

  return (
    <CardPage
      title="Fornecedores"
      description="Empresas que fornecem produtos para as compras"
      action={<SupplierForm />}
    >
      <Input
        type="search"
        placeholder="Buscar por razão social, nome fantasia, CNPJ ou e-mail..."
        value={filters.search}
        onChange={(event) =>
          setFilters((prev) => ({
            ...prev,
            search: event.target.value,
            page: 1,
          }))
        }
        className="mb-3 max-w-sm"
      />

      <div className="grid gap-4 rounded-lg bg-gray-50 p-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {isLoading && <p>Carregando fornecedores...</p>}
        {isError && <p>Erro ao carregar fornecedores.</p>}
        {!isLoading && !isError && suppliers.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum fornecedor encontrado.
          </p>
        )}
        {suppliers.map((supplier) => (
          <SupplierCard key={supplier.id} supplier={supplier} />
        ))}
      </div>

      {pagination && pagination.totalPages > 0 && (
        <div className="mt-4">
          <PaginationIconsOnly
            currentPage={pagination.page}
            currentLimit={pagination.limit}
            totalPages={pagination.totalPages}
            onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
            onLimitChange={(limit) =>
              setFilters((prev) => ({ ...prev, limit, page: 1 }))
            }
          />
        </div>
      )}
    </CardPage>
  );
}
