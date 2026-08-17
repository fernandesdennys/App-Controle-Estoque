import { httpClient } from "./httpClient";
import type { Movimentacao, MovimentacaoInsert } from "../types/movement";

/**
 * Registra uma nova entrada no estoque.
 *
 * Endpoint:
 * POST /produtos/{id}/entrada
 */
export async function registrarEntrada(produtoId: number, dados: MovimentacaoInsert): Promise<Movimentacao> {
  const response = await httpClient.post<Movimentacao>(`/produtos/${produtoId}/entrada`, dados);

  return response.data;
}

/**
 * Registra um consumo do estoque.
 *
 * Endpoint:
 * POST /produtos/{id}/consumo
 */
export async function registrarConsumo(produtoId: number, dados: MovimentacaoInsert): Promise<Movimentacao> {
  const response = await httpClient.post<Movimentacao>(`/produtos/${produtoId}/consumo`, dados);

  return response.data;
}
