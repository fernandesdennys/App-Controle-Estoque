import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header/Header";
import BottomNavgation from "../../components/layout/Footer/BottomNavigation";
import ProductList from "../../components/products/ProductList";
import { FaSearch } from "react-icons/fa";
import { getProdutos } from "../../services/productService";
import type { Produto } from "../../types/product";

function Pantry() {
  const [produtos, setProdutos] = useState<Produto[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState("");

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

  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-linear-to-b from-brand-200 to-brand-100">
        <span className="pb-1 font-bold text-brand-900">2. Estoque</span>

        <Header />

        <div className="mt-3 flex items-center rounded-[21px] border border-ink-400 px-3">
          <FaSearch className="shrink-0 text-ink-400" />

          <input type="text" placeholder="Buscar produto" className="w-full bg-transparent py-2 pl-2 outline-none" />
        </div>
        <div></div>

        {carregando && <p className="text-ink-500 mt-4 text-center text-sm">Carregando produtos...</p>}

        {erro && <p className="mt-4 text-center text-sm text-red-600">{erro}</p>}

        {!carregando && !erro && <ProductList produtos={produtos} />}
      </main>
      <BottomNavgation />
    </div>
  );
}

export default Pantry;
