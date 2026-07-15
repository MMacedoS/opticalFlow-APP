import { CardPage } from "@/components/cards/CardPage";
import { useState } from "react";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { useEmployeesList } from "../hooks/useEmployeeList";
import { EmployeeForm } from "../components/EmployeeForm";
import { EmployeeCard } from "../components/EmployeeCard";
import { useAuthStore } from "@/stores/auth.store";

export function EmployeePage() {
  const session = useAuthStore((state) => state.session);
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isError } = useEmployeesList(filters);

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
  const branches = data?.data?.employees || [];

  return (
    <>
      <CardPage
        title="Funcionarios"
        description="Lista de funcionarios cadastradas"
        action={<EmployeeForm />}
        children={
          <>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Filtrar funcionarios..."
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
              {isLoading && <p>Carregando clientes...</p>}
              {isError && <p>Erro ao carregar dados do servidor.</p>}

              {branches.map(
                (item) =>
                  session?.usuario?.pessoaId !== item.pessoa.id && (
                    <EmployeeCard key={item.id} {...item} />
                  ),
              )}
            </div>

            {paginationData && (
              <div className="mt-4">
                <PaginationIconsOnly
                  currentPage={paginationData.page}
                  currentLimit={paginationData.limit}
                  totalPages={paginationData.totalPages}
                  onPageChange={handlePageChange}
                  onLimitChange={handleLimitChange}
                />
              </div>
            )}
          </>
        }
      />
    </>
  );
}
