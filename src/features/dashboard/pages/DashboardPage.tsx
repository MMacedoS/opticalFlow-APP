import type { ReactNode } from "react";
import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import {
  AlertTriangle,
  CalendarClock,
  ClipboardList,
  PackageX,
  TrendingDown,
  TrendingUp,
  Wallet,
} from "lucide-react";
import { Link } from "react-router-dom";

import { useAuthStore } from "@/stores/auth.store";
import { formatCurrencyDisplay } from "@/utils/masks";

import { useDashboard } from "../hooks/useDashboard";
import type { AppointmentStatus } from "../types/dashboard.types";

import { PageLoading } from "@/components/loading/PageLoading";

const STATUS_LABEL: Record<AppointmentStatus, string> = {
  em_espera: "Em espera",
  em_andamento: "Em andamento",
  concluido: "Concluídas",
  cancelado: "Canceladas",
};

function StatCard({
  title,
  value,
  detail,
  icon,
  to,
  tone = "default",
}: {
  title: string;
  value: ReactNode;
  detail?: ReactNode;
  icon: ReactNode;
  to: string;
  tone?: "default" | "danger";
}) {
  return (
    <Link
      to={to}
      className={`group rounded-2xl border bg-background p-4 transition-colors hover:border-primary/40 ${
        tone === "danger" ? "border-red-200 bg-red-50/60" : ""
      }`}
    >
      <div className="flex items-start justify-between gap-2">
        <p className="text-sm text-muted-foreground">{title}</p>
        <span className="text-muted-foreground group-hover:text-primary">
          {icon}
        </span>
      </div>
      <p className="mt-1 text-2xl font-semibold">{value}</p>
      {detail && (
        <div className="mt-1 text-xs text-muted-foreground">{detail}</div>
      )}
    </Link>
  );
}

function Panel({
  title,
  to,
  empty,
  children,
}: {
  title: string;
  to: string;
  empty: string;
  children: ReactNode[];
}) {
  return (
    <section className="rounded-2xl border bg-background p-4">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="font-semibold">{title}</h2>
        <Link to={to} className="text-sm text-primary hover:underline">
          Ver todos
        </Link>
      </div>
      {children.length === 0 ? (
        <p className="text-sm text-muted-foreground">{empty}</p>
      ) : (
        <ul className="divide-y text-sm">{children}</ul>
      )}
    </section>
  );
}

function variation(atual: number, anterior: number) {
  if (anterior === 0) return null;
  return Math.round(((atual - anterior) / anterior) * 100);
}

