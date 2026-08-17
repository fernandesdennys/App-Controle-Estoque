import React from "react";
import type { CategoriaResumo } from "../../../types/category";

interface CategoryCardProps {
  categoria: CategoriaResumo;
}

const coresCategorias: Record<string, string> = {
  Carnes: "bg-red-600",
  Laticínios: "bg-sky-400",
  Bebidas: "bg-orange-500",
  Grãos: "bg-amber-600",
  Massas: "bg-yellow-500",
  Hortaliças: "bg-green-600",
  Frutas: "bg-pink-500",
  Temperos: "bg-purple-600",
  Congelados: "bg-cyan-600",
  "Produtos de Limpeza": "bg-indigo-600",
};

function CategoryCard({ categoria }: CategoryCardProps) {
  const cor = coresCategorias[categoria.nome] ?? "bg-gray-500";

  return (
    <div className="flex-1 rounded-2xl bg-white p-3">
      {/* Nome da categoria e quantidade de produtos */}
      <div className="flex items-center justify-between">
        <p className="text-[13px] font-bold text-ink-900">{categoria.nome}</p>

        <span className="text-ink-500 text-[12px]">{categoria.quantidade}</span>
      </div>

      {/* Barra de preenchimento do estoque */}
      <div className="mt-2 h-2 w-full overflow-hidden rounded-full bg-gray-200">
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
