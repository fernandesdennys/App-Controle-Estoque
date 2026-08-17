export type TipoMovimentacao = "ENTRADA" | "SAIDA";

export interface MovimentacaoInsert {
  quantidade: number;
  observacao?: string;
}

export interface Movimentacao {
  id: number;
  produtoId: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string;
  dataMovimentacao?: string;
}