export function DashboardPage() {
  const session = useAuthStore((state) => state.session);
  const { data, isLoading, isError } = useDashboard();
  const resumo = data?.data;

  const vendasVariacao = resumo?.vendas
    ? variation(resumo.vendas.mesAtual.total, resumo.vendas.mesAnterior.total)
    : null;

  return (
    <div className="space-y-4">
      <header className="rounded-2xl border bg-background p-4">
        <h1 className="text-xl font-semibold">
          Olá{session?.usuario?.username ? `, ${session.usuario.username}` : ""}
          !
        </h1>
        <p className="text-sm text-muted-foreground first-letter:uppercase">
          {dayjs().locale("pt-br").format("dddd, D [de] MMMM [de] YYYY")}
        </p>
      </header>

      {isLoading && <PageLoading />}
      {isError && (
        <p className="text-sm text-destructive">
          Não foi possível carregar o painel.
        </p>
      )}

      {resumo && (
        <>
          <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-4">
            {resumo.consultasHoje && (
              <StatCard
                title="Consultas hoje"
                value={resumo.consultasHoje.total}
                icon={<CalendarClock className="size-5" />}
                to="/consultas"
                detail={Object.entries(resumo.consultasHoje.porStatus)
                  .filter(([, total]) => total > 0)
                  .map(
                    ([status, total]) =>
                      `${total} ${STATUS_LABEL[status as AppointmentStatus].toLowerCase()}`,
                  )
                  .join(" · ")}
              />
            )}
            {resumo.ordensServico && (
              <StatCard
                title="OS em andamento"
                value={resumo.ordensServico.abertas}
                icon={<ClipboardList className="size-5" />}
                to="/ordens-servico"
                tone={resumo.ordensServico.atrasadas > 0 ? "danger" : "default"}
                detail={
                  resumo.ordensServico.atrasadas > 0 ? (
                    <span className="font-medium text-red-600">
                      {resumo.ordensServico.atrasadas} com entrega atrasada
                    </span>
                  ) : (
                    "Nenhuma entrega atrasada"
                  )
                }
              />
            )}
            {resumo.vendas && (
              <StatCard
                title="Vendas no mês"
                value={formatCurrencyDisplay(resumo.vendas.mesAtual.total)}
                icon={<Wallet className="size-5" />}
                to="/vendas"
                detail={
                  <span className="flex items-center gap-1">
                    {resumo.vendas.mesAtual.quantidade}{" "}
                    {resumo.vendas.mesAtual.quantidade === 1
                      ? "venda"
                      : "vendas"}
                    {vendasVariacao !== null && (
                      <span
                        className={`flex items-center gap-0.5 font-medium ${
                          vendasVariacao >= 0
                            ? "text-green-700"
                            : "text-red-600"
                        }`}
                      >
                        {vendasVariacao >= 0 ? (
                          <TrendingUp className="size-3" />
                        ) : (
                          <TrendingDown className="size-3" />
                        )}
                        {vendasVariacao > 0 ? "+" : ""}
                        {vendasVariacao}% vs mês anterior
                      </span>
                    )}
                  </span>
                }
              />
            )}
            {resumo.estoque && (
              <StatCard
                title="Estoque abaixo do mínimo"
                value={resumo.estoque.abaixoMinimo}
                icon={<PackageX className="size-5" />}
                to="/estoque"
                tone={resumo.estoque.abaixoMinimo > 0 ? "danger" : "default"}
                detail={
                  resumo.estoque.abaixoMinimo > 0
                    ? "Produtos para repor"
                    : "Nenhum produto para repor"
                }
              />
            )}
          </div>

          {resumo.financeiro && (
            <div className="grid gap-3 md:grid-cols-2">
              <StatCard
                title="A receber"
                value={formatCurrencyDisplay(
                  resumo.financeiro.receberProximos7Dias,
                )}
                icon={<TrendingUp className="size-5" />}
                to="/financeiro/contas-receber"
                tone={
                  resumo.financeiro.receberVencido > 0 ? "danger" : "default"
                }
                detail={
                  <>
                    nos próximos 7 dias
                    {resumo.financeiro.receberVencido > 0 && (
                      <span className="ml-1 font-medium text-red-600">
                        ·{" "}
                        {formatCurrencyDisplay(
                          resumo.financeiro.receberVencido,
                        )}{" "}
                        vencido
                      </span>
                    )}
                  </>
                }
              />
              <StatCard
                title="A pagar"
                value={formatCurrencyDisplay(
                  resumo.financeiro.pagarProximos7Dias,
                )}
                icon={<TrendingDown className="size-5" />}
                to="/financeiro/contas-pagar"
                tone={resumo.financeiro.pagarVencido > 0 ? "danger" : "default"}
                detail={
                  <>
                    nos próximos 7 dias
                    {resumo.financeiro.pagarVencido > 0 && (
                      <span className="ml-1 font-medium text-red-600">
                        ·{" "}
                        {formatCurrencyDisplay(resumo.financeiro.pagarVencido)}{" "}
                        vencido
                      </span>
                    )}
                  </>
                }
              />
            </div>
          )}

          <div className="grid gap-3 lg:grid-cols-3">
            {resumo.consultasHoje && (
              <Panel
                title="Próximas consultas de hoje"
                to="/consultas"
                empty="Nenhuma consulta pendente hoje."
              >
                {resumo.consultasHoje.proximas.map((consulta) => (
                  <li
                    key={consulta.id}
                    className="flex justify-between gap-2 py-2"
                  >
                    <span>
                      <span className="font-medium">{consulta.paciente}</span>
                      {consulta.profissional && (
                        <span className="block text-xs text-muted-foreground">
                          {consulta.profissional}
                        </span>
                      )}
                    </span>
                    <span className="text-right">
                      {dayjs(consulta.dataAtendimento).format("HH:mm")}
                      <span className="block text-xs text-muted-foreground">
                        {STATUS_LABEL[consulta.status]}
                      </span>
                    </span>
                  </li>
                ))}
              </Panel>
            )}
            {resumo.ordensServico && (
              <Panel
                title="Entregas atrasadas"
                to="/ordens-servico"
                empty="Nenhuma OS com entrega atrasada."
              >
                {resumo.ordensServico.listaAtrasadas.map((os) => (
                  <li key={os.id} className="flex justify-between gap-2 py-2">
                    <span>
                      <span className="font-medium">
                        OS {os.numero ?? "sem número"}
                      </span>
                      <span className="block text-xs text-muted-foreground">
                        {os.cliente ?? "Sem cliente"}
                      </span>
                    </span>
                    <span className="text-right text-red-600">
                      {os.previsao_entrega &&
                        dayjs(os.previsao_entrega).format("DD/MM")}
                      <span className="block text-xs text-muted-foreground">
                        {formatCurrencyDisplay(os.valor_total)}
                      </span>
                    </span>
                  </li>
                ))}
              </Panel>
            )}
            {resumo.estoque && (
              <Panel
                title="Repor estoque"
                to="/estoque"
                empty="Nenhum produto abaixo do mínimo."
              >
                {resumo.estoque.itens.map((item) => (
                  <li key={item.id} className="flex justify-between gap-2 py-2">
                    <span>
                      <span className="font-medium">{item.produto}</span>
                      <span className="block text-xs text-muted-foreground">
                        {item.sku}
                      </span>
                    </span>
                    <span className="flex items-center gap-1 text-right font-mono text-red-600">
                      <AlertTriangle className="size-3.5" />
                      {item.quantidade}
                      <span className="text-xs text-muted-foreground">
                        / mín. {item.minimo}
                      </span>
                    </span>
                  </li>
                ))}
              </Panel>
            )}
          </div>
        </>
      )}
    </div>
  );
}
