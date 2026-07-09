import { CardPage } from "@/components/cards/CardPage";
import { useState } from "react";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { useCustomerList } from "../hooks/useCustomerList";
import { CustomerForm } from "../components/CustomerForm";
import { CustomerCard } from "../components/CustomerCard";

export function CustomerPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isError } = useCustomerList(filters);

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
  const branches = data?.data?.customers || [];

  return (
    <>
      <CardPage
        title="Clientes"
        description="Lista de clientes cadastradas"
        action={<CustomerForm />}
        children={
          <>
            <div className="mb-2">
              <input
                type="text"
                placeholder="Filtrar clientes..."
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

              {branches.map((item) => (
                <CustomerCard key={item.id} {...item} />
              ))}
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
