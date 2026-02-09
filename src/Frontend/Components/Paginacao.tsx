import React from "react";

interface PaginacaoProps {
  paginaAtual: number;
  totalPaginas: number;
  totalRegistros: number;
  itensPorPagina: number;
  onMudarPagina: (pagina: number) => void;
}

export default function Paginacao({
  paginaAtual,
  totalPaginas,
  totalRegistros,
  itensPorPagina,
  onMudarPagina,
}: PaginacaoProps) {
  const inicio = (paginaAtual - 1) * itensPorPagina + 1;
  const fim = Math.min(paginaAtual * itensPorPagina, totalRegistros);

  function gerarPaginas(): (number | "dots")[] {
    const paginas = Array.from({ length: totalPaginas }, (_, i) => i + 1);

    const visiveis = paginas.filter((pagina) => {
      if (totalPaginas <= 7) return true;
      if (pagina === 1 || pagina === totalPaginas) return true;
      if (Math.abs(pagina - paginaAtual) <= 1) return true;
      return false;
    });

    const resultado: (number | "dots")[] = [];
    visiveis.forEach((pagina, idx) => {
      if (idx > 0 && pagina - visiveis[idx - 1] > 1) {
        resultado.push("dots");
      }
      resultado.push(pagina);
    });

    return resultado;
  }

  const btnClass =
    "px-3 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 bg-dark-700 border border-dark-400 text-gray-400 hover:bg-dark-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed disabled:hover:bg-dark-700 disabled:hover:text-gray-400";

  return (
    <div className="flex items-center justify-between mt-5 pt-4 border-t border-dark-400/50">
      <p className="text-xs text-gray-500">
        Mostrando{" "}
        <span className="text-gray-300 font-medium">{inicio}</span> a{" "}
        <span className="text-gray-300 font-medium">{fim}</span> de{" "}
        <span className="text-gray-300 font-medium">{totalRegistros}</span>{" "}
        registros
      </p>

      <div className="flex items-center gap-1.5">
        <button
          onClick={() => onMudarPagina(1)}
          disabled={paginaAtual === 1}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 bg-dark-700 border border-dark-400 text-gray-400 hover:bg-dark-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          ««
        </button>

        <button
          onClick={() => onMudarPagina(Math.max(1, paginaAtual - 1))}
          disabled={paginaAtual === 1}
          className={btnClass}
        >
          ‹ Anterior
        </button>

        <div className="flex items-center gap-1 mx-1">
          {gerarPaginas().map((pagina, idx) =>
            pagina === "dots" ? (
              <span key={`dots-${idx}`} className="px-1 text-gray-600 text-xs">
                …
              </span>
            ) : (
              <button
                key={pagina}
                onClick={() => onMudarPagina(pagina)}
                className={`w-8 h-8 rounded-lg text-xs font-semibold transition-all duration-150 ${paginaAtual === pagina
                    ? "bg-accent text-dark-900 shadow-glow-green"
                    : "bg-dark-700 border border-dark-400 text-gray-400 hover:bg-dark-600 hover:text-white"
                  }`}
              >
                {pagina}
              </button>
            )
          )}
        </div>

        <button
          onClick={() =>
            onMudarPagina(Math.min(totalPaginas, paginaAtual + 1))
          }
          disabled={paginaAtual === totalPaginas}
          className={btnClass}
        >
          Próximo ›
        </button>

        <button
          onClick={() => onMudarPagina(totalPaginas)}
          disabled={paginaAtual === totalPaginas}
          className={`px-2.5 py-1.5 rounded-lg text-xs font-medium transition-all duration-150 bg-dark-700 border border-dark-400 text-gray-400 hover:bg-dark-600 hover:text-white disabled:opacity-30 disabled:cursor-not-allowed`}
        >
          »»
        </button>
      </div>
    </div>
  );
}

