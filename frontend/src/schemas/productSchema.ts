import { z } from "zod";

export const produtoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  unidade: z.string(),
  quantidadeAtual: z.number(),
  quantidadeMinima: z.number(),
  quantidadeIdeal: z.number(),
  categoriaId: z.number(),
  ativo: z.boolean(),
});

export const paginaProdutosSchema = z.object({
  content: z.array(produtoSchema),
  totalElements: z.number(),
  totalPages: z.number(),
  size: z.number(),
  number: z.number(),
});

export type ProdutoSchema = z.infer<typeof produtoSchema>;
export type PaginaProdutos = z.infer<typeof paginaProdutosSchema>;