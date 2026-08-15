import { Link } from "react-router-dom";
import { FiHome, FiPackage, FiShoppingCart, FiClock } from "react-icons/fi";
import React from "react";

const navigationItems = [
  { label: "Início", icon: FiHome, path: "/dashboard" },
  { label: "Estoque", icon: FiPackage, path: "/pantry" },
  { label: "Compras", icon: FiShoppingCart, path: "/shopping-list" },
  { label: "Histórico", icon: FiClock, path: "/history" },
];

function Footer() {
  return (
    <footer className="mx-5 mt-2 flex justify-between gap-2">
      {navigationItems.map(({ label, icon: Icon, path }) => (
        <Link key={label} to={path} className="flex flex-col items-center">
          <Icon />
          <span>{label}</span>
        </Link>
      ))}
    </footer>
  );
}

export default Footer;
