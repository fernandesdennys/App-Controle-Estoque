import { z } from "zod";

export const categoriaSchema = z.object({
  id: z.number(),
  nome: z.string(),
});

export const categoriaResumoSchema = z.object({
  id: z.number(),
  nome: z.string(),
  quantidade: z.number(),
  porcentagem: z.number(),
});

export type Categoria = z.infer<typeof categoriaSchema>;

export type CategoriaResumo = z.infer<typeof categoriaResumoSchema>;