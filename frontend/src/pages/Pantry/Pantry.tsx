import React, { useEffect, useMemo, useState } from "react";
import Header from "../../components/layout/Header/Header";
import BottomNavgation from "../../components/layout/Footer/BottomNavigation";
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
  const [erro, setErro] = useState("");

  /*
   * Carrega produtos e categorias.
   */
  useEffect(() => {
    async function carregarDados() {
      try {
        setCarregando(true);
        setErro("");

        const [produtosDados, categoriasDados] = await Promise.all([getProdutos(), getCategorias()]);

        setProdutos(produtosDados);
        setCategorias(categoriasDados);
      } catch (error) {
        if (error instanceof Error) {
          setErro(error.message);
        } else {
          setErro("Não foi possível carregar o estoque.");
        }
      } finally {
        setCarregando(false);
      }
    }

    carregarDados();
  }, []);

  /*
   * Filtra os produtos pela categoria e pela busca.
   */
  const produtosFiltrados = useMemo(() => {
    return produtos.filter((produto) => {
      /*
       * Filtro por categoria.
       */
      const pertenceCategoria = categoriaSelecionada === null || produto.categoriaId === categoriaSelecionada;

      /*
       * Filtro por nome.
       */
      const correspondeBusca = produto.nome.toLowerCase().includes(busca.toLowerCase());

      return pertenceCategoria && correspondeBusca;
    });
  }, [produtos, categoriaSelecionada, busca]);

  /*
   * Altera a quantidade do produto.
   */
  async function alterarQuantidade(produto: Produto, tipo: "ENTRADA" | "SAIDA") {
    if (salvandoId !== null) {
      return;
    }

    if (tipo === "SAIDA" && produto.quantidadeAtual === 0) {
      return;
    }

    try {
      setErro("");
      setSalvandoId(produto.id);

      const dados = {
        quantidade: 1,
      };

      if (tipo === "ENTRADA") {
        await registrarEntrada(produto.id, dados);
      } else {
        await registrarConsumo(produto.id, dados);
      }

      /*
       * Busca os produtos novamente no backend.
       */
      const produtosAtualizados = await getProdutos();

      const produtoAtualizado = produtosAtualizados.find((item) => item.id === produto.id) ?? null;

      /*
       * Atualiza somente o produto alterado.
       */
      if (produtoAtualizado) {
        setProdutos((produtosAtuais) =>
          produtosAtuais.map((item) => (item.id === produtoAtualizado.id ? produtoAtualizado : item))
        );
      }
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível alterar o estoque.");
      }
    } finally {
      setSalvandoId(null);
    }
  }

  /*
   * Remove o produto do estoque.
   */
  async function removerProduto(produto: Produto) {
    if (salvandoId !== null) {
      return;
    }

    try {
      setErro("");
      setSalvandoId(produto.id);

      /*
       * Remove o produto no backend.
       */
      await deletarProduto(produto.id);

      /*
       * Remove o produto da lista local.
       */
      setProdutos((produtosAtuais) => produtosAtuais.filter((item) => item.id !== produto.id));
    } catch (error) {
      if (error instanceof Error) {
        setErro(error.message);
      } else {
        setErro("Não foi possível remover o produto.");
      }
    } finally {
      setSalvandoId(null);
    }
  }

  /*
   * Retorna as iniciais da categoria.
   *
   * Exemplos:
   *
   * Mercearia -> ME
   * Limpeza -> LI
   * Higiene -> HI
   * Produtos de Limpeza -> PL
   */
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
      <main className="bg-linear-to-b from-brand-200 to-brand-100 pb-24">
        <span className="pb-1 font-bold text-brand-900">2. Estoque</span>

        <Header produtos={produtos} />

        {/* =====================================================
            BUSCA
        ====================================================== */}

        <div className="mx-3 mt-3 flex items-center rounded-[21px] border border-ink-400 bg-transparent px-3">
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

        <div className="scrollbar-hover mx-2 my-4 overflow-x-auto pb-2">
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
            CARREGANDO
        ====================================================== */}

        {carregando && <p className="text-ink-500 mt-4 text-center text-sm">Carregando produtos...</p>}

        {/* =====================================================
            ERRO
        ====================================================== */}

        {erro && <p className="mt-4 text-center text-sm text-red-600">{erro}</p>}

        {/* =====================================================
            LISTA
        ====================================================== */}

        {!carregando && !erro && (
          <ProductList
            produtos={produtosFiltrados}
            categorias={categorias}
            onAlterarQuantidade={alterarQuantidade}
            onRemoverProduto={removerProduto}
            salvandoId={salvandoId}
            obterIniciaisCategoria={obterIniciaisCategoria}
          />
        )}
      </main>

      <BottomNavgation />
    </div>
  );
}

export default Pantry;
