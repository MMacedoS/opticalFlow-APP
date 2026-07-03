import { Button } from "@/components/ui/button";
import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { CompanyCard } from "../components/CompanyCard";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { useCompanyList } from "../hooks/useCompanyList";
import { useState } from "react";

export function CompanyPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isError } = useCompanyList(filters);

  const handleLimitChange = (newLimit: number) => {
    setFilters((prev) => ({
      ...prev,
      limit: newLimit,
      page: 1,
    }));
  };

  const handlePageChange = (newPage: number) => {
    setFilters((prev) => ({ ...prev, page: newPage }));
  };

  const paginationData = data?.data?.pagination;

  return (
    <Card className="rounded-4xl border border-border/70 bg-card/95 shadow-lg">
      <CardHeader>
        <CardTitle>Empresas</CardTitle>
        <CardDescription>Lista de empresas cadastradas</CardDescription>
        <CardAction>
          <Button variant="default" size="sm">
            <Building2 />
            <span>Cadastar</span>
          </Button>
        </CardAction>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Input de Busca Opcional */}
        <div className="mb-2">
          <input
            type="text"
            placeholder="Filtrar empresas..."
            value={filters.search}
            onChange={(e) =>
              setFilters((prev) => ({
                ...prev,
                search: e.target.value,
                page: 1,
              }))
            }
            className="border p-2 rounded-lg text-sm max-w-xs w-full"
          />
        </div>

        <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 bg-gray-50 p-4 rounded-lg">
          {isLoading && <p>Carregando empresas...</p>}
          {isError && <p>Erro ao carregar dados do servidor.</p>}

          {data?.data.companies.map((item) => (
            <CompanyCard key={item.id} {...item} />
          ))}
        </div>

        <PaginationIconsOnly
          currentPage={filters.page}
          currentLimit={filters.limit}
          totalPages={paginationData?.pages ?? 1}
          onPageChange={handlePageChange}
          onLimitChange={handleLimitChange}
        />
      </CardContent>
    </Card>
  );
}
