import axios from "axios";
import { Registro } from "../models/Registro.model";
import {
  BANCOS_CONFIG,
  PLUGBOLETO_HEADERS,
  PLUGBOLETO_URL,
} from "../config/bancos.config";

function montarPayloadBoleto(banco: string): any[] {
  const config = BANCOS_CONFIG[banco];

  if (!config) {
    throw new Error(`Configuração do banco "${banco}" não encontrada.`);
  }

  const dados: any = {
    CedenteContaNumero: config.cedenteContaNumero,
    CedenteContaNumeroDV: config.cedenteContaNumeroDV,
    CedenteConvenioNumero: config.cedenteConvenioNumero,
    CedenteContaCodigoBanco: config.cedenteContaCodigoBanco,

    SacadoCPFCNPJ: "12495135960",
    SacadoEnderecoNumero: "4123",
    SacadoEnderecoBairro: "Centro",
    SacadoEnderecoCEP: "87080145",
    SacadoEnderecoCidade: "Maringá",
    SacadoEnderecoComplemento: "Frente",
    SacadoEnderecoLogradouro: "Rua Aviário, 423",
    SacadoEnderecoPais: "Brasil",
    SacadoEnderecoUF: "PR",
    SacadoNome: "Teste",
    SacadoTelefone: "44999111111",
    SacadoCelular: "44999111111",
    SacadoEmail: "thiagohinobu42@gmail.com",

    TituloDataEmissao: "05/10/2024",
    TituloDataVencimento: "20/11/2024",
    TituloMensagem01: "Juros 0,25 ao dia",
    TituloMensagem02: "Não receber apos 30 dias de atraso",
    TituloMensagem03: "titulo sujeito a protesto apos 30 dias",

    TituloNumeroDocumento: "200",
    TituloValor: "500,00",
    TituloLocalPagamento: "Pagavel preferencialmente na ag bb",
    TituloCodigoJuros: "1",
    TituloDataJuros: "21/11/2024",
    TituloValorJuros: "1,00",
    TituloInstrucao1: "1",
    TituloInstrucaoPrazo1: "10",
    hibrido: true,
  };

  if (banco !== "bancoINTER") {
    dados.TituloNossoNumero = "2394";
  }

  return [dados];
}

export async function criarBoletoERegistrar(banco: string): Promise<void> {
  const inicio = Date.now();

  try {
    const payload = montarPayloadBoleto(banco);
    const resposta = await axios.post(PLUGBOLETO_URL, payload, {
      headers: PLUGBOLETO_HEADERS,
    });

    const tempoResposta = Date.now() - inicio;

    await Registro.create({
      nome_banco: banco,
      tempo: tempoResposta,
      codigo: resposta.status,
      erro: resposta.data.erro || null,
      disparado_em: new Date(),
      statusBanco: "online",
    });

    console.log(`✓ Boleto criado para ${banco} (${tempoResposta}ms)`);
  } catch (error: any) {
    const tempoResposta = Date.now() - inicio;

    await Registro.create({
      nome_banco: banco,
      tempo: tempoResposta,
      codigo: error.response?.status || "N/A",
      erro: error.message || "Erro desconhecido",
      disparado_em: new Date(),
      statusBanco: "offline",
    });

    console.error(`✕ Erro ao criar boleto para ${banco}:`, error.message);
  }
}

export async function criarBoletosParaTodosOsBancos(): Promise<void> {
  console.log("─── Iniciando criação de boletos para todos os bancos ───");

  for (const banco of Object.keys(BANCOS_CONFIG)) {
    await criarBoletoERegistrar(banco);
  }

  console.log("─── Criação de boletos finalizada ───");
}

