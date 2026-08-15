import React from "react";
import { FiHome } from "react-icons/fi";
import { FaPlus } from "react-icons/fa";

function Header() {
  return (
    <header>
      <div className="flex flex-col bg-brand-900 px-3 py-2 pb-8 rounded-b-3xl">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center">
            <div className="flex items-center justify-center h-8 w-8 rounded-[9px] bg-accent-lime-500">
              <FiHome className="h-6 w-6" />
            </div>

            <div className="flex flex-col ml-2 text-white">
              <h1 className="font-bold">StockHouse</h1>
              <p className="text-[11px]">Controle de estoque da casa</p>
            </div>
          </div>

          <div className="flex gap-2">
            <div className="flex items-center justify-center h-8 w-8 rounded-[9px] bg-accent-lime-500">
              <FaPlus className="h-5 w-5" />
            </div>

            <div className="flex items-center justify-center h-8 w-8 rounded-full bg-brand-200">
              <span className="h-6 w-6 flex items-center justify-center">
                FS
              </span>
            </div>
          </div>
        </div>

        <section className="flex justify-between gap-2 h-18 uppercase font-bold text-white">
          <div className="flex flex-1 flex-col items-start justify-center bg-brand-500 rounded-2xl">
            <span className="ml-2 text-[25px]">12</span>
            <span className="ml-3 text-[12px]">Produtos</span>
          </div>

          <div className="flex flex-1 flex-col items-start justify-center bg-warning-400 rounded-2xl text-black">
            <span className="ml-3 text-[25px]">3</span>
            <span className="ml-3 text-[12px]">Estoque baixo</span>
          </div>

          <div className="flex flex-1 flex-col items-start justify-center bg-danger-400 rounded-2xl">
            <span className="ml-3 text-[25px]">3</span>
            <span className="ml-3 text-[12px]">Vence/Esgotou</span>
          </div>
        </section>
      </div>
    </header>
  );
}

export default Header;
