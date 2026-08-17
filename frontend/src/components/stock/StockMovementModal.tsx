import React, { useEffect, useState } from "react";
import type { Produto } from "../../types/product";
import type { TipoMovimentacao } from "../../types/movement";

interface StockMovementModalProps {
  produto: Produto;
  tipo: TipoMovimentacao;
  aberto: boolean;
  carregando?: boolean;
  onFechar: () => void;
  onConfirmar: (quantidade: number, observacao: string) => void;
}

function StockMovementModal({
  produto,
  tipo,
  aberto,
  carregando = false,
  onFechar,
  onConfirmar,
}: StockMovementModalProps) {
  const [quantidade, setQuantidade] = useState("");
  const [observacao, setObservacao] = useState("");

  /*
   * Limpa os campos sempre que o modal for aberto
   * para uma nova movimentação.
   */
  useEffect(() => {
    if (aberto) {
      setQuantidade("");
      setObservacao("");
    }
  }, [aberto]);

  /*
   * Não renderiza nada quando o modal está fechado.
   */
  if (!aberto) {
    return null;
  }

  const entrada = tipo === "ENTRADA";

  const titulo = entrada ? "Nova entrada" : "Registrar consumo";

  const descricao = entrada ? "Adicionar quantidade ao estoque" : "Retirar quantidade do estoque";

  /*
   * Validação básica antes de enviar.
   */
  const confirmar = () => {
    const valor = Number(quantidade);

    if (!Number.isFinite(valor) || valor <= 0) {
      return;
    }

    if (!entrada && valor > produto.quantidadeAtual) {
      return;
    }

    onConfirmar(valor, observacao.trim());
  };

  const quantidadeValida =
    Number.isFinite(Number(quantidade)) &&
    Number(quantidade) > 0 &&
    (entrada || Number(quantidade) <= produto.quantidadeAtual);

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-3" onClick={onFechar}>
      <div
        className="w-full max-w-md rounded-[24px] bg-white p-5 shadow-xl"
        onClick={(event) => event.stopPropagation()}
      >
        {/* CABEÇALHO */}
        <div className="mb-5 flex items-start justify-between">
          <div>
            <h2 className="text-lg font-bold text-ink-900">{titulo}</h2>

            <p className="text-ink-500 mt-1 text-xs">{descricao}</p>
          </div>

          <button
            type="button"
            onClick={onFechar}
            disabled={carregando}
            className="text-ink-700 flex h-8 w-8 items-center justify-center rounded-full bg-brand-50 text-lg transition hover:bg-brand-100 disabled:opacity-50"
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        {/* PRODUTO */}
        <div className="mb-4 rounded-2xl bg-brand-50 p-3">
          <p className="text-sm font-bold text-brand-900">{produto.nome}</p>

          <p className="text-ink-500 mt-1 text-[11px]">
            Estoque atual: {produto.quantidadeAtual} {produto.unidade}
          </p>
        </div>

        {/* QUANTIDADE */}
        <div className="mb-4">
          <label htmlFor="quantidade" className="text-ink-700 mb-1 block text-xs font-bold">
            Quantidade
          </label>

          <div className="border-ink-300 flex items-center rounded-xl border px-3">
            <input
              id="quantidade"
              type="number"
              min="0.001"
              step="0.001"
              value={quantidade}
              onChange={(event) => setQuantidade(event.target.value)}
              disabled={carregando}
              placeholder="Ex.: 5"
              className="w-full bg-transparent py-3 text-sm outline-none"
              autoFocus
            />

            <span className="text-ink-500 text-xs font-bold">{produto.unidade}</span>
          </div>

          {!entrada && quantidade !== "" && Number(quantidade) > produto.quantidadeAtual && (
            <p className="mt-1 text-[11px] text-red-600">A quantidade não pode ser maior que o estoque atual.</p>
          )}
        </div>

        {/* OBSERVAÇÃO */}
        <div className="mb-5">
          <label htmlFor="observacao" className="text-ink-700 mb-1 block text-xs font-bold">
            Observação
          </label>

          <textarea
            id="observacao"
            value={observacao}
            onChange={(event) => setObservacao(event.target.value)}
            disabled={carregando}
            maxLength={255}
            rows={3}
            placeholder="Opcional"
            className="border-ink-300 w-full resize-none rounded-xl border bg-transparent p-3 text-sm outline-none focus:border-brand-900"
          />

          <p className="mt-1 text-right text-[10px] text-ink-400">{observacao.length}/255</p>
        </div>

        {/* BOTÕES */}
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onFechar}
            disabled={carregando}
            className="flex-1 rounded-xl bg-brand-50 py-3 text-sm font-bold text-brand-900 transition hover:bg-brand-100 disabled:opacity-50"
          >
            Cancelar
          </button>

          <button
            type="button"
            onClick={confirmar}
            disabled={!quantidadeValida || carregando}
            className="flex-1 rounded-xl bg-brand-900 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {carregando ? "Salvando..." : "Confirmar"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default StockMovementModal;
