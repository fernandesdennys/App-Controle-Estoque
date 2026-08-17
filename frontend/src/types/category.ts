/**
 * Representa uma categoria exatamente como
 * ela vem do backend.
 *
 * O CategoriaDTO do Java possui:
 *
 * Integer id
 * String nome
 */
export interface Categoria {
  id: number;
  nome: string;
}

/**
 * Representa uma categoria já preparada
 * para ser exibida no Dashboard.
 */
export interface CategoriaResumo {
  id: number;
  nome: string;

  /**
   * Quantidade de produtos que precisam
   * de atenção dentro dessa categoria.
   */
  quantidade: number;

  /**
   * Percentual de preenchimento do estoque.
   *
   * Exemplo:
   * 75 = estoque 75% preenchido.
   */
  porcentagem: number;
}
