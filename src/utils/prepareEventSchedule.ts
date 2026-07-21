import moment from "moment";
import type { Evento, MeuEvento } from "../features/schedule/type/schedule";

export function prepareEventSchedule(evento: Evento): MeuEvento {
  const dataInicio = new Date(evento.dataHora);
  const minutos = evento.duracaoMin || 30;
  const dataFim = moment(dataInicio).add(minutos, "minutes").toDate();

  const title = getEventTitle(evento);

  return {
    id: evento.id,
    title: title,
    start: dataInicio,
    end: dataFim,
    empresaId: evento.empresaId,
    filialId: evento.filialId,
    pessoaId: evento.pessoaId,
    paciente: evento.paciente,
    profissional: evento.profissional,
    profissionalId: evento.profissionalId,
    status: evento.status,
    observacao: evento.observacao,
    clientId: evento.clientId,
    convenioId: evento.convenioId,
    queixa_principal: evento.queixa_principal,
  };
}

function getEventTitle(evento: Evento): string {
  const pacienteNome = evento.paciente?.nome;
  const profissionalNome = evento.profissional?.username;
  const observacao = evento.observacao?.trim();

  if (pacienteNome && profissionalNome && observacao) {
    return `Consulta: ${pacienteNome} com ${profissionalNome} (${observacao})`;
  }

  if (pacienteNome && profissionalNome) {
    return `Consulta: ${pacienteNome} com ${profissionalNome}`;
  }

  if (pacienteNome && observacao) {
    return `Consulta: ${pacienteNome} (${observacao})`;
  }

  if (profissionalNome && observacao) {
    return `Profissional: ${profissionalNome} (${observacao})`;
  }

  if (pacienteNome) {
    return `Atendimento para ${pacienteNome}`;
  }

  if (profissionalNome) {
    return `Profissional: ${profissionalNome}`;
  }

  if (observacao) {
    return `Obs: ${observacao}`;
  }

  return "Agendamento sem identificação";
}
