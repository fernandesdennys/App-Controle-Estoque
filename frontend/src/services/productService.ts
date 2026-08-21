import { httpClient } from "./httpClient";
import { paginaProdutosSchema } from "../schemas/productSchema";
import type { Produto } from "../types/product";


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

export async function getCatalogoProdutos(): Promise<Produto[]> {
  const response = await httpClient.get("/produtos/catalogo");

  return response.data;
}

/* export async function getProdutosDisponiveis(): Promise<Produto[]> {
  return getCatalogoProdutos();
}
 */

export async function getProdutosDisponiveis(): Promise<Produto[]> {
  const response = await httpClient.get("/produtos/disponiveis");

  return response.data;
}
export async function deletarProduto(id: number): Promise<void> {
  await httpClient.delete(`/produtos/${id}`);
}

