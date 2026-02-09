import { useEffect, useState, useMemo } from "react";
import { buscarRegistros } from "../services/api.service";
import { PERIODO_EM_MS, ITENS_POR_PAGINA } from "../constants/bancos.constants";
import type {
  RegistroBanco,
  EstatisticasBanco,
  PeriodoFiltro,
  FiltroHistorico,
} from "../types/banco.types";

export function useRegistros() {
  const [registros, setRegistros] = useState<RegistroBanco[]>([]);
  const [bancoSelecionado, setBancoSelecionado] = useState<string>("");
  const [listaBancos, setListaBancos] = useState<string[]>([]);
  const [periodoSelecionado, setPeriodoSelecionado] =
    useState<PeriodoFiltro>("24h");
  const [modoErros, setModoErros] = useState(false);
  const [erroBackend, setErroBackend] = useState(false);
  const [paginaHistorico, setPaginaHistorico] = useState(1);
  const [filtroHistorico, setFiltroHistorico] =
    useState<FiltroHistorico>("all");

  useEffect(() => {
    async function carregarDados() {
      try {
        const resultado = await buscarRegistros();
        setRegistros(resultado);
        setErroBackend(false);

        const bancosUnicos = Array.from(
          new Set(resultado.map((item) => item.nome_banco))
        );
        setListaBancos(bancosUnicos);
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
        setRegistros([]);
        setErroBackend(true);
      }
    }

    carregarDados();
  }, []);

  const dadosFiltrados = useMemo(() => {
    const agora = new Date();
    let filtrados = [...registros];

    if (bancoSelecionado) {
      filtrados = filtrados.filter(
        (item) => item.nome_banco === bancoSelecionado
      );
    }

    const ms = PERIODO_EM_MS[periodoSelecionado];
    if (ms) {
      filtrados = filtrados.filter(
        (item) =>
          agora.getTime() - new Date(item.disparado_em).getTime() <= ms
      );
    }

    return filtrados;
  }, [bancoSelecionado, periodoSelecionado, registros]);

  const estatisticasPorBanco = useMemo(() => {
    const stats: Record<string, EstatisticasBanco> = {};

    listaBancos.forEach((banco) => {
      const dadosBanco = registros.filter(
        (item) => item.nome_banco === banco
      );
      const erros = dadosBanco.filter(
        (item) => item.erro !== null && item.erro !== ""
      ).length;
      const tempoMedio =
        dadosBanco.length > 0
          ? Math.round(
              dadosBanco.reduce((soma, item) => soma + item.tempo, 0) /
                dadosBanco.length
            )
          : 0;
      const ultimoRegistro = dadosBanco[dadosBanco.length - 1];

      stats[banco] = {
        totalRequests: dadosBanco.length,
        avgTime: tempoMedio,
        errors: erros,
        lastStatus: ultimoRegistro?.statusBanco || "offline",
        lastTime: ultimoRegistro?.tempo || 0,
      };
    });

    return stats;
  }, [listaBancos, registros]);

  const dadosComErro = useMemo(
    () => dadosFiltrados.filter((item) => item.erro),
    [dadosFiltrados]
  );

  const historicoOrdenado = useMemo(() => {
    let itens = [...dadosFiltrados];

    if (filtroHistorico === "success") {
      itens = itens.filter((item) => !item.erro);
    } else if (filtroHistorico === "error") {
      itens = itens.filter((item) => item.erro);
    }

    itens.sort(
      (a, b) =>
        new Date(b.disparado_em).getTime() -
        new Date(a.disparado_em).getTime()
    );

    return itens;
  }, [dadosFiltrados, filtroHistorico]);

  const totalPaginas = Math.max(
    1,
    Math.ceil(historicoOrdenado.length / ITENS_POR_PAGINA)
  );
  const historicoPaginado = historicoOrdenado.slice(
    (paginaHistorico - 1) * ITENS_POR_PAGINA,
    paginaHistorico * ITENS_POR_PAGINA
  );

  useEffect(() => {
    setPaginaHistorico(1);
  }, [bancoSelecionado, periodoSelecionado, filtroHistorico]);

  function alternarBanco(banco: string) {
    setBancoSelecionado((atual) => (atual === banco ? "" : banco));
  }

  function limparFiltroBanco() {
    setBancoSelecionado("");
  }

  function alternarModoErros() {
    setModoErros((prev) => !prev);
  }

  return {
    registros,
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
  };
}

