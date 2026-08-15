import React from "react";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { FaSearch } from "react-icons/fa";

function Pantry() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-linear-to-b from-brand-200 to-brand-100">
        <span className="pb-1 font-bold text-brand-900">2. Estoque</span>
        <Header />
        <div className="mt-3 flex items-center rounded-[21px] border border-ink-400 px-3">
          <FaSearch className="shrink-0 text-ink-400" />

          <input type="text" placeholder="Buscar produto" className="w-full bg-transparent py-2 pl-2 outline-none" />
        </div>
      </main>
      <Sidebar />
    </div>
  );
}
export default Pantry;
