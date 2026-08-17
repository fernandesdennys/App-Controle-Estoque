import { httpClient } from "./httpClient";
import { paginaProdutosSchema } from "../schemas/productSchema";
import type { Produto } from "../types/product";

/**
 * Busca os produtos cadastrados no backend.
 *
 * Endpoint:
 * GET /produtos
 */
export async function getProdutos(): Promise<Produto[]> {
  const response = await httpClient.get("/produtos", {
    params: {
      limite: 100,
      offset: 0,
    },
  });

  /*
   * Valida a resposta recebida do backend.
   *
   * Se o backend retornar uma estrutura diferente
   * do esperado, o Zod lançará um erro.
   */
  const resultado = paginaProdutosSchema.safeParse(response.data);

  if (!resultado.success) {
    console.error("Resposta inválida do backend ao buscar produtos:", resultado.error.issues);

    throw new Error("Os dados dos produtos recebidos do servidor são inválidos.");
  }

  return resultado.data.content;
}
