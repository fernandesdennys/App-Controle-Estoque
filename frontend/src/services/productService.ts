import { httpClient } from "./httpClient";
import type { Produto } from "../types/product";

/**
 * Representa a página de produtos
 * retornada pelo Spring Data.
 */
interface PaginaProdutos {
  content: Produto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Busca os produtos cadastrados no backend.
 *
 * Endpoint:
 * GET /produtos
 */
export async function getProdutos(): Promise<Produto[]> {
  const response = await httpClient.get<PaginaProdutos>("/produtos", {
    params: {
      limite: 100,
      offset: 0,
    },
  });

  return response.data.content;
}
