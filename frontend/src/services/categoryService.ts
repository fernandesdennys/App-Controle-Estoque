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
  // Fazemos as duas requisições em paralelo.
  //
  // Isso é melhor do que:
  //
  // await getCategorias();
  // await getProdutosAbaixoDoMinimo();
  //
  // porque não precisamos esperar uma terminar
  // para começar a outra.
  const [categorias, produtos] = await Promise.all([getCategorias(), getProdutosAbaixoDoMinimo()]);

  /**
   * Vamos manter somente as categorias que possuem
   * pelo menos um produto abaixo do mínimo.
   */
  const categoriasComAtencao = categorias.filter((categoria) =>
    produtos.some((produto) => produto.categoriaId === categoria.id)
  );

  /**
   * Transformamos cada categoria no formato que
   * o CategoryCard precisa.
   */
  return categoriasComAtencao.map((categoria) => {
    // Produtos de atenção pertencentes a esta categoria.
    const produtosDaCategoria = produtos.filter((produto) => produto.categoriaId === categoria.id);

    /**
     * Número exibido no card.
     *
     * Exemplo:
     *
     * Mercearia possui:
     * - Arroz
     * - Feijão
     *
     * quantidade = 2
     */
    const quantidade = produtosDaCategoria.length;

    /**
     * Calculamos o percentual de estoque de cada produto.
     *
     * Exemplo:
     *
     * Arroz:
     * 5 atual / 10 ideal = 50%
     *
     * Feijão:
     * 3 atual / 5 ideal = 60%
     *
     * Média:
     * (50 + 60) / 2 = 55%
     */
    const percentuais = produtosDaCategoria.map((produto) => {
      // Evita divisão por zero.
      if (produto.quantidadeIdeal <= 0) {
        return 0;
      }

      return Math.min((produto.quantidadeAtual / produto.quantidadeIdeal) * 100, 100);
    });

    /**
     * Soma os percentuais.
     */
    const somaPercentuais = percentuais.reduce((total, percentual) => total + percentual, 0);

    /**
     * Calcula a média.
     *
     * Como sabemos que existe pelo menos um produto
     * nesta categoria, quantidade será maior que zero.
     */
    const porcentagem = quantidade > 0 ? somaPercentuais / quantidade : 0;

    return {
      id: categoria.id,
      nome: categoria.nome,
      quantidade,
      porcentagem,
    };
  });
}
