import React, { useEffect, useState } from "react";

import Header from "../../components/layout/Header/Header";
import BottomNavigation from "../../components/layout/Footer/BottomNavigation";

import { getProdutos } from "../../services/productService";
import { getMovimentacoes } from "../../services/movementService";

import type { Produto } from "../../types/product";
import type { Movimentacao } from "../../types/movement";

function History() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [movimentacoes, setMovimentacoes] = useState<Movimentacao[]>([]);

  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  useEffect(() => {
    async function carregarHistorico() {
      try {
        setCarregando(true);
        setErro("");

        /*
         * Primeiro buscamos os produtos.
         */
        const produtosDados = await getProdutos();

        setProdutos(produtosDados);

        /*
         * Depois buscamos o histórico de cada produto.
         */
        const resultados = await Promise.all(
          produtosDados.map(async (produto) => {
            try {
              return await getMovimentacoes(produto.id);
            } catch {
              return [];
            }
          })
        );

        /*
         * Junta todas as movimentações
         * em uma única lista.
         */
        const todasMovimentacoes = resultados.flat();

        /*
         * Ordena da mais recente
         * para a mais antiga.
         */
        todasMovimentacoes.sort((a, b) => new Date(b.criadoEm).getTime() - new Date(a.criadoEm).getTime());

        setMovimentacoes(todasMovimentacoes);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Não foi possível carregar o histórico.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarHistorico();
  }, []);

  /*
   * Encontra o produto relacionado
   * à movimentação.
   */
  function encontrarProduto(produtoId: number) {
    return produtos.find((produto) => produto.id === produtoId);
  }

  /*
   * Formata a data.
   *
   * Exemplo:
   * hoje, 15:21
   * ontem, 11:20
   */
  function formatarData(data: string) {
    const dataMovimentacao = new Date(data);
    const agora = new Date();

    const hoje = dataMovimentacao.toDateString() === agora.toDateString();

    const ontem = new Date(agora);

    ontem.setDate(agora.getDate() - 1);

    const foiOntem = dataMovimentacao.toDateString() === ontem.toDateString();

    const hora = dataMovimentacao.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    if (hoje) {
      return `hoje, ${hora}`;
    }

    if (foiOntem) {
      return `ontem, ${hora}`;
    }

    return `${dataMovimentacao.toLocaleDateString("pt-BR")}, ${hora}`;
  }

  /*
   * Verifica se a movimentação representa
   * uma entrada.
   */
  function isEntrada(tipo: string) {
    return tipo === "ENTRADA";
  }

  /*
   * Retorna a quantidade com o sinal.
   */
  function formatarQuantidade(movimentacao: Movimentacao) {
    const entrada = isEntrada(movimentacao.tipo);

    const quantidade = Number(movimentacao.quantidade);

    return entrada ? `+${quantidade}` : `-${quantidade}`;
  }

  /*
   * Texto apresentado abaixo do produto.
   */
  function textoMovimentacao(movimentacao: Movimentacao) {
    if (movimentacao.tipo === "ENTRADA") {
      return `Entrada · ${formatarData(movimentacao.criadoEm)}`;
    }

    if (movimentacao.tipo === "SAIDA") {
      return `Consumo · ${formatarData(movimentacao.criadoEm)}`;
    }

    if (movimentacao.tipo === "DESCARTE") {
      return `Descarte · ${formatarData(movimentacao.criadoEm)}`;
    }

    return `Ajuste · ${formatarData(movimentacao.criadoEm)}`;
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-linear-to-b from-brand-200 to-brand-100">
        {/* TÍTULO */}

        <span className="pb-1 font-bold text-brand-900">4. Histórico</span>

        {/* HEADER */}

        <Header produtos={produtos} />

        {/* CARREGANDO */}

        {carregando && <p className="text-ink-500 mt-6 text-center text-sm">Carregando movimentações...</p>}

        {/* ERRO */}

        {!carregando && erro && <p className="mt-6 text-center text-sm text-danger-500">{erro}</p>}

        {/* HISTÓRICO */}

        {!carregando && !erro && (
          <div className="px-4 pt-4 pb-24">
            <h2 className="mb-3 text-lg font-extrabold text-ink-900">Movimentações</h2>

            {movimentacoes.length === 0 ? (
              <div className="rounded-2xl bg-white p-5 text-center shadow-sm">
                <p className="text-ink-500 text-sm">Nenhuma movimentação registrada.</p>
              </div>
            ) : (
              <div className="space-y-2">
                {movimentacoes.map((movimentacao) => {
                  const produto = encontrarProduto(movimentacao.produtoId);

                  const entrada = isEntrada(movimentacao.tipo);

                  return (
                    <div
                      key={movimentacao.id}
                      className="flex min-h-14.5 items-center rounded-2xl bg-white px-3 py-2 shadow-sm"
                    >
                      {/* SETA */}

                      <div
                        className={`mr-3 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-lg font-bold ${
                          entrada ? "bg-emerald-50 text-emerald-600" : "bg-amber-50 text-amber-600"
                        }`}
                      >
                        {entrada ? "↓" : "↑"}
                      </div>

                      {/* INFORMAÇÕES */}

                      <div className="min-w-0 flex-1">
                        <p className="text-ink-800 truncate text-[12px] font-extrabold">
                          {produto?.nome ?? movimentacao.produtoNome ?? `Produto #${movimentacao.produtoId}`}
                        </p>

                        <p className="mt-px text-[10px] text-ink-400">{textoMovimentacao(movimentacao)}</p>
                      </div>

                      {/* QUANTIDADE */}

                      <span
                        className={`ml-2 text-[13px] font-extrabold ${entrada ? "text-emerald-600" : "text-amber-600"}`}
                      >
                        {formatarQuantidade(movimentacao)}
                      </span>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

export default History;
