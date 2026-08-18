import React, { useEffect, useState } from "react";
import BottomNavigation from "../../components/layout/Footer/BottomNavigation";
import Header from "../../components/layout/Header/Header";
import { FaPlus, FaBars, FaTimes } from "react-icons/fa";
import CategoryCard from "../../components/ui/CategoryCard/CategoryCard";

import type { Produto } from "../../types/product";
import type { CategoriaResumo } from "../../types/category";

import {
  getProdutos,
  getProdutosDisponiveis,
} from "../../services/productService";

import { getCategoriasResumo } from "../../services/categoryService";
import { registrarEntrada } from "../../services/movementService";

function Dashboard() {
  // ============================================================
  // DATA ATUAL
  // ============================================================

  const dataAtual = new Date();

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const meses = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  const dataFormatada = `${dias[dataAtual.getDay()]}, ${dataAtual.getDate()} ${
    meses[dataAtual.getMonth()]
  }`;

  // ============================================================
  // PRODUTOS DO ESTOQUE
  // ============================================================

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [erroProdutos, setErroProdutos] = useState<string | null>(null);

  /*
   * Essa lista representa os produtos que estão sendo
   * utilizados para exibir informações do estoque.
   */
  const produtosEmEstoque = produtos.filter(
    (produto) => produto.quantidadeAtual > 0,
  );

  // ============================================================
  // PRODUTOS DISPONÍVEIS PARA NOVA ENTRADA
  // ============================================================

  /*
   * Essa é uma lista separada da lista do estoque.
   *
   * Aqui devem ficar TODOS os produtos cadastrados,
   * mesmo aqueles que ainda possuem quantidade 0.
   *
   * Ela será utilizada somente no modal "Nova entrada".
   */
  const [produtosDisponiveis, setProdutosDisponiveis] = useState<Produto[]>([]);
  const [carregandoProdutosDisponiveis, setCarregandoProdutosDisponiveis] =
    useState(true);
  const [erroProdutosDisponiveis, setErroProdutosDisponiveis] = useState<
    string | null
  >(null);

  // ============================================================
  // CATEGORIAS
  // ============================================================

  const [categorias, setCategorias] = useState<CategoriaResumo[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState<string | null>(null);

  // ============================================================
  // MODAL - NOVA ENTRADA
  // ============================================================

  const [modalEntradaAberto, setModalEntradaAberto] = useState(false);
  const [produtoSelecionadoId, setProdutoSelecionadoId] = useState<
    number | null
  >(null);
  const [quantidadeEntrada, setQuantidadeEntrada] = useState("");
  const [salvandoEntrada, setSalvandoEntrada] = useState(false);
  const [erroEntrada, setErroEntrada] = useState("");

  // ============================================================
  // BUSCAR PRODUTOS DO ESTOQUE
  // ============================================================

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setCarregandoProdutos(true);
        setErroProdutos(null);

        const dados = await getProdutos();

        setProdutos(dados);
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os produtos.";

        setErroProdutos(mensagem);
      } finally {
        setCarregandoProdutos(false);
      }
    }

    carregarProdutos();
  }, []);

  // ============================================================
  // BUSCAR PRODUTOS DISPONÍVEIS
  // ============================================================

  useEffect(() => {
    async function carregarProdutosDisponiveis() {
      try {
        setCarregandoProdutosDisponiveis(true);
        setErroProdutosDisponiveis(null);

        const dados = await getProdutosDisponiveis();

        setProdutosDisponiveis(dados);
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar os produtos disponíveis.";

        setErroProdutosDisponiveis(mensagem);
      } finally {
        setCarregandoProdutosDisponiveis(false);
      }
    }

    carregarProdutosDisponiveis();
  }, []);

  // ============================================================
  // BUSCAR CATEGORIAS
  // ============================================================

  useEffect(() => {
    async function carregarCategorias() {
      try {
        setCarregandoCategorias(true);
        setErroCategorias(null);

        const dados = await getCategoriasResumo();

        setCategorias(dados);
      } catch (error) {
        const mensagem =
          error instanceof Error
            ? error.message
            : "Não foi possível carregar as categorias.";

        setErroCategorias(mensagem);
      } finally {
        setCarregandoCategorias(false);
      }
    }

    carregarCategorias();
  }, []);

  // ============================================================
  // PRODUTOS QUE PRECISAM DE ATENÇÃO
  // ============================================================

  const produtosAtencao = produtosEmEstoque.filter(
    (produto) => produto.quantidadeAtual <= produto.quantidadeMinima,
  );

  // ============================================================
  // STATUS
  // ============================================================

  const statusStyles = {
    BAIXO: "text-warning-500 bg-warning-100",
    ESGOTADO: "text-danger-500 bg-danger-100",
  };

  function obterStatus(produto: Produto) {
    if (produto.quantidadeAtual === 0) {
      return "ESGOTADO";
    }

    if (produto.quantidadeAtual <= produto.quantidadeMinima) {
      return "BAIXO";
    }

    return "NORMAL";
  }

  // ============================================================
  // ABRIR MODAL
  // ============================================================

  function abrirModalEntrada() {
    setProdutoSelecionadoId(null);
    setQuantidadeEntrada("");
    setErroEntrada("");
    setModalEntradaAberto(true);
  }

  // ============================================================
  // FECHAR MODAL
  // ============================================================

  function fecharModalEntrada() {
    if (salvandoEntrada) {
      return;
    }

    setModalEntradaAberto(false);
    setProdutoSelecionadoId(null);
    setQuantidadeEntrada("");
    setErroEntrada("");
  }

  // ============================================================
  // REGISTRAR NOVA ENTRADA
  // ============================================================

  async function adicionarEntrada() {
    setErroEntrada("");

    if (produtoSelecionadoId === null) {
      setErroEntrada("Selecione um produto.");
      return;
    }

    const quantidade = Number(quantidadeEntrada);

    if (
      !quantidadeEntrada ||
      !Number.isFinite(quantidade) ||
      quantidade <= 0
    ) {
      setErroEntrada("Informe uma quantidade válida.");
      return;
    }

    try {
      setSalvandoEntrada(true);

      await registrarEntrada(produtoSelecionadoId, {
        quantidade,
      });

      /*
       * Depois de registrar a entrada,
       * buscamos novamente os produtos do estoque.
       */
      const produtosAtualizados = await getProdutos();

      setProdutos(produtosAtualizados);

      /*
       * Fecha o modal após o sucesso.
       */
      setModalEntradaAberto(false);
      setProdutoSelecionadoId(null);
      setQuantidadeEntrada("");
      setErroEntrada("");
    } catch (error) {
      if (error instanceof Error) {
        setErroEntrada(error.message);
      } else {
        setErroEntrada("Não foi possível registrar a entrada.");
      }
    } finally {
      setSalvandoEntrada(false);
    }
  }

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================

  return (
    <div id="dashboard" className="flex min-h-screen flex-col">
      <main
        id="dashboard-main"
        className="flex-1 bg-linear-to-b from-brand-100 to-brand-50 pb-24"
      >
        <span
          id="dashboard-breadcrumb"
          className="pb-1 font-bold text-brand-900"
        >
          1. Início
        </span>

        <Header produtos={produtos} />

        {/* =====================================================
            SAUDAÇÃO
        ====================================================== */}

        <div
          id="dashboard-welcome"
          className="my-3 flex items-center justify-around"
        >
          <h1
            id="dashboard-greeting"
            className="text-[22px] font-extrabold text-brand-900"
          >
            Olá, Família Souza
          </h1>

          <span
            id="dashboard-date"
            className="mt-2 text-[12px] font-bold text-brand-500"
          >
            {dataFormatada}
          </span>
        </div>

        {/* =====================================================
            PRECISA DE ATENÇÃO
        ====================================================== */}

        <div className="mx-5 flex justify-between pb-3">
          <div id="attention-title-container">
            <h1 id="attention-title" className="font-bold">
              Precisa de atenção
            </h1>
          </div>

          <div id="attention-count-container">
            <p
              id="attention-count"
              className="flex w-15 justify-center rounded-2xl bg-danger-100 px-1 text-[14px] font-bold text-danger-400"
            >
              {produtosAtencao.length}{" "}
              {produtosAtencao.length === 1 ? "item" : "itens"}
            </p>
          </div>
        </div>

        {/* =====================================================
            LISTA DE PRODUTOS
        ====================================================== */}

        <div id="attention-section" className="mx-5">
          <div
            id="attention-product-list"
            className="rounded-2xl bg-white p-3 shadow-sm"
          >
            {carregandoProdutos && (
              <p className="text-ink-500 py-2 text-center text-sm">
                Carregando estoque...
              </p>
            )}

            {!carregandoProdutos && erroProdutos && (
              <p className="py-2 text-center text-sm text-danger-500">
                {erroProdutos}
              </p>
            )}

            {!carregandoProdutos &&
              !erroProdutos &&
              produtosAtencao.length === 0 && (
                <p className="text-ink-500 py-2 text-center text-sm">
                  Nenhum produto precisa de atenção.
                </p>
              )}

            {!carregandoProdutos &&
              !erroProdutos &&
              produtosAtencao.map((produto) => {
                const status = obterStatus(produto);

                return (
                  <div
                    id={`attention-product-${produto.id}`}
                    key={produto.id}
                    className="grid grid-cols-[40px_1fr_auto] items-center gap-3 py-2 first:pt-0 last:pb-0"
                  >
                    {/* ÍCONE */}

                    <div
                      id={`product-icon-${produto.id}`}
                      className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700"
                    >
                      {produto.nome.substring(0, 2).toUpperCase()}
                    </div>

                    {/* INFORMAÇÕES */}

                    <div id={`product-info-${produto.id}`}>
                      <h2 className="text-[14px] leading-tight font-bold">
                        {produto.nome}
                      </h2>

                      <p className="text-[10px] text-gray-500">
                        Estoque: {produto.quantidadeAtual} {produto.unidade} ·
                        mín: {produto.quantidadeMinima}
                      </p>
                    </div>

                    {/* STATUS */}

                    <div
                      id={`product-status-${produto.id}`}
                      className={`rounded-2xl px-3 py-1 text-xs font-bold whitespace-nowrap ${
                        statusStyles[status as keyof typeof statusStyles]
                      }`}
                    >
                      {status}
                    </div>
                  </div>
                );
              })}
          </div>
        </div>

        {/* =====================================================
            BOTÃO - LISTA DE COMPRAS
        ====================================================== */}

        <div id="attention-actions">
          <button
            type="button"
            className="m-auto mt-3 flex w-[90%] cursor-pointer items-center justify-center rounded-full border bg-brand-100 py-2 font-bold text-brand-800 hover:bg-brand-200 hover:shadow-sm"
          >
            Ver lista de compras
          </button>
        </div>

        {/* =====================================================
            AÇÕES
        ====================================================== */}

        <div className="mx-2 my-4 flex gap-2">
          {/* NOVA ENTRADA */}

          <button
            type="button"
            onClick={abrirModalEntrada}
            className="text=[12px] flex h-24 flex-1 cursor-pointer flex-col items-start justify-between rounded-2xl bg-accent-lime-300 p-3 font-bold text-ink-900 hover:bg-accent-lime-500"
          >
            <FaPlus />

            <p className="text-left leading-tight">
              Nova entrada
              <br />
              no estoque
            </p>
          </button>

          {/* REGISTRAR CONSUMO */}

          <button
            type="button"
            className="flex h-24 flex-1 cursor-pointer flex-col items-start justify-between rounded-2xl bg-accent-blue-400 p-3 font-bold text-surface-card hover:bg-accent-blue-600"
          >
            <FaBars />

            <p className="text-left leading-tight">
              Registrar
              <br />
              consumo
            </p>
          </button>
        </div>

        {/* =====================================================
            POR CATEGORIA
        ====================================================== */}

        <div className="font-bold text-ink-900">
          <h1 className="mx-3">Por categoria</h1>

          <div className="mx-2 my-4 overflow-x-auto pb-3">
            <div className="flex gap-2">
              {carregandoCategorias && (
                <p className="text-ink-500 text-sm">
                  Carregando categorias...
                </p>
              )}

              {!carregandoCategorias && erroCategorias && (
                <p className="text-sm text-danger-500">{erroCategorias}</p>
              )}

              {!carregandoCategorias &&
                !erroCategorias &&
                categorias.length === 0 && (
                  <p className="text-ink-500 text-sm">
                    Nenhuma categoria precisa de atenção.
                  </p>
                )}

              {!carregandoCategorias &&
                !erroCategorias &&
                categorias.map((categoria) => (
                  <CategoryCard key={categoria.id} categoria={categoria} />
                ))}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />

      {/* =====================================================
          MODAL - NOVA ENTRADA
      ====================================================== */}

      {modalEntradaAberto && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              fecharModalEntrada();
            }
          }}
        >
          <div className="w-full max-w-md rounded-3xl bg-white p-5 shadow-xl">
            {/* CABEÇALHO */}

            <div className="mb-5 flex items-center justify-between">
              <div>
                <h2 className="text-lg font-extrabold text-brand-900">
                  Nova entrada
                </h2>

                <p className="text-xs text-ink-400">
                  Adicione uma quantidade ao estoque.
                </p>
              </div>

              <button
                type="button"
                onClick={fecharModalEntrada}
                disabled={salvandoEntrada}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full text-ink-400 transition hover:bg-brand-50 hover:text-ink-900 disabled:cursor-not-allowed disabled:opacity-40"
                aria-label="Fechar"
              >
                <FaTimes />
              </button>
            </div>

            {/* PRODUTO */}

            <div className="mb-4">
              <label
                htmlFor="produto-entrada"
                className="text-ink-700 mb-1 block text-xs font-bold"
              >
                Produto
              </label>

              <select
                id="produto-entrada"
                value={produtoSelecionadoId ?? ""}
                onChange={(event) => {
                  const valor = event.target.value;

                  setProdutoSelecionadoId(
                    valor === "" ? null : Number(valor),
                  );

                  setErroEntrada("");
                }}
                disabled={salvandoEntrada}
                className="border-ink-200 disabled:bg-ink-50 w-full rounded-2xl border bg-white px-3 py-3 text-sm transition outline-none focus:border-brand-900 disabled:cursor-not-allowed"
              >
                <option value="">Selecione um produto</option>

                {carregandoProdutosDisponiveis && (
                  <option value="" disabled>
                    Carregando produtos...
                  </option>
                )}

                {!carregandoProdutosDisponiveis &&
                  erroProdutosDisponiveis && (
                    <option value="" disabled>
                      Erro ao carregar produtos
                    </option>
                  )}

                {!carregandoProdutosDisponiveis &&
                  !erroProdutosDisponiveis &&
                  produtosDisponiveis.map((produto) => (
                    <option key={produto.id} value={produto.id}>
                      {produto.nome} — atual: {produto.quantidadeAtual}{" "}
                      {produto.unidade}
                    </option>
                  ))}
              </select>
            </div>

            {/* QUANTIDADE */}

            <div className="mb-4">
              <label
                htmlFor="quantidade-entrada"
                className="text-ink-700 mb-1 block text-xs font-bold"
              >
                Quantidade
              </label>

              <div className="relative">
                <input
                  id="quantidade-entrada"
                  type="number"
                  min="0.01"
                  step="0.01"
                  value={quantidadeEntrada}
                  onChange={(event) => {
                    setQuantidadeEntrada(event.target.value);
                    setErroEntrada("");
                  }}
                  disabled={salvandoEntrada}
                  placeholder="Ex.: 5"
                  className="border-ink-200 disabled:bg-ink-50 w-full rounded-2xl border bg-white px-3 py-3 pr-14 text-sm transition outline-none focus:border-brand-900 disabled:cursor-not-allowed"
                />

                {produtoSelecionadoId !== null && (
                  <span className="absolute top-1/2 right-3 -translate-y-1/2 text-xs font-bold text-ink-400">
                    {
                      produtosDisponiveis.find(
                        (produto) => produto.id === produtoSelecionadoId,
                      )?.unidade
                    }
                  </span>
                )}
              </div>
            </div>

            {/* ERRO */}

            {erroEntrada && (
              <p className="mb-4 rounded-xl bg-danger-100 px-3 py-2 text-xs font-bold text-danger-500">
                {erroEntrada}
              </p>
            )}

            {/* BOTÕES */}

            <div className="flex gap-2">
              <button
                type="button"
                onClick={fecharModalEntrada}
                disabled={salvandoEntrada}
                className="border-ink-200 hover:bg-ink-50 flex-1 cursor-pointer rounded-2xl border px-4 py-3 text-sm font-bold text-ink-600 transition disabled:cursor-not-allowed disabled:opacity-50"
              >
                Cancelar
              </button>

              <button
                type="button"
                onClick={adicionarEntrada}
                disabled={salvandoEntrada}
                className="flex-1 cursor-pointer rounded-2xl bg-brand-900 px-4 py-3 text-sm font-bold text-white transition hover:bg-brand-800 disabled:cursor-not-allowed disabled:opacity-50"
              >
                {salvandoEntrada ? "Adicionando..." : "Adicionar entrada"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
