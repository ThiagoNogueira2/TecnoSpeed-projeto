export interface RegistroBanco {
  id: number;
  nome_banco: string;
  tempo: number;
  erro: string | null;
  codigo: string;
  disparado_em: string;
  statusBanco: string;
  createdAt: string;
  updatedAt: string;
}

export interface EstatisticasBanco {
  totalRequests: number;
  avgTime: number;
  errors: number;
  lastStatus: string;
  lastTime: number;
}

export interface ErroAgrupado {
  hour: number;
  erros: number;
  erroNomes: string[];
}

export type PeriodoFiltro = "24h" | "7d" | "30d";
export type FiltroHistorico = "all" | "success" | "error";

