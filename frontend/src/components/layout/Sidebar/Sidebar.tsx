import { NavLink } from "react-router-dom";
import { FiHome, FiPackage, FiShoppingCart, FiClock, FiHelpCircle } from "react-icons/fi";
import React from "react";

const navigationItems = [
  { label: "Início", icon: FiHome, path: "/dashboard" },
  { label: "Estoque", icon: FiPackage, path: "/pantry" },
  { label: "Compras", icon: FiShoppingCart, path: "/shopping-list" },
  { label: "Histórico", icon: FiClock, path: "/history" },
];

function Sidebar() {
  return (
    <aside className="fixed top-4 bottom-4 left-4 z-50 hidden w-56 flex-col rounded-3xl bg-brand-900 px-4 py-6 shadow-xl md:flex">
      {/* LOGO */}
      <div className="mb-8 flex items-center gap-2 px-1">
        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-accent-lime-500">
          <FiHome className="h-5 w-5 text-ink-900" />
        </div>

        <div>
          <h1 className="text-[15px] font-extrabold text-white">StockHouse</h1>
          <p className="text-ink-400 text-[10px]">Controle de estoque da casa</p>
        </div>
      </div>

      {/* SEÇÃO */}
      <p className="mb-2 px-3 text-[10px] font-bold tracking-wider text-brand-300 uppercase">Menu</p>

      {/* NAVEGAÇÃO */}
      <nav className="flex flex-col gap-1">
        {navigationItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex items-center gap-3 rounded-2xl px-3 py-2.5 text-sm font-semibold transition ${
                isActive
                  ? "bg-white text-brand-900 shadow-sm"
                  : "text-brand-100 hover:bg-brand-800 hover:text-white"
              }`
            }
          >
            {({ isActive }) => (
              <>
                <span
                  className={`flex h-7 w-7 items-center justify-center rounded-lg ${
                    isActive ? "bg-brand-100 text-brand-900" : "text-brand-100"
                  }`}
                >
                  <Icon className="text-base" />
                </span>

                <span>{label}</span>
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ESPAÇADOR */}
      <div className="flex-1" />

      {/* CARD DE AJUDA */}
      <div className="rounded-2xl bg-brand-800 p-4 text-white">
        <FiHelpCircle className="mb-2 h-6 w-6 text-accent-lime-500" />

        <p className="text-[13px] font-bold">Precisa de ajuda?</p>
        <p className="mt-0.5 text-[11px] leading-snug text-brand-200">Fale com o suporte do StockHouse</p>

        <button
          type="button"
          className="mt-3 w-full rounded-full bg-accent-lime-500 py-2 text-[12px] font-bold text-ink-900 transition hover:bg-accent-lime-400"
        >
          Abrir chat
        </button>
      </div>
    </aside>
  );
}

export default Sidebar;