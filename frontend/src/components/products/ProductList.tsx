import React from "react";
import type { Produto } from "../../types/product";
import ProductCard from "./ProductCard";
import { TipoMovimentacao } from "../../types/movement";

interface ProductListProps {
  produtos: Produto[];
}

function ProductList({ produtos }: ProductListProps) {
  if (produtos.length === 0) {
    return <div className="text-ink-500 rounded-2xl bg-white p-4 text-center text-sm">Nenhum produto encontrado.</div>;
  }

  return (
    <div className="mt-3 flex flex-col gap-2">
      {produtos.map((produto) => (
        <ProductCard
          key={produto.id}
          produto={produto}
          onMovimentacao={function (produto: Produto, tipo: TipoMovimentacao): void {
            throw new Error("Function not implemented.");
          }}
        />
      ))}
    </div>
  );
}

export default ProductList;
