import React from "react";
import { FaTrash } from "react-icons/fa";
import type { Produto } from "../../types/product";
import type { Categoria } from "../../types/category";

interface ProductCardProps {
  produto: Produto;
  categoria?: Categoria;

  onAlterarQuantidade: (
    produto: Produto,
    tipo: "ENTRADA" | "SAIDA"
  ) => void;

  onRemoverProduto: (produto: Produto) => void;

  salvando: boolean;

  obterIniciaisCategoria: (nome: string) => string;
}

function ProductCard({
  produto,
  categoria,
  onAlterarQuantidade,
  onRemoverProduto,
  salvando,
  obterIniciaisCategoria,
}: ProductCardProps) {
  /*
   * Calcula a porcentagem do estoque atual
   * em relação à quantidade ideal.
   */
  const porcentagem =
    produto.quantidadeIdeal > 0
      ? Math.min(
          (produto.quantidadeAtual / produto.quantidadeIdeal) * 100,
          100
        )
      : 0;

  /*
   * Status do produto.
   */
  const status =
    produto.quantidadeAtual === 0
      ? "ESGOTADO"
      : produto.quantidadeAtual <= produto.quantidadeMinima
        ? "BAIXO"
        : "NORMAL";

  /*
   * Classes do status.
   */
  const statusClasses = {
    ESGOTADO: "bg-danger-100 text-danger-500",
    BAIXO: "bg-warning-100 text-warning-500",
    NORMAL: "bg-green-100 text-green-600",
  };

  /*
   * Classes da barra.
   */
  const barraClasses = {
    ESGOTADO: "bg-danger-500",
    BAIXO: "bg-warning-500",
    NORMAL: "bg-brand-900",
  };

  /*
   * Nome da categoria.
   */
  const nomeCategoria = categoria?.nome ?? "Sem categoria";

  /*
   * Iniciais da categoria.
   */
  const iniciaisCategoria = obterIniciaisCategoria(nomeCategoria);

  return (
    <article className="mx-3 rounded-[15px] bg-white p-3 shadow-sm">
      {/* =====================================================
          CABEÇALHO DO PRODUTO
      ====================================================== */}

      <div className="flex items-center gap-3">
        {/* INICIAIS DA CATEGORIA */}

        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-2xl bg-brand-100 text-[13px] font-bold text-brand-900">
          {iniciaisCategoria}
        </div>

        {/* PRODUTO */}

        <div className="min-w-0 flex-1">
          <h3 className="truncate text-[14px] font-bold text-ink-900">
            {produto.nome}
          </h3>

          <p className="truncate text-[10px] text-ink-400">
            {nomeCategoria}
          </p>
        </div>

        {/* STATUS */}

        <span
          className={`shrink-0 rounded-full px-3 py-1 text-[10px] font-bold ${statusClasses[status]}`}
        >
          {status}
        </span>
      </div>

      {/* =====================================================
          BARRA DE ESTOQUE
      ====================================================== */}

      <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-brand-50">
        <div
          className={`h-full rounded-full transition-all ${barraClasses[status]}`}
          style={{
            width: `${porcentagem}%`,
          }}
        />
      </div>

      {/* =====================================================
          QUANTIDADE + BOTÕES
      ====================================================== */}

      <div className="mt-3 flex items-center justify-between">
        {/* QUANTIDADE */}

        <div className="flex items-baseline gap-1">
          <span className="text-[18px] font-bold text-ink-900">
            {produto.quantidadeAtual}
          </span>

          <span className="text-[11px] font-bold text-ink-400">
            {produto.unidade}
          </span>

          <span className="ml-1 text-[11px] text-ink-400">
            · mín {produto.quantidadeMinima}
          </span>
        </div>

        {/* BOTÕES */}

        <div className="flex items-center gap-2">
          {/* MENOS */}

          <button
            type="button"
            disabled={salvando || produto.quantidadeAtual === 0}
            onClick={() => onAlterarQuantidade(produto, "SAIDA")}
            className="flex h-9 w-9 items-center justify-center rounded-[13px] bg-brand-100 text-xl font-bold text-brand-900 transition hover:bg-brand-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Consumir ${produto.nome}`}
          >
            −
          </button>

          {/* EXCLUIR */}

          <button
            type="button"
            disabled={salvando}
            onClick={() => onRemoverProduto(produto)}
            className="flex h-9 w-9 items-center justify-center rounded-[13px] text-danger-500 transition hover:bg-danger-100 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label={`Remover ${produto.nome}`}
            title={`Remover ${produto.nome}`}
          >
            <FaTrash className="text-sm" />
          </button>

          {/* MAIS */}

          <button
            type="button"
            disabled={salvando}
            onClick={() => onAlterarQuantidade(produto, "ENTRADA")}
            className="flex h-8 w-8 items-center justify-center rounded-[13px] bg-brand-900 text-xl font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
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