import React from "react";
import { BANCO_IMAGENS, BANCO_NOMES } from "../constants/bancos.constants";
import {
    formatarData,
    formatarHoraCompleta,
    obterCorStatus,
    temErro,
} from "../utils/formatadores";
import Paginacao from "./Paginacao";
import type { RegistroBanco, FiltroHistorico } from "../types/banco.types";

interface HistoricoTabelaProps {
    dadosPaginados: RegistroBanco[];
    totalRegistros: number;
    paginaAtual: number;
    totalPaginas: number;
    itensPorPagina: number;
    filtroAtual: FiltroHistorico;
    bancoSelecionado: string;
    onMudarFiltro: (filtro: FiltroHistorico) => void;
    onMudarPagina: (pagina: number) => void;
}

const OPCOES_FILTRO: { chave: FiltroHistorico; rotulo: string }[] = [
    { chave: "all", rotulo: "Todos" },
    { chave: "success", rotulo: "✓ Sucesso" },
    { chave: "error", rotulo: "✕ Erros" },
];

export default function HistoricoTabela({
    dadosPaginados,
    totalRegistros,
    paginaAtual,
    totalPaginas,
    itensPorPagina,
    filtroAtual,
    bancoSelecionado,
    onMudarFiltro,
    onMudarPagina,
}: HistoricoTabelaProps) {
    return (
        <section className="chart-wrapper animate-slide-up">

            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-5">
                <div>
                    <h2 className="text-base font-semibold text-white">
                        Histórico de Envios
                        {bancoSelecionado && (
                            <span className="text-accent ml-2 text-sm font-normal">
                                — {BANCO_NOMES[bancoSelecionado] || bancoSelecionado}
                            </span>
                        )}
                    </h2>
                    <p className="text-xs text-gray-500 mt-0.5">
                        {totalRegistros} registro{totalRegistros !== 1 ? "s" : ""}{" "}
                        encontrado{totalRegistros !== 1 ? "s" : ""}
                    </p>
                </div>


                <div className="flex items-center gap-2">
                    {OPCOES_FILTRO.map(({ chave, rotulo }) => (
                        <button
                            key={chave}
                            onClick={() => onMudarFiltro(chave)}
                            className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-200 ${filtroAtual === chave
                                ? chave === "error"
                                    ? "bg-danger/15 text-danger border border-danger/30"
                                    : chave === "success"
                                        ? "bg-accent/15 text-accent border border-accent/30"
                                        : "bg-dark-400 text-white border border-dark-300"
                                : "bg-dark-700 text-gray-500 border border-dark-400 hover:bg-dark-600 hover:text-gray-300"
                                }`}
                        >
                            {rotulo}
                        </button>
                    ))}
                </div>
            </div>


            <div className="overflow-x-auto rounded-xl border border-dark-400">
                <table className="w-full text-sm">
                    <thead>
                        <tr className="bg-dark-700/60">
                            {["Status", "Banco", "Data / Hora", "Tempo", "Código", "Detalhes"].map(
                                (coluna) => (
                                    <th
                                        key={coluna}
                                        className="text-left py-3.5 px-4 text-[11px] text-gray-500 uppercase tracking-wider font-semibold"
                                    >
                                        {coluna}
                                    </th>
                                )
                            )}
                        </tr>
                    </thead>
                    <tbody>
                        {dadosPaginados.length > 0 ? (
                            dadosPaginados.map((item) => (
                                <LinhaRegistro key={item.id} item={item} />
                            ))
                        ) : (
                            <tr>
                                <td colSpan={6} className="py-12 text-center">
                                    <p className="text-gray-500 text-sm">
                                        Nenhum registro encontrado
                                    </p>
                                    <p className="text-gray-600 text-xs mt-1">
                                        Tente ajustar os filtros de período ou banco
                                    </p>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            {totalPaginas > 1 && (
                <Paginacao
                    paginaAtual={paginaAtual}
                    totalPaginas={totalPaginas}
                    totalRegistros={totalRegistros}
                    itensPorPagina={itensPorPagina}
                    onMudarPagina={onMudarPagina}
                />
            )}
        </section>
    );
}



function LinhaRegistro({ item }: { item: RegistroBanco }) {
    const possuiErro = temErro(item.erro);

    return (
        <tr className="border-t border-dark-400/40 hover:bg-dark-700/40 transition-colors duration-150">

            <td className="py-3 px-4">
                <div className="flex items-center gap-2">
                    <span
                        className={`w-2 h-2 rounded-full flex-shrink-0 ${possuiErro ? "bg-danger" : "bg-accent"
                            }`}
                        style={{
                            boxShadow: possuiErro
                                ? "0 0 6px rgba(255, 47, 47, 0.5)"
                                : "0 0 6px rgba(180, 242, 46, 0.5)",
                        }}
                    />
                    <span
                        className={`text-xs font-semibold ${possuiErro ? "text-danger" : "text-accent"
                            }`}
                    >
                        {possuiErro ? "Erro" : "OK"}
                    </span>
                </div>
            </td>


            <td className="py-3 px-4">
                <div className="flex items-center gap-2.5">
                    <img
                        src={BANCO_IMAGENS[item.nome_banco]}
                        alt={BANCO_NOMES[item.nome_banco]}
                        className="w-7 h-7 rounded-lg object-cover"
                    />
                    <span className="text-white text-xs font-medium truncate max-w-[120px]">
                        {BANCO_NOMES[item.nome_banco] || item.nome_banco}
                    </span>
                </div>
            </td>


            <td className="py-3 px-4">
                <div>
                    <p className="text-gray-300 text-xs">
                        {formatarData(item.disparado_em)}
                    </p>
                    <p className="text-gray-500 text-[11px]">
                        {formatarHoraCompleta(item.disparado_em)}
                    </p>
                </div>
            </td>


            <td className="py-3 px-4">
                <span
                    className={`text-xs font-bold ${obterCorStatus(
                        item.tempo,
                        item.erro
                    )}`}
                >
                    {item.tempo}
                    <span className="text-gray-500 font-normal ml-0.5">ms</span>
                </span>
            </td>


            <td className="py-3 px-4">
                <span className="font-mono text-[11px] text-gray-400 bg-dark-700 px-2 py-1 rounded">
                    {item.codigo || "—"}
                </span>
            </td>


            <td className="py-3 px-4 max-w-[250px]">
                {possuiErro ? (
                    <span
                        className="text-danger/80 text-xs truncate block"
                        title={item.erro || ""}
                    >
                        {item.erro}
                    </span>
                ) : (
                    <span className="text-gray-600 text-xs">
                        Envio realizado com sucesso
                    </span>
                )}
            </td>
        </tr>
    );
}

