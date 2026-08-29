import React from "react";
import type { Produto } from "../../types/product";
import type { Categoria } from "../../types/category";
import ProductCard from "./ProductCard";

interface ProductListProps {
  produtos: Produto[];
  categorias: Categoria[];
  onAlterarQuantidade: (produto: Produto, tipo: "ENTRADA" | "SAIDA") => void;
  onRemoverProduto: (produto: Produto) => void;
  salvandoId: number | null;
  obterIniciaisCategoria: (nome: string) => string;
}

function ProductList({
  produtos,
  categorias,
  onAlterarQuantidade,
  onRemoverProduto,
  salvandoId,
  obterIniciaisCategoria,
}: ProductListProps) {
  if (produtos.length === 0) {
    return (
      <div className="text-ink-500 mx-3 mt-3 rounded-2xl bg-white p-4 text-center text-sm md:mx-0">
        Nenhum produto encontrado.
      </div>
    );
  }

  return (
    <div className="mt-3 grid grid-cols-1 gap-2 lg:grid-cols-2 lg:gap-3 xl:grid-cols-3">
      {produtos.map((produto) => {
        const categoria = categorias.find((item) => item.id === produto.categoriaId);

        return (
          <ProductCard
            key={produto.id}
            produto={produto}
            categoria={categoria}
            onAlterarQuantidade={onAlterarQuantidade}
            onRemoverProduto={onRemoverProduto}
            salvando={salvandoId === produto.id}
            obterIniciaisCategoria={obterIniciaisCategoria}
          />
        );
      })}
    </div>
  );
}

export default ProductList;
