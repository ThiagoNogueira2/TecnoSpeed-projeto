import { sequelize } from "../database";
import { Registro } from "../models/Registro.model";

const BANCOS = [
  "bancoBB",
  "bancoITAU",
  "bancoCAIXA",
  "bancoINTER",
  "bancoSANTANDER",
  "bancoSICREDI",
  "bancoSICOOB",
  "bancoBANRISUL",
];

const MENSAGENS_ERRO = [
  "Request failed with status code 500",
  "Request failed with status code 503",
  "timeout of 30000ms exceeded",
  "ECONNREFUSED 127.0.0.1:443",
  "Network Error",
  "Request failed with status code 502",
  "ETIMEDOUT",
  "certificate has expired",
  "socket hang up",
  "Request failed with status code 429",
];

const CODIGOS_ERRO = ["500", "503", "502", "429", "N/A"];

// Tempo base (ms) — valor mínimo de cada banco
const TEMPO_BASE: Record<string, number> = {
  bancoBB: 150,
  bancoITAU: 130,
  bancoCAIXA: 180,
  bancoINTER: 160,
  bancoSANTANDER: 140,
  bancoSICREDI: 170,
  bancoSICOOB: 155,
  bancoBANRISUL: 190,
};

// Amplitude da onda de cada banco (quanto varia)
const AMPLITUDE: Record<string, number> = {
  bancoBB: 180,
  bancoITAU: 200,
  bancoCAIXA: 220,
  bancoINTER: 250,
  bancoSANTANDER: 190,
  bancoSICREDI: 210,
  bancoSICOOB: 170,
  bancoBANRISUL: 240,
};

// Fase (offset) da onda de cada banco — faz os picos ficarem em horas diferentes
const FASE: Record<string, number> = {
  bancoBB: 0,
  bancoITAU: 1.2,
  bancoCAIXA: 2.5,
  bancoINTER: 0.8,
  bancoSANTANDER: 3.1,
  bancoSICREDI: 1.7,
  bancoSICOOB: 4.0,
  bancoBANRISUL: 2.0,
};

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function escolherAleatorio<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

/**
 * Gera um tempo de resposta com padrão de onda bonito.
 * Combina:
 *  1. Onda sinusoidal principal (ciclo ao longo do dia)
 *  2. Segunda harmônica (picos mais interessantes)
 *  3. Ruído aleatório suave
 *  4. Spikes ocasionais (picos dramáticos que sobem e voltam)
 */
function gerarTempoComOnda(
  banco: string,
  hora: number,
  indiceGlobal: number
): number {
  const base = TEMPO_BASE[banco] || 160;
  const amplitude = AMPLITUDE[banco] || 200;
  const fase = FASE[banco] || 0;

  // Onda principal: ciclo de ~12h (dois picos por dia)
  const ondaPrincipal = Math.sin(((hora / 12) * Math.PI * 2) + fase);

  // Segunda harmônica: ciclo de ~6h (detalhes extras)
  const ondaSecundaria = Math.sin(((hora / 6) * Math.PI * 2) + fase * 1.5) * 0.3;

  // Combinação das ondas (normalizado entre 0 e 1)
  const ondaCombinada = (ondaPrincipal + ondaSecundaria + 1.3) / 2.6;

  // Tempo base + onda
  let tempo = base + amplitude * ondaCombinada;

  // Ruído aleatório suave (±15%)
  const ruido = 1 + (Math.random() - 0.5) * 0.3;
  tempo *= ruido;

  // Spike ocasional: a cada ~15 registros, um pico que sobe bastante
  if (indiceGlobal % 13 === 0 || indiceGlobal % 17 === 0) {
    const spikeIntensidade = randomInt(120, 280);
    tempo += spikeIntensidade;
  }

  // Picos de "rush hour" (9-11h e 14-16h ficam naturalmente mais altos)
  if ((hora >= 9 && hora <= 11) || (hora >= 14 && hora <= 16)) {
    tempo += randomInt(30, 80);
  }

  // Madrugada mais baixa (3h-6h)
  if (hora >= 3 && hora <= 6) {
    tempo -= randomInt(20, 60);
  }

  // Clampar entre 100 e 950 (sem ultrapassar)
  return Math.max(100, Math.min(950, Math.round(tempo)));
}

