import { httpClient } from "./httpClient";
import type { Categoria, CategoriaResumo } from "../types/category";

/**
 * Busca todas as categorias cadastradas no backend.
 *
 * Endpoint:
 * GET /categorias
 */
export async function getCategorias(): Promise<Categoria[]> {
  const response = await httpClient.get<Categoria[]>("/categorias");

  return response.data;
}

/**
 * Estrutura do ProdutoDTO que recebemos do backend.
 *
 * Não precisamos criar um arquivo separado para isso
 * neste primeiro momento porque esse tipo é utilizado
 * apenas neste service.
 */
interface Produto {
  id: number;
  nome: string;
  categoriaId: number;

  // BigDecimal no Java chega como number no JSON.
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeIdeal: number;

  ativo: boolean;
}

/**
 * Estrutura retornada pelo Spring quando usamos Page<ProdutoDTO>.
 *
 * O Spring Data normalmente retorna algo semelhante a:
 *
 * {
 *   "content": [...],
 *   "totalElements": 10,
 *   "totalPages": 1,
 *   ...
 * }
 */
interface PaginaProdutos {
  content: Produto[];
  totalElements: number;
  totalPages: number;
  size: number;
  number: number;
}

/**
 * Busca os produtos que estão abaixo do estoque mínimo.
 *
 * Endpoint:
 * GET /produtos?abaixo_minimo=true
 */
async function getProdutosAbaixoDoMinimo(): Promise<Produto[]> {
  const response = await httpClient.get<PaginaProdutos>("/produtos", {
    params: {
      abaixo_minimo: true,

      // Estamos usando um limite maior para diminuir
      // a chance de deixar produtos de fora da análise.
      limite: 100,
      offset: 0,
    },
  });

  return response.data.content;
}

/**
 * Busca as categorias e os produtos que precisam de atenção
 * e transforma tudo no formato que o Dashboard precisa.
 */
export async function getCategoriasResumo(): Promise<CategoriaResumo[]> {
  const [categorias, produtos] = await Promise.all([getCategorias(), getProdutosAbaixoDoMinimo()]);

  console.log("CATEGORIAS DO BACKEND:", categorias);
  console.log("PRODUTOS ABAIXO DO MÍNIMO:", produtos);

  const categoriasComAtencao = categorias.filter((categoria) =>
    produtos.some((produto) => produto.categoriaId === categoria.id)
  );

  console.log("CATEGORIAS COM ATENÇÃO:", categoriasComAtencao);

  return categoriasComAtencao.map((categoria) => {
    const produtosDaCategoria = produtos.filter((produto) => produto.categoriaId === categoria.id);

    const quantidade = produtosDaCategoria.length;

    const percentuais = produtosDaCategoria.map((produto) => {
      if (produto.quantidadeIdeal <= 0) {
        return 0;
      }

      return Math.min((produto.quantidadeAtual / produto.quantidadeIdeal) * 100, 100);
    });

    const somaPercentuais = percentuais.reduce((total, percentual) => total + percentual, 0);

    const porcentagem = quantidade > 0 ? somaPercentuais / quantidade : 0;

    return {
      id: categoria.id,
      nome: categoria.nome,
      quantidade,
      porcentagem,
    };
  });
}
