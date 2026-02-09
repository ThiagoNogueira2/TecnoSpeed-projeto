import React from "react";
import { BANCO_IMAGENS, BANCO_NOMES, BANCO_CORES } from "../constants/bancos.constants";
import type { EstatisticasBanco } from "../types/banco.types";

interface BancoCardProps {
  banco: string;
  estatisticas: EstatisticasBanco;
  selecionado: boolean;
  indice: number;
  onSelecionar: (banco: string) => void;
}

export default function BancoCard({
  banco,
  estatisticas,
  selecionado,
  indice,
  onSelecionar,
}: BancoCardProps) {
  const isOnline = estatisticas?.lastStatus === "online";
  const nomeBanco = BANCO_NOMES[banco] || banco;

  return (
    <div
      onClick={() => onSelecionar(banco)}
      className="bank-card group animate-slide-up"
      style={{ animationDelay: `${indice * 50}ms` }}
    >
      <div
        className="absolute top-0 left-0 right-0 h-1 rounded-t-xl transition-all duration-300"
        style={{
          backgroundColor: selecionado
            ? "#B4F22E"
            : BANCO_CORES[banco] || "#4F5566",
          opacity: selecionado ? 1 : 0.6,
        }}
      />

      <div className="relative flex-shrink-0">
        <img
          src={BANCO_IMAGENS[banco]}
          alt={nomeBanco}
          className="w-14 h-14 rounded-xl object-cover shadow-md"
        />
        <div
          className={`absolute -bottom-1 -right-1 status-dot ${isOnline ? "online" : "offline"
            } ring-2 ring-dark-700`}
        />
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center justify-between mb-1">
          <h3
            className={`bank-card-name text-sm font-bold truncate transition-colors duration-200 ${selecionado
                ? "text-accent"
                : "text-white group-hover:text-gray-200"
              }`}
          >
            {nomeBanco}
          </h3>
          <span
            className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${isOnline
                ? "bg-success/15 text-success"
                : "bg-danger/15 text-danger"
              }`}
          >
            {isOnline ? "Online" : "Offline"}
          </span>
        </div>

        <div className="grid grid-cols-3 gap-2 mt-2">
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Tempo</p>
            <p
              className={`text-sm font-bold ${estatisticas?.avgTime > 500
                  ? "text-warning"
                  : estatisticas?.avgTime > 300
                    ? "text-yellow-300"
                    : "text-accent"
                }`}
            >
              {estatisticas?.avgTime || 0}
              <span className="text-[10px] text-gray-500 ml-0.5">ms</span>
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Reqs</p>
            <p className="text-sm font-bold text-white">
              {estatisticas?.totalRequests || 0}
            </p>
          </div>
          <div>
            <p className="text-[10px] text-gray-500 uppercase">Erros</p>
            <p
              className={`text-sm font-bold ${estatisticas?.errors > 0 ? "text-danger" : "text-gray-400"
                }`}
            >
              {estatisticas?.errors || 0}
            </p>
          </div>
        </div>
      </div>

      {selecionado && (
        <div className="absolute top-3 right-3">
          <div className="w-2 h-2 rounded-full bg-accent animate-pulse-slow" />
        </div>
      )}
    </div>
  );
}

