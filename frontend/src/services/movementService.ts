import { httpClient } from "./httpClient";
import type { Movimentacao, MovimentacaoInsert } from "../types/movement";

/**
 * Registra uma nova entrada no estoque.
 */
export async function registrarEntrada(produtoId: number, dados: MovimentacaoInsert): Promise<Movimentacao> {
  const response = await httpClient.post<Movimentacao>(`/produtos/${produtoId}/entrada`, dados);

  return response.data;
}

/**
 * Registra um consumo do estoque.
 */
export async function registrarConsumo(produtoId: number, dados: MovimentacaoInsert): Promise<Movimentacao> {
  const response = await httpClient.post<Movimentacao>(`/produtos/${produtoId}/consumo`, dados);

  return response.data;
}

/**
 * Busca o histórico de movimentações de um produto.
 */
export async function getMovimentacoes(produtoId: number): Promise<Movimentacao[]> {
  const response = await httpClient.get(`/produtos/${produtoId}/movimentacoes`, {
    params: {
      page: 0,
      size: 100,
      ordenarPor: "criado_em",
    },
  });

  return response.data.content;
}
