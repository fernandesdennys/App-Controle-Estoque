import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header/Header";
import BottomNavigation from "../../components/layout/Footer/BottomNavigation";
import { getProdutos } from "../../services/productService";
import type { Produto } from "../../types/product";

function ShoppingList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

  /*
   * Guarda os produtos marcados como comprados.
   *
   * Por enquanto fica somente no estado da tela.
   * Depois podemos salvar isso no banco de dados.
   */
  const [produtosComprados, setProdutosComprados] = useState<number[]>([]);

  // ============================================================
  // CARREGAR PRODUTOS
  // ============================================================

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setCarregando(true);
        setErro("");

        const dados = await getProdutos();

        setProdutos(dados);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Não foi possível carregar os produtos.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarProdutos();
  }, []);

  // ============================================================
  // PRODUTOS QUE PRECISAM SER COMPRADOS
  // ============================================================

  const produtosParaComprar = useMemo(() => {
    return produtos.filter((produto) => produto.quantidadeAtual <= produto.quantidadeMinima);
  }, [produtos]);

  // ============================================================
  // QUANTIDADE DE PENDENTES
  // ============================================================

  const quantidadePendentes = produtosParaComprar.filter((produto) => !produtosComprados.includes(produto.id)).length;

  // ============================================================
  // MARCAR / DESMARCAR PRODUTO
  // ============================================================

  function alternarProduto(produtoId: number) {
    setProdutosComprados((produtosAtuais) => {
      if (produtosAtuais.includes(produtoId)) {
        return produtosAtuais.filter((id) => id !== produtoId);
      }

      return [...produtosAtuais, produtoId];
    });
  }

  // ============================================================
  // NOVA LISTA DE COMPRAS
  // ============================================================

  function abrirNovaLista() {
    console.log("Abrir nova lista de compras");
  }

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-linear-to-b from-brand-200 to-brand-100 pb-24">
        {/* =====================================================
            TÍTULO DA PÁGINA
        ====================================================== */}

        <span className="pb-1 font-bold text-brand-900">3. Lista de compras</span>

        {/* =====================================================
            HEADER
        ====================================================== */}

        <Header produtos={produtos} mostrarBotaoAdicionar onAdicionar={abrirNovaLista} />

        {/* =====================================================
            CARREGANDO
        ====================================================== */}

        {carregando && <p className="text-ink-500 mt-5 text-center text-sm">Carregando...</p>}

        {/* =====================================================
            ERRO
        ====================================================== */}

        {erro && <p className="mt-5 text-center text-sm text-danger-500">{erro}</p>}

        {!carregando && !erro && (
          <>
            {/* =================================================
                TÍTULO + PENDENTES
            ================================================= */}

            <div className="mx-4 mt-4 flex items-center justify-between">
              <h1 className="text-lg font-extrabold text-brand-900">Lista de compras</h1>

              <span className="text-[11px] font-bold text-ink-400">
                {quantidadePendentes} {quantidadePendentes === 1 ? "pendente" : "pendentes"}
              </span>
            </div>

            {/* =================================================
                AVISO AUTOMÁTICO
            ================================================= */}

            <div className="bg-accent-green-100 mx-4 mt-3 rounded-2xl bg-green-200/20 px-3 py-3 text-green-900">
              <div className="flex gap-2">
                <span className="text-accent-green-700 mt-px text-xs font-extrabold">i</span>

                <p className="text-accent-green-700 text-[10px] leading-relaxed font-semibold">
                  Produtos com estoque igual ou abaixo do mínimo entram aqui automaticamente. Ao marcar como comprado,
                  gere a entrada no estoque.
                </p>
              </div>
            </div>

            {/* =================================================
                LISTA
            ================================================= */}

            <div className="mt-4 space-y-2 px-4">
              {produtosParaComprar.length === 0 && (
                <div className="rounded-2xl bg-white px-4 py-6 text-center shadow-sm">
                  <p className="text-ink-700 text-sm font-bold">Tudo em ordem!</p>

                  <p className="mt-1 text-xs text-ink-400">Nenhum produto precisa ser comprado.</p>
                </div>
              )}

              {produtosParaComprar.map((produto) => {
                const comprado = produtosComprados.includes(produto.id);

                return (
                  <button
                    key={produto.id}
                    type="button"
                    onClick={() => alternarProduto(produto.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow-sm transition ${
                      comprado ? "opacity-60" : "hover:bg-ink-50"
                    }`}
                  >
                    {/* CHECKBOX */}

                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                        comprado ? "border-brand-900 bg-brand-900" : "border-ink-200 bg-white"
                      }`}
                    >
                      {comprado && <span className="text-[11px] font-extrabold text-white">✓</span>}
                    </span>

                    {/* PRODUTO */}

                    <div className="min-w-0 flex-1">
                      <p
                        className={`truncate text-[12px] font-extrabold ${
                          comprado ? "text-ink-400 line-through" : "text-ink-800"
                        }`}
                      >
                        {produto.nome}
                      </p>

                      <p className="mt-0.5 text-[9px] font-medium text-ink-400">
                        estoque {produto.quantidadeAtual} / min {produto.quantidadeMinima}
                      </p>
                    </div>

                    {/* TIPO */}

                    <span className="shrink-0 rounded-full bg-brand-50 px-2 py-1 text-[8px] font-extrabold text-brand-900">
                      AUTO
                    </span>
                  </button>
                );
              })}
            </div>
          </>
        )}
      </main>

      {/* =======================================================
          NAVEGAÇÃO INFERIOR
      ======================================================== */}

      <BottomNavigation />
    </div>
  );
}

export default ShoppingList;
