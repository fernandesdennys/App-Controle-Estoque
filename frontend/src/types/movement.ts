export type TipoMovimentacao = "ENTRADA" | "SAIDA" | "DESCARTE" | "AJUSTE";

export interface Movimentacao {
  id: number;
  produtoId: number;
  produtoNome?: string;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao: string;
  criadoEm: string;
}

export interface MovimentacaoInsert {
  quantidade: number;
  observacao?: string;
}
