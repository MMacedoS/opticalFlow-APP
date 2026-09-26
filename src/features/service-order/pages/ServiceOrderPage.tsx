import { useState } from "react";
import { Button } from "@/components/ui/button";
import { CardPage } from "@/components/cards/CardPage";
import { PaginationIconsOnly } from "@/components/paginationOnly/PaginationIconsOnly";
import { useCustomerList } from "@/features/customer/hooks/useCustomerList";
import { useAppointmentsList } from "@/features/appointments/hooks/useAppointmentsList";
import { useActiveLaboratoryOptions } from "@/features/laboratory/hooks/useLaboratories";
import { ServiceOrderCard } from "../components/ServiceOrderCard";
import { ServiceOrderForm } from "../components/ServiceOrderForm";
import { useServiceOrders } from "../hooks/useServiceOrders";
import type {
  ServiceOrderFilters,
  ServiceOrderStatus,
} from "../types/service-order.type";

const STATUS_OPTIONS: Array<{ value: ServiceOrderStatus; label: string }> = [
  { value: "aberta", label: "Aberta" },
  { value: "orcamento", label: "Orçamento" },
  { value: "faturada", label: "Faturada" },
  { value: "finalizada", label: "Finalizada" },
  { value: "cancelada", label: "Cancelada" },
];

const DEFAULT_FILTERS: ServiceOrderFilters = {
  page: 1,
  limit: 10,
  search: "",
  clienteId: "",
  atendimentoId: "",
  laboratorioId: "",
  status: undefined,
  dataInicio: "",
  dataFim: "",
};

function normalizeFilters(filters: ServiceOrderFilters): ServiceOrderFilters {
  return {
    page: filters.page,
    limit: filters.limit,
    search: filters.search || undefined,
    clienteId: filters.clienteId || undefined,
    atendimentoId: filters.atendimentoId || undefined,
    laboratorioId: filters.laboratorioId || undefined,
    status: filters.status || undefined,
    dataInicio: filters.dataInicio || undefined,
    dataFim: filters.dataFim || undefined,
  };
}

function getAppointmentLabel(appointment: {
  id: string;
  paciente?: { nome?: string } | null;
  dataAtendimento?: string;
}) {
  const patient = appointment.paciente?.nome ?? "Paciente";
  const date = appointment.dataAtendimento
    ? new Date(appointment.dataAtendimento).toLocaleDateString("pt-BR")
    : "sem data";

  return `${patient} - ${date}`;
}

export function ServiceOrderPage() {
  const [filters, setFilters] = useState<ServiceOrderFilters>(DEFAULT_FILTERS);

  const { data, isLoading, isError } = useServiceOrders(
    normalizeFilters(filters),
  );
  const customerList = useCustomerList({ page: 1, limit: 1000, search: "" });
  const { options: laboratoryOptions } = useActiveLaboratoryOptions();
  const appointmentsList = useAppointmentsList({ limit: 1000, search: "" });

  const paginationData = data?.data?.pagination;
  const serviceOrders = data?.data?.orders || [];

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

  const clearFilters = () => {
    setFilters(DEFAULT_FILTERS);
  };

  return (
    <CardPage
      title="Ordens de Serviço"
      description="Gerencie ordens de serviço da filial logada, com filtros por cliente, atendimento, status e período."
      action={<ServiceOrderForm triggerLabel="Nova Ordem de Serviço" />}
    >
      <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
        <input
          type="text"
          placeholder="Buscar por número, descrição, cliente, laboratório ou paciente..."
          value={filters.search || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              search: event.target.value,
              page: 1,
            }))
          }
          className="border p-2 rounded-lg text-sm w-full"
        />

        <select
          value={filters.status || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              status: (event.target.value || undefined) as
                ServiceOrderStatus | undefined,
              page: 1,
            }))
          }
          className="border rounded-lg p-2 text-sm bg-background"
        >
          <option value="">Todos os status</option>
          {STATUS_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <select
          value={filters.clienteId || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              clienteId: event.target.value,
              page: 1,
            }))
          }
          className="border rounded-lg p-2 text-sm bg-background"
        >
          <option value="">Todos os clientes</option>
          {customerList.data?.data?.customers.map((customer) => (
            <option key={customer.id} value={customer.id}>
              {customer.pessoa.nome}
            </option>
          ))}
        </select>

        <select
          value={filters.atendimentoId || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              atendimentoId: event.target.value,
              page: 1,
            }))
          }
          className="border rounded-lg p-2 text-sm bg-background"
        >
          <option value="">Todos os atendimentos</option>
          {appointmentsList.data?.data?.appointments.map((appointment) => (
            <option key={appointment.id} value={appointment.id}>
              {getAppointmentLabel(appointment)}
            </option>
          ))}
        </select>

        <select
          value={filters.laboratorioId || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              laboratorioId: event.target.value,
              page: 1,
            }))
          }
          className="border p-2 rounded-lg text-sm w-full bg-background"
        >
          <option value="">Todos os laboratórios</option>
          {laboratoryOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>

        <input
          type="date"
          value={filters.dataInicio || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dataInicio: event.target.value,
              page: 1,
            }))
          }
          className="border p-2 rounded-lg text-sm w-full"
        />

        <input
          type="date"
          value={filters.dataFim || ""}
          onChange={(event) =>
            setFilters((prev) => ({
              ...prev,
              dataFim: event.target.value,
              page: 1,
            }))
          }
          className="border p-2 rounded-lg text-sm w-full"
        />

        <div className="flex items-center">
          <Button variant="outline" size="sm" onClick={clearFilters}>
            Limpar filtros
          </Button>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 md:grid-cols-2 xl:grid-cols-3 gap-4 rounded-lg bg-gray-50 p-4">
        {isLoading && <p>Carregando ordens de serviço...</p>}
        {isError && <p>Erro ao carregar ordens de serviço.</p>}

        {!isLoading && !serviceOrders.length && (
          <p className="text-sm text-muted-foreground">
            Nenhuma ordem encontrada para os filtros informados.
          </p>
        )}

        {serviceOrders.map((item) => (
          <ServiceOrderCard key={item.id} {...item} />
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
    </CardPage>
  );
}
