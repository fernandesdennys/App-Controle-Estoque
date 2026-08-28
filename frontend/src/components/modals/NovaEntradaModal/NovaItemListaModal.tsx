import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

import type { Produto } from "../../../types/product";

interface NovaItemListaModalProps {
  aberto: boolean;
  produtosDisponiveis: Produto[];
  carregandoProdutosDisponiveis: boolean;
  erroProdutosDisponiveis: string | null;
  produtosJaNaLista: number[];
  onFechar: () => void;
  onAdicionar: (produto: Produto) => void;
}

function NovaItemListaModal({
  aberto,
  produtosDisponiveis,
  carregandoProdutosDisponiveis,
  erroProdutosDisponiveis,
  produtosJaNaLista,
  onFechar,
  onAdicionar,
}: NovaItemListaModalProps) {
  const [busca, setBusca] = useState("");

  if (!aberto) {
    return null;
  }

  function fechar() {
    setBusca("");
    onFechar();
  }

  const produtosFiltrados = produtosDisponiveis.filter((produto) =>
    produto.nome.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          fechar();
        }
      }}
    >
      <div className="flex max-h-[80vh] w-full max-w-md flex-col rounded-3xl bg-white p-5 shadow-xl">
        {/* CABEÇALHO */}

        <div className="mb-4 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-900">Adicionar à lista</h2>

            <p className="text-xs text-ink-400">Escolha um produto para incluir na lista de compras.</p>
          </div>

          <button
            type="button"
            onClick={fechar}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-400 transition hover:bg-brand-50 hover:text-ink-900"
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>

        {/* BUSCA */}

        <input
          type="text"
          value={busca}
          onChange={(event) => setBusca(event.target.value)}
          placeholder="Buscar produto"
          className="border-ink-200 mb-3 w-full rounded-2xl border bg-white px-3 py-2.5 text-sm transition outline-none focus:border-brand-900"
        />

        {/* LISTA */}

        <div className="-mx-1 flex-1 overflow-y-auto px-1">
          {carregandoProdutosDisponiveis && (
            <p className="text-ink-500 py-4 text-center text-sm">Carregando produtos...</p>
          )}

          {!carregandoProdutosDisponiveis && erroProdutosDisponiveis && (
            <p className="py-4 text-center text-sm text-danger-500">{erroProdutosDisponiveis}</p>
          )}

          {!carregandoProdutosDisponiveis && !erroProdutosDisponiveis && produtosFiltrados.length === 0 && (
            <p className="text-ink-500 py-4 text-center text-sm">Nenhum produto encontrado.</p>
          )}

          {!carregandoProdutosDisponiveis &&
            !erroProdutosDisponiveis &&
            produtosFiltrados.map((produto) => {
              const jaAdicionado = produtosJaNaLista.includes(produto.id);

              return (
                <button
                  key={produto.id}
                  type="button"
                  disabled={jaAdicionado}
                  onClick={() => onAdicionar(produto)}
                  className={`flex w-full items-center justify-between gap-3 rounded-2xl px-3 py-2.5 text-left transition ${
                    jaAdicionado ? "cursor-not-allowed opacity-40" : "hover:bg-brand-50"
                  }`}
                >
                  <div className="min-w-0">
                    <p className="text-ink-800 truncate text-[13px] font-bold">{produto.nome}</p>

                    <p className="mt-0.5 text-[10px] text-ink-400">
                      estoque {produto.quantidadeAtual} {produto.unidade}
                    </p>
                  </div>

                  <span className="shrink-0 text-xs font-bold text-brand-900">
                    {jaAdicionado ? "Na lista" : "+ Adicionar"}
                  </span>
                </button>
              );
            })}
        </div>
      </div>
    </div>
  );
}

export default NovaItemListaModal;
