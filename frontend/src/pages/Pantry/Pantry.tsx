import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header/Header";
import BottomNavgation from "../../components/layout/Footer/BottomNavigation";
import ProductList from "../../components/products/ProductList";
import { FaSearch } from "react-icons/fa";
import { getProdutos } from "../../services/productService";
import { registrarEntrada, registrarConsumo } from "../../services/movementService";
import type { Produto } from "../../types/product";
import { movimentacaoSchema } from "../../schemas/movementSchema";

function Pantry() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [salvandoId, setSalvandoId] = useState<number | null>(null);
  const [erro, setErro] = useState("");

  /*
   * Carrega os produtos somente quando a página é aberta.
   */
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

  /*
   * Altera a quantidade do produto.
   *
   * A alteração é validada pelo Zod antes
   * de ser enviada para o backend.
   */
  async function alterarQuantidade(produto: Produto, tipo: "ENTRADA" | "SAIDA") {
    if (salvandoId !== null) {
      return;
    }

    /*
     * Não permite consumir um produto
     * que já está zerado.
     */
    if (tipo === "SAIDA" && produto.quantidadeAtual === 0) {
      return;
    }

    /*
     * Dados que serão enviados para o backend.
     */
    const dados = {
      quantidade: 1,
    };

    /*
     * Validação com Zod.
     */
    const resultado = movimentacaoSchema.safeParse(dados);

    /*
     * Se a validação falhar, mostramos
     * a primeira mensagem de erro.
     */
    if (!resultado.success) {
      setErro(resultado.error.issues[0].message);
      return;
    }

    try {
      setErro("");
      setSalvandoId(produto.id);

      /*
       * resultado.data contém os dados
       * já validados pelo Zod.
       */
      if (tipo === "ENTRADA") {
        await registrarEntrada(produto.id, resultado.data);
      } else {
        await registrarConsumo(produto.id, resultado.data);
      }

      /*
       * Busca novamente os produtos no backend,
       * mas sem ativar o loading da página.
       */
      const produtosAtualizados = await getProdutos();

      const produtoAtualizado = produtosAtualizados.find((item) => item.id === produto.id) ?? null;

      /*
       * Atualiza somente o produto que mudou.
       *
       * Isso evita desmontar a lista inteira
       * e mantém a posição do scroll.
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

  return (
    <div className="min-h-screen">
      <main className="min-h-screen overflow-visible bg-linear-to-b from-brand-200 to-brand-100 pb-24">
        <span className="pb-1 font-bold text-brand-900">2. Estoque</span>

        <Header produtos={produtos} />

        {/* BUSCA */}
        <div className="mt-3 flex items-center rounded-[21px] border border-ink-400 px-3">
          <FaSearch className="shrink-0 text-ink-400" />

          <input type="text" placeholder="Buscar produto" className="w-full bg-transparent py-2 pl-2 outline-none" />
        </div>

        {/* CARREGANDO */}
        {carregando && <p className="text-ink-500 mt-4 text-center text-sm">Carregando produtos...</p>}

        {/* ERRO */}
        {erro && <p className="mt-4 text-center text-sm text-red-600">{erro}</p>}

        {/* LISTA */}
        {!carregando && !erro && (
          <ProductList produtos={produtos} onAlterarQuantidade={alterarQuantidade} salvandoId={salvandoId} />
        )}
      </main>

      <BottomNavgation />
    </div>
  );
}

export default Pantry;
