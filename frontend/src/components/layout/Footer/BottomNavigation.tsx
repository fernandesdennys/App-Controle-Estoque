import { NavLink } from "react-router-dom";
import { FiHome, FiPackage, FiShoppingCart, FiClock } from "react-icons/fi";
import React from "react";

const navigationItems = [
  {
    label: "Início",
    icon: FiHome,
    path: "/dashboard",
  },
  {
    label: "Estoque",
    icon: FiPackage,
    path: "/pantry",
  },
  {
    label: "Compras",
    icon: FiShoppingCart,
    path: "/shopping-list",
  },
  {
    label: "Histórico",
    icon: FiClock,
    path: "/history",
  },
];

function Footer() {
  return (
    <footer className="fixed bottom-0 left-0 z-50 w-full bg-white px-5 py-3 shadow-[0_-2px_10px_rgba(0,0,0,0.08)]">
      <nav className="flex items-center justify-between">
        {navigationItems.map(({ label, icon: Icon, path }) => (
          <NavLink
            key={label}
            to={path}
            className={({ isActive }) =>
              `flex w-10 flex-col items-center justify-center gap-1 rounded-2xl px-10 py-2 text-xs ${
                isActive ? "bg-brand-900 text-white" : "text-ink-500 hover:bg-brand-900 hover:text-white"
              }`
            }
          >
            <Icon className="text-xl" />

            <span>{label}</span>
          </NavLink>
        ))}
      </nav>
    </footer>
  );
}

export default Footer;