async function seed(): Promise<void> {
  try {
    await sequelize.authenticate();
    console.log("✓ Conexão com o banco de dados estabelecida.");

    await sequelize.sync({ alter: true });
    console.log("✓ Banco de dados sincronizado.");

    await Registro.destroy({ where: {} });
    console.log("✓ Registros antigos removidos.");

    const registros: any[] = [];
    const agora = new Date();
    let indiceGlobal = 0;

    // ═══════════════════════════════════════════════════════
    // PARTE 1: Registros de SUCESSO com padrão de onda bonito
    // ═══════════════════════════════════════════════════════
    for (let diasAtras = 6; diasAtras >= 0; diasAtras--) {
      const horasNoDia =
        diasAtras === 0
          ? Array.from({ length: agora.getHours() + 1 }, (_, i) => i)
          : Array.from({ length: 24 }, (_, i) => i);

      for (const hora of horasNoDia) {
        for (const banco of BANCOS) {
          const dataRegistro = new Date(agora);
          dataRegistro.setDate(dataRegistro.getDate() - diasAtras);
          dataRegistro.setHours(hora, randomInt(0, 59), randomInt(0, 59), 0);

          const tempo = gerarTempoComOnda(banco, hora, indiceGlobal);
          indiceGlobal++;

          registros.push({
            nome_banco: banco,
            tempo,
            erro: null,
            codigo: "200",
            disparado_em: dataRegistro,
            statusBanco: "online",
          });
        }
      }
    }

    // ═══════════════════════════════════════════════════════
    // PARTE 2: Registros de ERRO (incidentes históricos)
    // Tempos altos com o mesmo padrão de onda mas mais intenso
    // ═══════════════════════════════════════════════════════

    // Incidente 1: Banco Inter — 3 dias atrás, madrugada (2h–4h)
    for (let h = 2; h <= 4; h++) {
      for (let min = 0; min < 60; min += 15) {
        const data = new Date(agora);
        data.setDate(data.getDate() - 3);
        data.setHours(h, min, randomInt(0, 59), 0);

        registros.push({
          nome_banco: "bancoINTER",
          tempo: randomInt(550, 900),
          erro: escolherAleatorio(MENSAGENS_ERRO.slice(0, 4)),
          codigo: escolherAleatorio(CODIGOS_ERRO),
          disparado_em: data,
          statusBanco: "offline",
        });
      }
    }

    // Incidente 2: Caixa — 4 dias atrás (9h–11h)
    for (let h = 9; h <= 11; h++) {
      for (let min = 0; min < 60; min += 12) {
        const data = new Date(agora);
        data.setDate(data.getDate() - 4);
        data.setHours(h, min, randomInt(0, 59), 0);

        registros.push({
          nome_banco: "bancoCAIXA",
          tempo: randomInt(500, 850),
          erro: escolherAleatorio(MENSAGENS_ERRO.slice(4, 7)),
          codigo: escolherAleatorio(CODIGOS_ERRO),
          disparado_em: data,
          statusBanco: "offline",
        });
      }
    }

    // Incidente 3: Banrisul — 2 dias atrás (22h–23h)
    for (let h = 22; h <= 23; h++) {
      for (let min = 0; min < 60; min += 10) {
        const data = new Date(agora);
        data.setDate(data.getDate() - 2);
        data.setHours(h, min, randomInt(0, 59), 0);

        registros.push({
          nome_banco: "bancoBANRISUL",
          tempo: randomInt(600, 920),
          erro: escolherAleatorio(MENSAGENS_ERRO.slice(6, 10)),
          codigo: escolherAleatorio(CODIGOS_ERRO),
          disparado_em: data,
          statusBanco: "offline",
        });
      }
    }

    // Incidente 4: Sicredi — 5 dias atrás (14h–16h)
    for (let h = 14; h <= 16; h++) {
      for (let min = 0; min < 60; min += 12) {
        const data = new Date(agora);
        data.setDate(data.getDate() - 5);
        data.setHours(h, min, randomInt(0, 59), 0);

        registros.push({
          nome_banco: "bancoSICREDI",
          tempo: randomInt(480, 800),
          erro: escolherAleatorio(MENSAGENS_ERRO),
          codigo: escolherAleatorio(CODIGOS_ERRO),
          disparado_em: data,
          statusBanco: "offline",
        });
      }
    }

    // Incidente 5: BB — 6 dias atrás (3h–5h)
    for (let h = 3; h <= 5; h++) {
      for (let min = 0; min < 60; min += 20) {
        const data = new Date(agora);
        data.setDate(data.getDate() - 6);
        data.setHours(h, min, randomInt(0, 59), 0);

        registros.push({
          nome_banco: "bancoBB",
          tempo: randomInt(550, 870),
          erro: escolherAleatorio(MENSAGENS_ERRO.slice(0, 3)),
          codigo: escolherAleatorio(CODIGOS_ERRO),
          disparado_em: data,
          statusBanco: "offline",
        });
      }
    }

    // Incidente 6: Santander — 1 dia atrás (6h–7h)
    for (let h = 6; h <= 7; h++) {
      for (let min = 0; min < 60; min += 15) {
        const data = new Date(agora);
        data.setDate(data.getDate() - 1);
        data.setHours(h, min, randomInt(0, 59), 0);

        registros.push({
          nome_banco: "bancoSANTANDER",
          tempo: randomInt(500, 780),
          erro: escolherAleatorio(MENSAGENS_ERRO.slice(5, 9)),
          codigo: escolherAleatorio(CODIGOS_ERRO),
          disparado_em: data,
          statusBanco: "offline",
        });
      }
    }

    // Incidente 7: Itaú — 3 dias atrás (18h–19h)
    for (let min = 0; min < 60; min += 10) {
      const data = new Date(agora);
      data.setDate(data.getDate() - 3);
      data.setHours(18, min, randomInt(0, 59), 0);

      registros.push({
        nome_banco: "bancoITAU",
        tempo: randomInt(450, 750),
        erro: escolherAleatorio(MENSAGENS_ERRO),
        codigo: escolherAleatorio(CODIGOS_ERRO),
        disparado_em: data,
        statusBanco: "offline",
      });
    }

    // Incidente 8: Sicoob — 4 dias atrás (12h–13h)
    for (let min = 0; min < 60; min += 12) {
      const data = new Date(agora);
      data.setDate(data.getDate() - 4);
      data.setHours(12, min, randomInt(0, 59), 0);

      registros.push({
        nome_banco: "bancoSICOOB",
        tempo: randomInt(500, 820),
        erro: escolherAleatorio(MENSAGENS_ERRO),
        codigo: escolherAleatorio(CODIGOS_ERRO),
        disparado_em: data,
        statusBanco: "offline",
      });
    }

    // Ordenar cronologicamente
    registros.sort(
      (a, b) =>
        new Date(a.disparado_em).getTime() -
        new Date(b.disparado_em).getTime()
    );

    // Inserir em lotes
    const TAMANHO_LOTE = 100;
    for (let i = 0; i < registros.length; i += TAMANHO_LOTE) {
      const lote = registros.slice(i, i + TAMANHO_LOTE);
      await Registro.bulkCreate(lote);
      process.stdout.write(
        `\r  Inserindo registros... ${Math.min(i + TAMANHO_LOTE, registros.length)}/${registros.length}`
      );
    }

    console.log("");

    // Resumo
    const totalErros = registros.filter((r) => r.erro !== null).length;
    const totalSucesso = registros.length - totalErros;
    const tempos = registros.filter((r) => !r.erro).map((r) => r.tempo);
    const tempoMin = Math.min(...tempos);
    const tempoMax = Math.max(...tempos);
    const tempoMedio = Math.round(
      tempos.reduce((a, b) => a + b, 0) / tempos.length
    );

    console.log("\n═══════════════════════════════════════════");
    console.log("  SEED CONCLUÍDO COM SUCESSO!");
    console.log("═══════════════════════════════════════════");
    console.log(`  Total de registros: ${registros.length}`);
    console.log(`  ✓ Sucessos:         ${totalSucesso}`);
    console.log(`  ✕ Erros:            ${totalErros}`);
    console.log(`  ⏱ Tempo min:        ${tempoMin}ms`);
    console.log(`  ⏱ Tempo médio:      ${tempoMedio}ms`);
    console.log(`  ⏱ Tempo max:        ${tempoMax}ms`);
    console.log("───────────────────────────────────────────");

    for (const banco of BANCOS) {
      const doBanco = registros.filter((r) => r.nome_banco === banco);
      const errosBanco = doBanco.filter((r) => r.erro !== null).length;
      const ultimoRegistro = doBanco[doBanco.length - 1];
      const statusFinal = ultimoRegistro?.statusBanco || "?";
      console.log(
        `  ${statusFinal === "online" ? "✓" : "⚠"} ${banco.padEnd(18)} ${doBanco.length} registros (${errosBanco} erros) | último: ${statusFinal}`
      );
    }

    console.log("═══════════════════════════════════════════\n");

    process.exit(0);
  } catch (error) {
    console.error("✕ Erro ao executar seed:", error);
    process.exit(1);
  }
}

seed();
