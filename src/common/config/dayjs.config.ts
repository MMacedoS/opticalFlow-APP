import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timezone from "dayjs/plugin/timezone";
import "dayjs/locale/pt-br";

// Ativa os plugins necessários
dayjs.extend(utc);
dayjs.extend(timezone);

// Define o padrão para o Brasil
dayjs.locale("pt-br");
dayjs.tz.setDefault("America/Sao_Paulo");

export { dayjs };
