import React from "react";
import type { PeriodoFiltro } from "../types/banco.types";

interface DashboardHeaderProps {
  periodoSelecionado: PeriodoFiltro;
  onSelecionarPeriodo: (periodo: PeriodoFiltro) => void;
  modoErros: boolean;
  onAlternarModoErros: () => void;
  bancoSelecionado: string;
  onLimparFiltro: () => void;
}

const PERIODOS: { valor: PeriodoFiltro; rotulo: string }[] = [
  { valor: "24h", rotulo: "24 Horas" },
  { valor: "7d", rotulo: "7 Dias" },
  { valor: "30d", rotulo: "30 Dias" },
];

export default function DashboardHeader({
  periodoSelecionado,
  onSelecionarPeriodo,
  modoErros,
  onAlternarModoErros,
  bancoSelecionado,
  onLimparFiltro,
}: DashboardHeaderProps) {
  return (
    <header className="sticky top-0 z-40 bg-dark-900/80 backdrop-blur-xl border-b border-dark-400">
      <div className="max-w-[1920px] mx-auto px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <img
            src="/images/tecnospeed.jpeg"
            alt="TecnoSpeed"
            className="h-10 w-auto rounded-lg object-cover"
          />
          <div>
            <h1 className="text-lg font-bold text-white tracking-tight">
              Monitor de Bancos
            </h1>
            <p className="text-xs text-gray-500">
              Painel de monitoramento em tempo real
            </p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          {PERIODOS.map(({ valor, rotulo }) => (
            <button
              key={valor}
              onClick={() => onSelecionarPeriodo(valor)}
              className={`btn-period ${periodoSelecionado === valor ? "active" : ""
                }`}
            >
              {rotulo}
            </button>
          ))}

          <div className="w-px h-8 bg-dark-400 mx-1" />

          <button
            onClick={onAlternarModoErros}
            className={`btn-period flex items-center gap-2 ${modoErros ? "active" : ""
              }`}
            title="Alternar entre gráfico de tempo e erros"
          >
            {modoErros ? "⏱️ Tempo" : "⚠️ Erros"}
          </button>

          {bancoSelecionado && (
            <button
              onClick={onLimparFiltro}
              className="btn-period flex items-center gap-2 text-danger border-danger/30 hover:border-danger hover:bg-danger/10"
            >
              ✕ Limpar filtro
            </button>
          )}
        </div>
      </div>
    </header>
  );
}

