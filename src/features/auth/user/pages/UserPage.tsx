import { CardPage } from "@/components/cards/CardPage";
import { useState } from "react";
import { useUserList } from "../hooks/useUserList";
import { UserCard } from "../components/userCard";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { UserForm } from "../components/userForm";

export function UserPage() {
  const [filters, setFilters] = useState({
    page: 1,
    limit: 10,
    search: "",
  });

  const { data, isLoading, isError } = useUserList(filters);

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
    <CardPage
      title="Usuarios"
      description="Lista de usuarios cadastrados"
      action={<UserForm />}
      children={
        <>
          <div className="mb-2">
            <input
              type="text"
              placeholder="Filtrar usuarios..."
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

            {data?.data.users.map((item) => (
              <UserCard key={item.id} {...item} />
            ))}
          </div>

          <PaginationIconsOnly
            currentPage={filters.page}
            currentLimit={filters.limit}
            totalPages={paginationData?.pages ?? 1}
            onPageChange={handlePageChange}
            onLimitChange={handleLimitChange}
          />
        </>
      }
    />
  );
}
