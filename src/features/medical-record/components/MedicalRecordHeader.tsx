import dayjs from "dayjs";

import type { MedicalRecord } from "../types/medicalRecord.type";

const STATUS_LABEL: Record<string, string> = {
  em_espera: "Em espera",
  em_andamento: "Em andamento",
  concluido: "Concluído",
  cancelado: "Cancelado",
};

function age(birthDate: string | null): string | null {
  if (!birthDate) return null;
  const years = dayjs().diff(dayjs(birthDate), "year");
  // data_nascimento tem default now() no banco: menos de 1 ano indica data nao informada.
  return years >= 1 && years < 130 ? `${years} anos` : null;
}

export function MedicalRecordHeader({ record }: { record: MedicalRecord }) {
  const { paciente, atendimento, profissional } = record;

  const details = [
    paciente.cpf && `CPF ${paciente.cpf}`,
    age(paciente.data_nascimento),
    paciente.genero,
  ].filter(Boolean);

  return (
    <div className="grid gap-4 rounded-xl border bg-background p-4 md:grid-cols-3">
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Paciente
        </p>
        <p className="text-lg font-semibold">{paciente.nome}</p>
        {details.length > 0 && (
          <p className="text-sm text-muted-foreground">{details.join(" · ")}</p>
        )}
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Atendimento
        </p>
        <p className="font-medium">
          {dayjs(atendimento.dataAtendimento).format("DD/MM/YYYY [às] HH:mm")}
        </p>
        <p className="text-sm text-muted-foreground">
          {STATUS_LABEL[atendimento.status] ?? atendimento.status} ·{" "}
          {record.filial.nome}
        </p>
      </div>
      <div>
        <p className="text-xs uppercase tracking-wide text-muted-foreground">
          Profissional
        </p>
        <p className="font-medium">
          {profissional?.pessoa?.nome ??
            profissional?.username ??
            "Não informado"}
        </p>
        {atendimento.queixa_principal && (
          <p className="text-sm text-muted-foreground">
            Queixa: {atendimento.queixa_principal}
          </p>
        )}
      </div>
    </div>
  );
}
