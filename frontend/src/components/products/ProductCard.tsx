import type { Produto } from "../../types/product";
import type { TipoMovimentacao } from "../../types/movement";
import React from "react";

interface ProductCardProps {
  produto: Produto;

  onMovimentacao: (produto: Produto, tipo: TipoMovimentacao) => void;
}

function ProductCard({ produto, onMovimentacao }: ProductCardProps) {
  /*
   * Calcula a porcentagem do estoque atual
   * em relação à quantidade ideal.
   */
  const porcentagem =
    produto.quantidadeIdeal > 0 ? Math.min((produto.quantidadeAtual / produto.quantidadeIdeal) * 100, 100) : 0;

  /*
   * Define o status do produto.
   */
  const status =
    produto.quantidadeAtual === 0
      ? "ESGOTADO"
      : produto.quantidadeAtual <= produto.quantidadeMinima
        ? "BAIXO"
        : "NORMAL";

  /*
   * Define as classes de acordo com o status.
   */
  const statusClasses = {
    ESGOTADO: "bg-red-50 text-red-600",
    BAIXO: "bg-yellow-50 text-yellow-700",
    NORMAL: "bg-green-50 text-green-600",
  };

  /*
   * Define a cor da barra de estoque.
   */
  const barraClasses = {
    ESGOTADO: "bg-red-500",
    BAIXO: "bg-yellow-500",
    NORMAL: "bg-brand-900",
  };

  return (
    <article className="mx-3 rounded-[15px] bg-white p-3 shadow-sm">
      {/* =========================================
          INFORMAÇÕES DO PRODUTO
          ========================================= */}
      <div className="flex items-center gap-4">
        {/* ÍCONE / INICIAIS */}
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 font-bold text-brand-900">
          {produto.nome.substring(0, 2).toUpperCase()}
        </div>

        {/* NOME E INFORMAÇÕES */}
        <div className="min-w-0 flex-1">
          <h3 className="truncate text-base font-bold text-ink-900">{produto.nome}</h3>

          <p className="text-ink-500 text-[10px]">Unidade: {produto.unidade}</p>
        </div>

        {/* STATUS */}
        <span className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${statusClasses[status]}`}>
          {status}
        </span>
      </div>

      {/* =========================================
          BARRA DE ESTOQUE
          ========================================= */}
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-brand-50">
        <div
          className={`h-full rounded-full transition-all ${barraClasses[status]}`}
          style={{
            width: `${porcentagem}%`,
          }}
        />
      </div>

      {/* =========================================
          QUANTIDADE
          ========================================= */}
      <div className="mt-3 flex items-center justify-between">
        {/* QUANTIDADE ATUAL */}
        <div className="flex items-baseline gap-1">
          <span className="text-[15px] font-bold text-ink-900">{produto.quantidadeAtual}</span>

          <span className="text-ink-500 text-[10px] font-bold">{produto.unidade}</span>

          <span className="ml-1 text-xs text-ink-400">· mín {produto.quantidadeMinima}</span>
        </div>

        {/* =====================================
            BOTÕES DE MOVIMENTAÇÃO
            ===================================== */}
        <div className="flex items-center gap-3">
          {/* SAÍDA / CONSUMO */}
          <button
            type="button"
            onClick={() => onMovimentacao(produto, "SAIDA")}
            disabled={produto.quantidadeAtual === 0}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-50 text-xl font-bold text-brand-900 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Consumir ${produto.nome}`}
          >
            −
          </button>

          {/* ENTRADA */}
          <button
            type="button"
            onClick={() => onMovimentacao(produto, "ENTRADA")}
            className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-900 text-xl font-bold text-white transition hover:bg-brand-800"
            aria-label={`Adicionar ${produto.nome}`}
          >
            +
          </button>
        </div>
      </div>
    </article>
  );
}

export default ProductCard;
