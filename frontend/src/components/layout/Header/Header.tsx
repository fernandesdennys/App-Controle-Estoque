import React from "react";
import { FiHome } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";
import type { Produto } from "../../../types/product";

interface HeaderProps {
  produtos: Produto[];
  mostrarBotaoAdicionar?: boolean;
  onAdicionar?: () => void;
  saudacao?: string;
  data?: string;
}

interface Usuario {
  id?: number;
  nome?: string;
  sobrenome?: string;
}

function Header({ produtos, mostrarBotaoAdicionar = false, onAdicionar, saudacao, data }: HeaderProps) {
  const totalProdutos = produtos.length;

  const estoqueBaixo = produtos.filter(
    (produto) => produto.quantidadeAtual > 0 && produto.quantidadeAtual <= produto.quantidadeMinima
  ).length;

  const esgotados = produtos.filter((produto) => produto.quantidadeAtual === 0).length;

  let usuario: Usuario = {};

  try {
    const usuarioSalvo = localStorage.getItem("usuario");
    if (usuarioSalvo) {
      usuario = JSON.parse(usuarioSalvo);
    }
  } catch (error) {
    console.error("Erro ao recuperar usuário:", error);
  }

  const nome = usuario.nome?.trim() || "";
  const sobrenome = usuario.sobrenome?.trim() || "";
  const nomeCompleto = `${nome} ${sobrenome}`.trim();
  const iniciais = `${nome.charAt(0)}${sobrenome.charAt(0)}`.toUpperCase();

  return (
    <header>
      <div className="flex flex-col rounded-b-3xl bg-brand-900 px-3 py-2 pb-8 md:rounded-3xl md:px-8 md:py-5">
        <div className="mx-auto flex w-full max-w-5xl flex-col">
          <div className="mb-3 flex items-center justify-between md:mb-4">
            {/* =====================================================
                LOGO — mobile / SAUDAÇÃO — desktop
            ====================================================== */}

            <div className="flex items-center md:hidden">
              <div className="flex h-8 w-8 items-center justify-center rounded-[9px] bg-accent-lime-500">
                <FiHome className="h-6 w-6" />
              </div>

              <div className="ml-2 flex flex-col text-white">
                <h1 className="font-bold">StockHouse</h1>
                <p className="text-[11px]">Controle de estoque da casa</p>
              </div>
            </div>

            <div className="hidden md:block">
              <h1 className="text-xl font-extrabold text-white">{saudacao ?? `Olá, ${nomeCompleto || "Usuário"}`}</h1>

              {data && <p className="mt-1 text-xs text-brand-200">{data}</p>}
            </div>

            {/* =====================================================
                AÇÕES DO HEADER
            ====================================================== */}

            <div className="flex gap-2">
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

              <div
                className="flex h-8 w-8 items-center justify-center rounded-full bg-brand-200"
                title={nomeCompleto || "Usuário"}
              >
                <span className="flex h-6 w-6 items-center justify-center text-sm font-medium text-brand-900">
                  {iniciais || "?"}
                </span>
              </div>
            </div>
          </div>

          {/* =====================================================
              INDICADORES
          ====================================================== */}

          <section className="flex h-18 justify-between gap-2 font-bold text-white uppercase md:h-auto md:gap-4">
            <div className="flex flex-1 flex-col items-start justify-center rounded-2xl bg-brand-500 md:py-3.5 md:shadow-sm">
              <span className="ml-2 text-[25px] md:ml-4 md:text-2xl">{totalProdutos}</span>
              <span className="ml-3 text-[10px] md:ml-4">Produtos</span>
            </div>

            <div className="flex flex-1 flex-col items-start justify-center rounded-2xl bg-warning-400 text-black md:py-3.5 md:shadow-sm">
              <span className="ml-3 text-[25px] md:ml-4 md:text-2xl">{estoqueBaixo}</span>
              <span className="ml-3 text-[10px] md:ml-4">Estoque baixo</span>
            </div>

            <div className="flex flex-1 flex-col items-start justify-center rounded-2xl bg-danger-400 md:py-3.5 md:shadow-sm">
              <span className="ml-3 text-[25px] md:ml-4 md:text-2xl">{esgotados}</span>
              <span className="ml-3 text-[10px] md:ml-4">Vence/Esgotou</span>
            </div>
          </section>
        </div>
      </div>
    </header>
  );
}

export default Header;
