"use client";
import React from "react";
import { useRegistros } from "../hooks/useRegistros";
import { ITENS_POR_PAGINA } from "../constants/bancos.constants";
import DashboardHeader from "./DashboardHeader";
import BancoCard from "./BancoCard";
import SecaoGrafico from "./SecaoGrafico";
import HistoricoTabela from "./HistoricoTabela";

export default function Dashboard() {
  const {
    bancoSelecionado,
    listaBancos,
    periodoSelecionado,
    modoErros,
    erroBackend,
    paginaHistorico,
    filtroHistorico,

    dadosFiltrados,
    estatisticasPorBanco,
    dadosComErro,
    historicoOrdenado,
    historicoPaginado,
    totalPaginas,

    alternarBanco,
    limparFiltroBanco,
    alternarModoErros,
    setPeriodoSelecionado,
    setPaginaHistorico,
    setFiltroHistorico,
  } = useRegistros();

  return (
    <div className="min-h-screen bg-dark-900">
      {erroBackend && (
        <div className="fixed top-0 inset-x-0 z-50 bg-danger/95 backdrop-blur-sm text-white py-3 px-6 text-center font-semibold text-sm shadow-lg animate-fade-in">
          <span className="mr-2">⚠️</span>
          Backend não está disponível. Certifique-se de que o servidor está
          rodando na porta 5000.
        </div>
      )}

      <DashboardHeader
        periodoSelecionado={periodoSelecionado}
        onSelecionarPeriodo={setPeriodoSelecionado}
        modoErros={modoErros}
        onAlternarModoErros={alternarModoErros}
        bancoSelecionado={bancoSelecionado}
        onLimparFiltro={limparFiltroBanco}
      />

      <main className="max-w-[1920px] mx-auto px-6 py-6 space-y-6">
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-gray-300">
              Instituições Financeiras
            </h2>
            <p className="text-xs text-gray-500">
              Clique em um banco para filtrar os dados
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {listaBancos.map((banco, indice) => (
              <BancoCard
                key={banco}
                banco={banco}
                estatisticas={estatisticasPorBanco[banco]}
                selecionado={bancoSelecionado === banco}
                indice={indice}
                onSelecionar={alternarBanco}
              />
            ))}
          </div>
        </section>

        <SecaoGrafico
          modoErros={modoErros}
          dadosFiltrados={dadosFiltrados}
          dadosComErro={dadosComErro}
          bancoSelecionado={bancoSelecionado}
        />

        <HistoricoTabela
          dadosPaginados={historicoPaginado}
          totalRegistros={historicoOrdenado.length}
          paginaAtual={paginaHistorico}
          totalPaginas={totalPaginas}
          itensPorPagina={ITENS_POR_PAGINA}
          filtroAtual={filtroHistorico}
          bancoSelecionado={bancoSelecionado}
          onMudarFiltro={setFiltroHistorico}
          onMudarPagina={setPaginaHistorico}
        />

        <footer className="text-center py-6 text-xs text-gray-600">
          <p>TecnoSpeed — Sistema de Monitoramento de Boletos Bancários</p>
        </footer>
      </main>
    </div>
  );
}

