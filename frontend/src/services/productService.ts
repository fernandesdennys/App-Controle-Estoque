import { httpClient } from "./httpClient";
import { paginaProdutosSchema } from "../schemas/productSchema";
import type { Produto } from "../types/product";

/**
 * ============================================================
 * PRODUTOS DO ESTOQUE
 * ============================================================
 *
 * Busca somente os produtos ativos no estoque.
 *
 * Endpoint:
 * GET /produtos
 *
 * Usado para:
 *
 * - Exibir produtos no estoque
 * - "Precisa de atenção"
 * - Atualizar a quantidade exibida no Dashboard
 */
export async function getProdutos(): Promise<Produto[]> {
  const response = await httpClient.get("/produtos", {
    params: {
      limite: 100,
      offset: 0,
    },
  });

  const resultado = paginaProdutosSchema.safeParse(response.data);

  if (!resultado.success) {
    console.error(
      "Resposta inválida do backend ao buscar produtos:",
      resultado.error.issues,
    );

    throw new Error(
      "Os dados dos produtos recebidos do servidor são inválidos.",
    );
  }

  return resultado.data.content;
}

/**
 * ============================================================
 * CATÁLOGO DE PRODUTOS
 * ============================================================
 *
 * Busca TODOS os produtos cadastrados.
 *
 * Inclui:
 *
 * - produtos ativos
 * - produtos inativos
 * - produtos com estoque zerado
 *
 * Endpoint:
 * GET /produtos/catalogo
 *
 * Usado para:
 *
 * - Nova entrada no estoque
 * - Selecionar produtos que ainda não possuem estoque
 */
export async function getCatalogoProdutos(): Promise<Produto[]> {
  const response = await httpClient.get("/produtos/catalogo");

  return response.data;
}

/**
 * ============================================================
 * PRODUTOS DISPONÍVEIS PARA NOVA ENTRADA
 * ============================================================
 *
 * Busca os produtos que podem receber uma nova entrada
 * no estoque.
 *
 * Diferente de getProdutos(), essa função NÃO depende
 * da existência de estoque.
 *
 * Dessa forma:
 *
 * Produto A → estoque 10 → aparece
 * Produto B → estoque 0  → também aparece
 *
 * Endpoint utilizado:
 * GET /produtos/catalogo
 */
export async function getProdutosDisponiveis(): Promise<Produto[]> {
  return getCatalogoProdutos();
}

/**
 * ============================================================
 * REMOVER PRODUTO
 * ============================================================
 *
 * Remove o produto do estoque.
 *
 * Endpoint:
 * DELETE /produtos/{id}
 */
export async function deletarProduto(id: number): Promise<void> {
  await httpClient.delete(`/produtos/${id}`);
}

