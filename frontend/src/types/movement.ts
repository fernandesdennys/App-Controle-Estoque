/**
 * Tipos de movimentação disponíveis no backend.
 */
export type TipoMovimentacao = "ENTRADA" | "SAIDA" | "AJUSTE" | "DESCARTE";

/**
 * Dados enviados pelo frontend
 * ao registrar uma movimentação.
 *
 * Corresponde ao MovimentacaoInsertDTO
 * do backend.
 */
export interface MovimentacaoInsert {
  quantidade: number;
  observacao?: string;
}

/**
 * Movimentação retornada pelo backend.
 *
 * Corresponde ao MovimentacaoDTO.
 */
export interface Movimentacao {
  id: number;
  produtoId: number;
  tipo: TipoMovimentacao;
  quantidade: number;
  observacao?: string;
  criadoEm: string;
}
