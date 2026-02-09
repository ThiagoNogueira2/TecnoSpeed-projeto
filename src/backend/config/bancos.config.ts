export interface ConfigBanco {
  cedenteContaNumero: string;
  cedenteContaNumeroDV: string;
  cedenteConvenioNumero: string;
  cedenteContaCodigoBanco: string;
}

export const BANCOS_CONFIG: Record<string, ConfigBanco> = {
  bancoBB: {
    cedenteContaNumero: "07081",
    cedenteContaNumeroDV: "4",
    cedenteConvenioNumero: "12345",
    cedenteContaCodigoBanco: "001",
  },
  bancoITAU: {
    cedenteContaNumero: "82735",
    cedenteContaNumeroDV: "2",
    cedenteConvenioNumero: "3213827352",
    cedenteContaCodigoBanco: "341",
  },
  bancoCAIXA: {
    cedenteContaNumero: "4123",
    cedenteContaNumeroDV: "4",
    cedenteConvenioNumero: "926364",
    cedenteContaCodigoBanco: "104",
  },
  bancoINTER: {
    cedenteContaNumero: "9263",
    cedenteContaNumeroDV: "1",
    cedenteConvenioNumero: "9263",
    cedenteContaCodigoBanco: "077",
  },
  bancoSANTANDER: {
    cedenteContaNumero: "452131",
    cedenteContaNumeroDV: "4",
    cedenteConvenioNumero: "9821",
    cedenteContaCodigoBanco: "033",
  },
  bancoSICREDI: {
    cedenteContaNumero: "82631",
    cedenteContaNumeroDV: "7",
    cedenteConvenioNumero: "82631",
    cedenteContaCodigoBanco: "748",
  },
  bancoSICOOB: {
    cedenteContaNumero: "832716",
    cedenteContaNumeroDV: "2",
    cedenteConvenioNumero: "274311",
    cedenteContaCodigoBanco: "756",
  },
  bancoBANRISUL: {
    cedenteContaNumero: "827364519",
    cedenteContaNumeroDV: "2",
    cedenteConvenioNumero: "827353212",
    cedenteContaCodigoBanco: "041",
  },
};

export const PLUGBOLETO_HEADERS = {
  "cnpj-sh": "12067625000150",
  "token-sh": "a60c428fbfcafa73bc8eda5e9b7fee4e",
  "cnpj-cedente": "16123920000137",
  "Content-Type": "application/json",
};

export const PLUGBOLETO_URL =
  "http://homologacao.plugboleto.com.br/api/v1/boletos/lote";

