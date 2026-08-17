import React, { useEffect, useState } from "react";
import Header from "../../components/layout/Header/Header";
import BottomNavigation from "../../components/layout/Footer/BottomNavigation";
import { getProdutos } from "../../services/productService";
import type { Produto } from "../../types/product";

function ShoppingList() {
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
        <span className="pb-1 font-bold text-brand-900">
          3. Lista de Compras
        </span>

        <Header produtos={produtos} />

        {carregando && (
          <p className="mt-4 text-center text-sm text-ink-500">
            Carregando...
          </p>
        )}

        {erro && (
          <p className="mt-4 text-center text-sm text-danger-500">
            {erro}
          </p>
        )}

        {!carregando && !erro && (
          <div className="mx-3 mt-4 rounded-2xl bg-white p-4 shadow-sm">
            <h1 className="font-bold text-ink-900">
              Lista de Compras
            </h1>

            <p className="mt-2 text-sm text-ink-500">
              Sua lista de compras aparecerá aqui.
            </p>
          </div>
        )}
      </main>

      <BottomNavigation />
    </div>
  );
}

export default ShoppingList;