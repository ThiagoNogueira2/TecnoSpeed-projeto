import { RegistroBanco } from "../types/banco.types";
import { API_BASE_URL } from "../constants/bancos.constants";

export async function buscarRegistros(): Promise<RegistroBanco[]> {
  const response = await fetch(`${API_BASE_URL}/registros`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar registros: ${response.statusText}`);
  }

  return response.json();
}

export async function buscarRegistrosPorBanco(
  nomeBanco: string
): Promise<RegistroBanco[]> {
  const response = await fetch(`${API_BASE_URL}/registros/${nomeBanco}`);

  if (!response.ok) {
    throw new Error(`Erro ao buscar registros do banco ${nomeBanco}`);
  }

  return response.json();
}

