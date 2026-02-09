import { criarBoletosParaTodosOsBancos } from "../services/boleto.service";

const INTERVALO_EXECUCAO = 60 * 60 * 1000;

export function iniciarAgendamentoDeBoletos(): void {
  console.log(
    `   Intervalo: ${INTERVALO_EXECUCAO / 1000 / 60} minuto(s)`
  );

  criarBoletosParaTodosOsBancos();

  setInterval(() => {
    criarBoletosParaTodosOsBancos();
  }, INTERVALO_EXECUCAO);
}

