import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header/Header";
import BottomNavigation from "../../components/layout/Footer/BottomNavigation";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import NovaItemListaModal from "../../components/modals/NovaEntradaModal/NovaItemListaModal";
import { getProdutos, getCatalogoProdutos } from "../../services/productService";
import type { Produto } from "../../types/product";

function ShoppingList() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");
  const [produtosComprados, setProdutosComprados] = useState<number[]>([]);

  /*
   * Itens adicionados manualmente à lista,
   * fora dos que entram automaticamente
   * por estoque baixo.
   */
  const [itensManuais, setItensManuais] = useState<Produto[]>([]);

  /*
   * Catálogo de produtos disponíveis
   * para adicionar via modal.
   */
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [carregandoProdutosDisponiveis, setCarregandoProdutosDisponiveis] = useState(false);
  const [erroProdutosDisponiveis, setErroProdutosDisponiveis] = useState<string | null>(null);

  const [modalAberto, setModalAberto] = useState(false);

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

  const produtosAutomaticos = useMemo(() => {
    return produtos.filter((produto) => produto.quantidadeAtual <= produto.quantidadeMinima);
  }, [produtos]);

  /*
   * Junta os produtos automáticos
   * com os adicionados manualmente,
   * sem duplicar.
   */
  const produtosParaComprar = useMemo(() => {
    const idsAutomaticos = produtosAutomaticos.map((produto) => produto.id);

    const manuaisSemDuplicar = itensManuais.filter((produto) => !idsAutomaticos.includes(produto.id));

    return [...produtosAutomaticos, ...manuaisSemDuplicar];
  }, [produtosAutomaticos, itensManuais]);

  const idsProdutosAutomaticos = useMemo(() => produtosAutomaticos.map((produto) => produto.id), [produtosAutomaticos]);

  const quantidadePendentes = produtosParaComprar.filter((produto) => !produtosComprados.includes(produto.id)).length;

  function alternarProduto(produtoId: number) {
    setProdutosComprados((produtosAtuais) => {
      if (produtosAtuais.includes(produtoId)) {
        return produtosAtuais.filter((id) => id !== produtoId);
      }

      return [...produtosAtuais, produtoId];
    });
  }

  /*
   * Abre o modal e carrega o catálogo
   * de produtos disponíveis.
   */
  async function abrirNovaLista() {
    setModalAberto(true);

    try {
      setCarregandoProdutosDisponiveis(true);
      setErroProdutosDisponiveis(null);

      const dados = await getCatalogoProdutos();

      setProdutosDisponiveis(dados);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Não foi possível carregar os produtos disponíveis.";

      setErroProdutosDisponiveis(mensagem);
    } finally {
      setCarregandoProdutosDisponiveis(false);
    }
  }

  function fecharModal() {
    setModalAberto(false);
  }

  function adicionarItemManual(produto: Produto) {
    setItensManuais((itensAtuais) => {
      if (itensAtuais.some((item) => item.id === produto.id)) {
        return itensAtuais;
      }

      return [...itensAtuais, produto];
    });
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Sidebar />

      <main className="flex-1 bg-linear-to-b from-brand-100 to-brand-50 pb-24 md:ml-64 md:pt-4 md:pr-4 md:pb-10 md:pl-4">
        <span className="pb-1 font-bold text-brand-900">3. Lista de compras</span>

        <Header produtos={produtos} mostrarBotaoAdicionar onAdicionar={abrirNovaLista} />

        {carregando && <p className="text-ink-500 mt-5 text-center text-sm">Carregando...</p>}
        {erro && <p className="mt-5 text-center text-sm text-danger-500">{erro}</p>}

        {!carregando && !erro && (
          <div className="mx-auto max-w-5xl md:px-8 md:pt-6">
            <div className="mx-4 mt-4 flex items-center justify-between md:mx-0">
              <h1 className="text-lg font-extrabold text-brand-900">Lista de compras</h1>
              <span className="text-[11px] font-bold text-ink-400">
                {quantidadePendentes} {quantidadePendentes === 1 ? "pendente" : "pendentes"}
              </span>
            </div>

            <div className="bg-accent-green-100 mx-4 mt-3 rounded-2xl bg-green-200/20 px-3 py-3 text-green-900 md:mx-0">
              <div className="flex gap-2">
                <span className="text-accent-green-700 mt-px text-xs font-extrabold">i</span>
                <p className="text-accent-green-700 text-[10px] leading-relaxed font-semibold">
                  Produtos com estoque igual ou abaixo do mínimo entram aqui automaticamente. Ao marcar como comprado,
                  gere a entrada no estoque.
                </p>
              </div>
            </div>

            <div className="mt-4 grid gap-2 px-4 md:mx-0 md:grid-cols-2 md:px-0 lg:grid-cols-3">
              {produtosParaComprar.length === 0 && (
                <div className="rounded-2xl bg-white px-4 py-6 text-center shadow-sm md:col-span-full">
                  <p className="text-ink-700 text-sm font-bold">Tudo em ordem!</p>
                  <p className="mt-1 text-xs text-ink-400">Nenhum produto precisa ser comprado.</p>
                </div>
              )}

              {produtosParaComprar.map((produto) => {
                const comprado = produtosComprados.includes(produto.id);
                const automatico = idsProdutosAutomaticos.includes(produto.id);

                return (
                  <button
                    key={produto.id}
                    type="button"
                    onClick={() => alternarProduto(produto.id)}
                    className={`flex w-full items-center gap-3 rounded-2xl bg-white px-3 py-3 text-left shadow-sm transition ${
                      comprado ? "opacity-60" : "hover:bg-ink-50"
                    }`}
                  >
                    <span
                      className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-md border-2 transition ${
                        comprado ? "border-brand-900 bg-brand-900" : "border-ink-200 bg-white"
                      }`}
                    >
                      {comprado && <span className="text-[11px] font-extrabold text-white">✓</span>}
                    </span>

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

                    <span className="shrink-0 rounded-full bg-brand-50 px-2 py-1 text-[8px] font-extrabold text-brand-900">
                      {automatico ? "AUTO" : "MANUAL"}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </main>

      <BottomNavigation />

      {/* =======================================================
          MODAL ADICIONAR ITEM
      ======================================================== */}

      <NovaItemListaModal
        aberto={modalAberto}
        produtosDisponiveis={produtosDisponiveis}
        carregandoProdutosDisponiveis={carregandoProdutosDisponiveis}
        erroProdutosDisponiveis={erroProdutosDisponiveis}
        produtosJaNaLista={produtosParaComprar.map((produto) => produto.id)}
        onFechar={fecharModal}
        onAdicionar={(produto) => {
          adicionarItemManual(produto);
          fecharModal();
        }}
      />
    </div>
  );
}

export default ShoppingList;
