import React, { useState } from "react";
import { FaTimes } from "react-icons/fa";

import type { Produto } from "../../../types/product";

interface NovaEntradaModalProps {
  aberto: boolean;
  produtosDisponiveis: Produto[];
  carregandoProdutosDisponiveis: boolean;
  erroProdutosDisponiveis: string | null;
  salvando: boolean;
  onFechar: () => void;
  onAdicionar: (produtoId: number, quantidade: number) => Promise<void>;
}

function NovaEntradaModal({
  aberto,
  produtosDisponiveis,
  carregandoProdutosDisponiveis,
  erroProdutosDisponiveis,
  salvando,
  onFechar,
  onAdicionar,
}: NovaEntradaModalProps) {
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<number | null>(null);

  const [quantidade, setQuantidade] = useState("");

  const [erro, setErro] = useState("");

  if (!aberto) {
    return null;
  }

  function limparFormulario() {
    setProdutoSelecionadoId(null);
    setQuantidade("");
    setErro("");
  }

  function fechar() {
    if (salvando) {
      return;
    }

    limparFormulario();
    onFechar();
  }

  async function adicionar() {
    setErro("");

    if (produtoSelecionadoId === null) {
      setErro("Selecione um produto.");
      return;
    }

    const quantidadeNumerica = Number(quantidade);

    if (!quantidade || !Number.isFinite(quantidadeNumerica) || quantidadeNumerica <= 0) {
      setErro("Informe uma quantidade válida.");
      return;
    }

    try {
      await onAdicionar(produtoSelecionadoId, quantidadeNumerica);

      limparFormulario();
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível registrar a entrada.");
      }
    }
  }

  const produtoSelecionado = produtosDisponiveis.find((produto) => produto.id === produtoSelecionadoId);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          fechar();
        }
      }}
    >
      <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
        {/* CABEÇALHO */}

        <div className="mb-5 flex items-center justify-between">
          <div>
            <h2 className="text-lg font-extrabold text-brand-900">Nova entrada</h2>

            <p className="text-xs text-ink-400">Adicione uma quantidade ao estoque.</p>
          </div>

          <button
            type="button"
            onClick={fechar}
            disabled={salvando}
            className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-400 transition hover:bg-brand-50 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
            aria-label="Fechar"
          >
            <FaTimes />
          </button>
        </div>

        {/* PRODUTO */}

        <div className="mb-4">
          <label htmlFor="produto-entrada" className="text-ink-700 mb-1 block text-xs font-bold">
            Produto
          </label>

          <select
            id="produto-entrada"
            value={produtoSelecionadoId ?? ""}
            onChange={(event) => {
              const valor = event.target.value;

              setProdutoSelecionadoId(valor === "" ? null : Number(valor));

              setErro("");
            }}
            disabled={salvando}
            className="border-ink-200 disabled:bg-ink-50 w-full rounded-2xl border bg-white px-3 py-3 text-sm transition outline-none focus:border-brand-900 disabled:cursor-not-allowed"
          >
            <option value="">Selecione um produto</option>

            {carregandoProdutosDisponiveis && (
              <option value="" disabled>
                Carregando produtos...
              </option>
            )}

            {!carregandoProdutosDisponiveis && erroProdutosDisponiveis && (
              <option value="" disabled>
                Erro ao carregar produtos
              </option>
            )}

            {!carregandoProdutosDisponiveis &&
              !erroProdutosDisponiveis &&
              produtosDisponiveis.map((produto) => (
                <option key={produto.id} value={produto.id}>
                  {produto.nome}
                </option>
              ))}
          </select>
        </div>

        {/* QUANTIDADE */}

        <div className="mb-4">
          <label htmlFor="quantidade-entrada" className="text-ink-700 mb-1 block text-xs font-bold">
            Quantidade
          </label>

          <div className="relative">
            <input
              id="quantidade-entrada"
              type="number"
              min="0.01"
              step="0.01"
              value={quantidade}
              onChange={(event) => {
                setQuantidade(event.target.value);
                setErro("");
              }}
              disabled={salvando}
              placeholder="Ex.: 5"
              className="border-ink-200 disabled:bg-ink-50 w-full rounded-2xl border bg-white px-3 py-3 pr-14 text-sm transition outline-none focus:border-brand-900 disabled:cursor-not-allowed"
            />

            {produtoSelecionado && (
              <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-ink-400">
                {produtoSelecionado.unidade}
              </span>
            )}
          </div>
        </div>

        {/* ERRO */}

        {erro && <p className="mb-4 rounded-xl bg-danger-100 px-3 py-2 text-xs font-bold text-danger-500">{erro}</p>}

        {/* BOTÕES */}

        <div className="flex gap-2">
          <button
            type="button"
            onClick={fechar}
            disabled={salvando}
            className="border-ink-200 hover:bg-ink-50 flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-sm font-bold text-ink-600 transition disabled:cursor-not-allowed disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={adicionar}
            disabled={salvando}
            className="flex-1 cursor-pointer rounded-2xl bg-brand-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
          >
            {salvando ? "Adicionando..." : "Adicionar entrada"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default NovaEntradaModal;
