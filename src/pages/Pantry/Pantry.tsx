import React from "react";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import { FaSearch } from "react-icons/fa";

function Pantry() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="from-brand-200 to-brand-100 flex-1 bg-linear-to-b">
        <span className="text-brand-900 pb-1 font-bold">2. Estoque</span>
        <Header />
        <div className="border-ink-400 mt-3 flex items-center rounded-[21px] border px-3">
          <FaSearch className="text-ink-400 shrink-0" />

          <input
            type="text"
            placeholder="Buscar produto"
            className="w-full bg-transparent py-2 pl-2 outline-none"
          />
        </div>
      </main>
      <Sidebar />
    </div>
  );
}
export default Pantry;
