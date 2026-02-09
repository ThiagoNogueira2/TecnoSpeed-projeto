import React from "react";
import { TooltipProps } from "recharts";

export default function CustomTooltip({
  active,
  payload,
}: TooltipProps<any, any>) {
  if (!active || !payload || payload.length === 0) return null;

  const { tempo, erro, disparado_em } = payload[0].payload;
  const date = new Date(disparado_em);

  const dataFormatada = date.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
  const horaFormatada = date.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  });

  return (
    <div className="bg-dark-800 border border-dark-300 rounded-xl px-4 py-3 shadow-card text-sm">
      <p className="text-white font-semibold mb-1">⏱ {tempo}ms</p>
      <p className={erro ? "text-danger" : "text-accent"}>
        {erro ? "⚠ Erro: Sim" : "✓ Sem erros"}
      </p>
      <p className="text-gray-400 text-xs mt-1">
        {dataFormatada} às {horaFormatada}
      </p>
    </div>
  );
}

