import React from "react";
import GraficoTempo from "./GraficoTempo";
import GraficoErros from "./GraficoErros";
import { BANCO_NOMES } from "../constants/bancos.constants";
import type { RegistroBanco } from "../types/banco.types";

interface SecaoGraficoProps {
  modoErros: boolean;
  dadosFiltrados: RegistroBanco[];
  dadosComErro: RegistroBanco[];
  bancoSelecionado: string;
}

export default function SecaoGrafico({
  modoErros,
  dadosFiltrados,
  dadosComErro,
  bancoSelecionado,
}: SecaoGraficoProps) {
  // Key única que muda toda vez que troca modo ou banco → força o recharts a remontar e re-animar a onda
  const chaveAnimacao = `${modoErros}-${bancoSelecionado}-${Date.now()}`;

  return (
    <section className="chart-wrapper animate-fade-in">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h2 className="text-base font-semibold text-white">
            {modoErros ? "Distribuição de Erros" : "Tempo de Resposta"}
            {bancoSelecionado && (
              <span className="text-accent ml-2 text-sm font-normal">
                — {BANCO_NOMES[bancoSelecionado] || bancoSelecionado}
              </span>
            )}
          </h2>
          <p className="text-xs text-gray-500 mt-0.5">
            {modoErros
              ? "Tempo de resposta das requisições com erro"
              : "Últimas 50 requisições monitoradas"}
          </p>
        </div>

        <div className="flex items-center gap-4 text-xs text-gray-500">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-accent" />
            Normal (&lt;200ms)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-warning" />
            Lento (&gt;500ms)
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-danger" />
            Erro
          </div>
        </div>
      </div>

      {modoErros ? (
        <GraficoErros key={chaveAnimacao} dados={dadosComErro} />
      ) : (
        <GraficoTempo key={chaveAnimacao} dados={dadosFiltrados} />
      )}
    </section>
  );
}
