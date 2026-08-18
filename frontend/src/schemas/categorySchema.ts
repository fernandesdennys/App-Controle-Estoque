import { z } from "zod";

export const categoriaSchema = z.object({
  id: z.number().int(),
  nome: z.string().trim().min(1, "O nome é obrigatório.").max(60, "O nome deve ter no máximo 60 caracteres."),
});

export const categoriaFormSchema = z.object({
  nome: z
    .string({
      error: "O nome é obrigatório.",
    })
    .trim()
    .min(1, "O nome é obrigatório.")
    .max(60, "O nome deve ter no máximo 60 caracteres."),
});

export type Categoria = z.infer<typeof categoriaSchema>;

export type CategoriaForm = z.infer<typeof categoriaFormSchema>;
