import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header/Header";
import BottomNavgation from "../../components/layout/Footer/BottomNavigation";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import ProductList from "../../components/products/ProductList";
import { FaSearch } from "react-icons/fa";

import { getProdutos, deletarProduto } from "../../services/productService";

import { registrarEntrada, registrarConsumo } from "../../services/movementService";

import { getCategorias } from "../../services/categoryService";

import type { Produto } from "../../types/product";
import type { Categoria } from "../../types/category";

function Pantry() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [categorias, setCategorias] = useState<Categoria[]>([]);
  const [categoriaSelecionada, setCategoriaSelecionada] = useState<number | null>(null);
  const [busca, setBusca] = useState("");
  const [carregando, setCarregando] = useState(true);
  const [salvandoId, setSalvandoId] = useState<number | null>(null);

  // Erro de carregamento inicial da página (esconde a lista)
  const [erroCarregamento, setErroCarregamento] = useState("");

  // Erro de uma ação pontual (+/-, remover) — não deve esconder a lista
  const [erroAcao, setErroAcao] = useState("");

  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErroCarregamento("");

        const [produtosDados, categoriasDados] = await Promise.all([getProdutos(), getCategorias()]);

        setProdutos(produtosDados);
        setCategorias(categoriasDados);
      } catch (error) {
        if (error instanceof Error) {
          setErroCarregamento(error.message);
        } else {
          setErroCarregamento("Não foi possível carregar o estoque.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  // Some sozinho depois de alguns segundos
  useEffect(() => {
    if (!erroAcao) {
      return;
    }

    const timer = setTimeout(() => {
      setErroAcao("");
    }, 4000);

    return () => clearTimeout(timer);
  }, [erroAcao]);

  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      const pertenceCategoria = categoriaSelecionada === null || produto.categoriaId === categoriaSelecionada;

      const correspondeBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());

      return pertenceCategoria && correspondeBusca;
    });
  }, [produtos, categoriaSelecionada, busca]);

  async function alterarQuantidade(produto: Produto, tipo: "ENTRADA" | "SAIDA") {
    if (salvandoId !== null) {
      return;
    }

    if (tipo === "SAIDA" && produto.quantidadeAtual === 0) {
      return;
    }

    try {
      setErroAcao("");
      setSalvandoId(produto.id);

      const dados = {
        quantidade: 1,
      };

      if (tipo === "ENTRADA") {
        await registrarEntrada(produto.id, dados);
      } else {
        await registrarConsumo(produto.id, dados);
      }

      const produtosAtualizados = await getProdutos();

      const produtoAtualizado = produtosAtualizados.find((item) => item.id === produto.id) ?? null;

      if (produtoAtualizado) {
        setProdutos((produtosAtuais) =>
          produtosAtuais.map((item) => (item.id === produtoAtualizado.id ? produtoAtualizado : item))
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setErroAcao(error.message);
      } else {
        setErroAcao("Não foi possível alterar o estoque.");
      }
    } finally {
      setSalvandoId(null);
    }
  }

  async function removerProduto(produto: Produto) {
    if (salvandoId !== null) {
      return;
    }

    try {
      setErroAcao("");
      setSalvandoId(produto.id);

      await deletarProduto(produto.id);

      setProdutos((produtosAtuais) => produtosAtuais.filter((item) => item.id !== produto.id));
    } catch (error) {
      if (error instanceof Error) {
        setErroAcao(error.message);
      } else {
        setErroAcao("Não foi possível remover o produto.");
      }
    } finally {
      setSalvandoId(null);
    }
  }

  function obterIniciaisCategoria(nome: string) {
    const palavras = nome.trim().split(/\s+/).filter(Boolean);

    if (palavras.length === 1) {
      return palavras[0].substring(0, 2).toUpperCase();
    }

    return palavras
      .slice(0, 2)
      .map((palavra) => palavra.charAt(0))
      .join("")
      .toUpperCase();
  }

  return (
    <div className="min-h-screen">
      <Sidebar />

      <main className="flex-1 bg-linear-to-b from-brand-100 to-brand-50 pb-24 md:ml-64 md:pt-4 md:pr-4 md:pb-10 md:pl-4">
        <span className="pb-1 font-bold text-brand-900">2. Estoque</span>

        <Header produtos={produtos} />

        <div className="mx-auto max-w-5xl md:px-8">
          {/* =====================================================
              BUSCA
          ====================================================== */}

          <div className="mx-3 mt-3 flex items-center rounded-[21px] border border-ink-400 bg-transparent px-3 md:mx-0 md:max-w-md">
            <FaSearch className="shrink-0 text-ink-400" />

            <input
              type="text"
              value={busca}
              onChange={(event) => setBusca(event.target.value)}
              placeholder="Buscar produto"
              className="w-full bg-transparent py-2 pl-2 outline-none"
            />
          </div>

          {/* =====================================================
              CATEGORIAS
          ====================================================== */}

          <div className="scrollbar-hover mx-2 my-4 overflow-x-auto pb-2 md:mx-0">
            <div className="flex w-max gap-2">
              {/* TODOS */}

              <button
                type="button"
                onClick={() => setCategoriaSelecionada(null)}
                className={`cursor-pointer rounded-full px-5 py-2 text-[12px] font-bold transition hover:bg-brand-900 hover:text-white ${
                  categoriaSelecionada === null ? "bg-brand-900 text-white" : "text-ink-500 bg-white"
                }`}
              >
                Todos
              </button>

              {/* CATEGORIAS */}

              {categorias.map((categoria) => (
                <button
                  key={categoria.id}
                  type="button"
                  onClick={() => setCategoriaSelecionada(categoria.id)}
                  className={`cursor-pointer rounded-full px-5 py-2 text-[12px] font-bold whitespace-nowrap transition hover:bg-brand-900 hover:text-white ${
                    categoriaSelecionada === categoria.id ? "bg-brand-900 text-white" : "text-ink-500 bg-white"
                  }`}
                >
                  {categoria.nome}
                </button>
              ))}
            </div>
          </div>

          {/* =====================================================
              AVISO DE ERRO DE AÇÃO (não esconde a lista)
          ====================================================== */}

          {erroAcao && (
            <div className="mx-3 mb-3 flex items-center justify-between rounded-xl bg-danger-100 px-4 py-2 text-sm text-danger-500 md:mx-0">
              <span>{erroAcao}</span>

              <button
                type="button"
                onClick={() => setErroAcao("")}
                className="ml-3 shrink-0 cursor-pointer font-bold"
                aria-label="Fechar aviso"
              >
                ×
              </button>
            </div>
          )}

          {/* =====================================================
              CARREGANDO
          ====================================================== */}

          {carregando && <p className="text-ink-500 mt-4 text-center text-sm">Carregando produtos...</p>}

          {/* =====================================================
              ERRO DE CARREGAMENTO
          ====================================================== */}

          {erroCarregamento && <p className="mt-4 text-center text-sm text-red-600">{erroCarregamento}</p>}

          {/* =====================================================
              LISTA
          ====================================================== */}

          {!carregando && !erroCarregamento && (
            <ProductList
              produtos={produtosFiltrados}
              categorias={categorias}
              onAlterarQuantidade={alterarQuantidade}
              onRemoverProduto={removerProduto}
              salvandoId={salvandoId}
              obterIniciaisCategoria={obterIniciaisCategoria}
            />
          )}
        </div>
      </main>

      <BottomNavgation />
    </div>
  );
}

export default Pantry;
