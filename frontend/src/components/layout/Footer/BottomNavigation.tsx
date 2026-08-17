import { Link } from "react-router-dom";
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
          <Link key={label} to={path} className="text-ink-500 flex flex-1 flex-col items-center gap-1 text-xs">
            <Icon className="text-xl" />

            <span>{label}</span>
          </Link>
        ))}
      </nav>
    </footer>
  );
}

export default Footer;
