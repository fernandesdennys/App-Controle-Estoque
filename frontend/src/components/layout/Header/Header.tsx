import React from "react";
import { FiHome } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import type { Produto } from "../../../types/product";

interface HeaderProps {
  produtos: Produto[];
  mostrarBotaoAdicionar?: boolean;
  onAdicionar?: () => void;
}

function Header({
  produtos,
  mostrarBotaoAdicionar = false,
  onAdicionar,
}: HeaderProps) {
  const totalProdutos = produtos.length;

  const estoqueBaixo = produtos.filter(
    (produto) =>
      produto.quantidadeAtual > 0 &&
      produto.quantidadeAtual <= produto.quantidadeMinima,
  ).length;

  const esgotados = produtos.filter(
    (produto) => produto.quantidadeAtual === 0,
  ).length;

  return (
    <header>
      <div className="flex flex-col rounded-b-3xl bg-brand-900 px-3 py-2 pb-8">
        <div className="mb-3 flex items-center justify-between">
          {/* =====================================================
              LOGO / IDENTIDADE
          ====================================================== */}

          <div className="flex items-center">
            <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent-lime-500">
              <FiHome className="h-6 w-6" />
            </div>

            <div className="ml-2 flex flex-col text-white">
              <h1 className="font-bold">StockHouse</h1>

              <p className="text-[11px]">
                Controle de estoque da casa
              </p>
            </div>
          </div>

          {/* =====================================================
              AÇÕES DO HEADER
          ====================================================== */}

          <div className="flex gap-2">
            {/* BOTÃO + */}

            {mostrarBotaoAdicionar && (
              <button
                type="button"
                onClick={onAdicionar}
                className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-[9px] bg-accent-lime-500 transition hover:bg-accent-lime-400"
                aria-label="Adicionar"
              >
                <FaPlus className="h-5 w-5" />
              </button>
            )}

            {/* PERFIL */}

            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-200">
              <span className="flex h-6 w-6 items-center justify-center">
                FS
              </span>
            </div>
          </div>
        </div>

        {/* =====================================================
            INDICADORES
        ====================================================== */}

        <section className="flex h-18 justify-between gap-2 font-bold text-white uppercase">
          {/* PRODUTOS */}

          <div className="flex flex-1 flex-col items-start justify-center rounded-2xl bg-brand-500">
            <span className="ml-2 text-[25px]">
              {totalProdutos}
            </span>

            <span className="ml-3 text-[10px]">
              Produtos
            </span>
          </div>

          {/* ESTOQUE BAIXO */}

          <div className="flex flex-1 flex-col items-start justify-center rounded-2xl bg-warning-400 text-black">
            <span className="ml-3 text-[25px]">
              {estoqueBaixo}
            </span>

            <span className="ml-3 text-[10px]">
              Estoque baixo
            </span>
          </div>

          {/* ESGOTADOS */}

          <div className="flex flex-1 flex-col items-start justify-center rounded-2xl bg-danger-400">
            <span className="ml-3 text-[25px]">
              {esgotados}
            </span>

            <span className="ml-3 text-[10px]">
              Vence/Esgotou
            </span>
          </div>
        </section>
      </div>
    </header>
  );
}

export default Header;