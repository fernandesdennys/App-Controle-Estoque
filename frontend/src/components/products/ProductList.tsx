import React from "react";
import type { Produto } from "../../types/product";
import ProductCard from "./ProductCard";

interface ProductListProps {
  produtos: Produto[];

  onAlterarQuantidade: (
    produto: Produto,
    tipo: "ENTRADA" | "SAIDA"
  ) => void;

  salvandoId: number | null;
}

function ProductList({
  produtos,
  onAlterarQuantidade,
  salvandoId,
}: ProductListProps) {
  if (produtos.length === 0) {
    return (
      <div className="rounded-2xl bg-white p-4 text-center text-sm text-ink-500">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {produtos.map((produto) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          onAlterarQuantidade={onAlterarQuantidade}
          salvando={salvandoId === produto.id}
        />
      ))}
    </div>
  );
}

export default ProductList;