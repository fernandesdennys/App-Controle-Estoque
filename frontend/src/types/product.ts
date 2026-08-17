export interface Produto {
  id: number;
  nome: string;
  categoriaId: number;
  unidade: string;
  quantidadeAtual: number;
  quantidadeMinima: number;
  quantidadeIdeal: number;
  ativo: boolean;
}
