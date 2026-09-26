import { useState } from "react";

import { LaboratoryCard } from "../components/LaboratoryCard";
import { LaboratoryForm } from "../components/LaboratoryForm";
import { useLaboratories } from "../hooks/useLaboratories";
import type { LaboratoryFilters } from "../types/laboratory.type";

import { CardPage } from "@/components/cards/CardPage";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { Input } from "@/components/ui/input";

export function LaboratoryPage() {
  const [filters, setFilters] = useState<LaboratoryFilters>({
    page: 1,
    limit: 12,
    search: "",
  });

  const { data, isLoading, isError } = useLaboratories(filters);
  const laboratories = data?.data.laboratorios ?? [];
  const pagination = data?.data.pagination;

  return (
    <CardPage
      title="Laboratórios"
      description="Laboratórios parceiros que recebem as ordens de serviço"
      action={<LaboratoryForm />}
    >
      <Input
        type="search"
        placeholder="Buscar por nome, CNPJ, e-mail ou telefone..."
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
        {isLoading && <p>Carregando laboratórios...</p>}
        {isError && <p>Erro ao carregar laboratórios.</p>}
        {!isLoading && !isError && laboratories.length === 0 && (
          <p className="text-sm text-muted-foreground">
            Nenhum laboratório encontrado.
          </p>
        )}
        {laboratories.map((laboratory) => (
          <LaboratoryCard key={laboratory.id} laboratory={laboratory} />
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
