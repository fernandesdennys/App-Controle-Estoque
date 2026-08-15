import React from "react";
import type { CategoriaResumo } from "../../../types/category";

interface CategoryCardProps {
  categoria: CategoriaResumo;
}

const coresCategorias: Record<string, string> = {
  
  Eletrônicos: "bg-blue-600",
  Alimentos: "bg-green-600",
  Bebidas: "bg-orange-500",
  Roupas: "bg-pink-500",
  Higiene: "bg-cyan-500",
  Limpeza: "bg-purple-600",
};

function CategoryCard({ categoria }: CategoryCardProps) {
  const cor = coresCategorias[categoria.nome] ?? "bg-gray-500";

  return (
    <div className="flex-1 rounded-2xl bg-white p-3">
      {/* Nome da categoria e quantidade de produtos */}
      <div className="flex items-center justify-between">
        <p className="text-[11px] font-bold text-ink-900">
          {categoria.nome}
        </p>

        <span className="text-[10px] text-ink-500">
          {categoria.quantidade}
        </span>
      </div>

      {/* Barra de preenchimento do estoque */}
      <div className="mt-2 h-1 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${cor}`}
          style={{
            width: `${categoria.porcentagem}%`,
          }}
        />
      </div>
    </div>
  );
}

export default CategoryCard;