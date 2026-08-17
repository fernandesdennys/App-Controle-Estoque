import React, { useEffect, useState } from "react";
import BottomNavigation from "../../components/layout/Footer/BottomNavigation";
import Header from "../../components/layout/Header/Header";
import { FaPlus, FaBars } from "react-icons/fa";
import CategoryCard from "../../components/ui/CategoryCard/CategoryCard";
import type { Produto } from "../../types/product";

import { getProdutos } from "../../services/productService";
import { getCategoriasResumo } from "../../services/categoryService";

import type { CategoriaResumo } from "../../types/category";

function Dashboard() {
  // ============================================================
  // DATA ATUAL
  // ============================================================

  const dataAtual = new Date();

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  const dataFormatada = `${dias[dataAtual.getDay()]}, ${dataAtual.getDate()} ${meses[dataAtual.getMonth()]}`;

  // ============================================================
  // PRODUTOS
  // ============================================================

  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregandoProdutos, setCarregandoProdutos] = useState(true);
  const [erroProdutos, setErroProdutos] = useState<string | null>(null);

  // ============================================================
  // CATEGORIAS
  // ============================================================

  const [categorias, setCategorias] = useState<CategoriaResumo[]>([]);
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);
  const [erroCategorias, setErroCategorias] = useState<string | null>(null);

  // ============================================================
  // BUSCAR PRODUTOS
  // ============================================================

  useEffect(() => {
    async function carregarProdutos() {
      try {
        setCarregandoProdutos(true);
        setErroProdutos(null);

        const dados = await getProdutos();

        setProdutos(dados);
      } catch (error) {
        const mensagem = error instanceof Error ? error.message : "Não foi possível carregar os produtos.";

        setErroProdutos(mensagem);
      } finally {
        setCarregandoProdutos(false);
      }
    }

    carregarProdutos();
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
        const mensagem = error instanceof Error ? error.message : "Não foi possível carregar as categorias.";

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

  const produtosAtencao = produtos.filter(
    (produto) =>
      produto.quantidadeAtual === 0 ||
      (produto.quantidadeAtual > 0 && produto.quantidadeAtual <= produto.quantidadeMinima)
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
  // RENDERIZAÇÃO
  // ============================================================

  return (
    <div id="dashboard" className="flex min-h-screen flex-col">
      <main id="dashboard-main" className="flex-1 bg-linear-to-b from-brand-100 to-brand-50 pb-24">
        <span id="dashboard-breadcrumb" className="pb-1 font-bold text-brand-900">
          1. Início
        </span>

        <Header produtos={produtos} />

        {/* =====================================================
            SAUDAÇÃO
        ====================================================== */}

        <div id="dashboard-welcome" className="my-3 flex items-center justify-around">
          <h1 id="dashboard-greeting" className="text-[22px] font-extrabold text-brand-900">
            Olá, Família Souza
          </h1>

          <span id="dashboard-date" className="mt-2 text-[12px] font-bold text-brand-500">
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
              {produtosAtencao.length} {produtosAtencao.length === 1 ? "item" : "itens"}
            </p>
          </div>
        </div>

        {/* =====================================================
            LISTA DE PRODUTOS
        ====================================================== */}

        <div id="attention-section" className="mx-5">
          <div id="attention-product-list" className="rounded-2xl bg-white p-3 shadow-sm">
            {carregandoProdutos && <p className="text-ink-500 py-2 text-center text-sm">Carregando estoque...</p>}

            {!carregandoProdutos && erroProdutos && (
              <p className="py-2 text-center text-sm text-danger-500">{erroProdutos}</p>
            )}

            {!carregandoProdutos && !erroProdutos && produtosAtencao.length === 0 && (
              <p className="text-ink-500 py-2 text-center text-sm">Nenhum produto precisa de atenção.</p>
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
                      <h2 className="text-[14px] leading-tight font-bold">{produto.nome}</h2>

                      <p className="text-[10px] text-gray-500">
                        Estoque: {produto.quantidadeAtual} {produto.unidade} · mín: {produto.quantidadeMinima}
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
          <button
            type="button"
            className="text=[12px] flex h-24 flex-1 cursor-pointer flex-col items-start justify-between rounded-2xl bg-accent-lime-300 p-3 font-bold text-ink-900 hover:bg-accent-lime-500"
          >
            <FaPlus />

            <p className="text-left leading-tight">
              Nova entrada
              <br />
              no estoque
            </p>
          </button>

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

          {/* =================================================
              CONTAINER COM ROLAGEM HORIZONTAL
          ================================================== */}

          <div className="mx-2 my-4 overflow-x-auto pb-3">
  <div className="flex gap-2">
              {/* CARREGANDO */}

              {carregandoCategorias && <p className="text-ink-500 text-sm">Carregando categorias...</p>}

              {/* ERRO */}

              {!carregandoCategorias && erroCategorias && <p className="text-sm text-danger-500">{erroCategorias}</p>}

              {/* NENHUMA CATEGORIA */}

              {!carregandoCategorias && !erroCategorias && categorias.length === 0 && (
                <p className="text-ink-500 text-sm">Nenhuma categoria precisa de atenção.</p>
              )}

              {/* CATEGORIAS */}

              {!carregandoCategorias &&
                !erroCategorias &&
                categorias.map((categoria) => <CategoryCard key={categoria.id} categoria={categoria} />)}
            </div>
          </div>
        </div>
      </main>

      <BottomNavigation />
    </div>
  );
}

export default Dashboard;
