import { format } from "date-fns";

export function formatarHora(dataISO: string): string {
  const date = new Date(dataISO);
  if (isNaN(date.getTime())) return "";
  return format(date, "HH:mm");
}

export function formatarData(dataISO: string): string {
  const date = new Date(dataISO);
  return date.toLocaleDateString("pt-BR");
}

export function formatarHoraCompleta(dataISO: string): string {
  const date = new Date(dataISO);
  return date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  });
}

export function obterCorStatus(tempo: number, erro: string | null): string {
  if (erro) return "text-danger";
  if (tempo > 500) return "text-warning";
  return "text-accent";
}

export function temErro(erro: string | null): boolean {
  return erro !== null && erro !== "";
}

