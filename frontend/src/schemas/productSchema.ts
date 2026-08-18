import { z } from "zod";

/**
 * Unidades aceitas pelo backend.
 *
 * Equivale ao enum Unidade.java.
 */
export const unidadeSchema = z.enum(["UN", "KG", "G", "L", "ML", "PCT"]);

/**
 * Valida os dados enviados para criação de um produto.
 *
 * Equivale ao ProdutoInsertDTO.java.
 */
export const produtoInsertSchema = z.object({
  nome: z
    .string({
      error: "O nome é obrigatório.",
    })
    .trim()
    .min(1, "O nome é obrigatório.")
    .max(120, "O nome deve ter no máximo 120 caracteres."),

  categoriaId: z
    .number({
      error: "A categoria é obrigatória.",
    })
    .int("A categoria deve ser válida."),

  unidade: unidadeSchema,

  quantidadeAtual: z
    .number({
      error: "A quantidade atual é obrigatória.",
    })
    .min(0, "A quantidade atual não pode ser negativa.")
    .refine((valor) => {
      const partes = valor.toString().split(".");
      const digitosInteiros = partes[0].replace("-", "").length;
      const casasDecimais = partes[1]?.length ?? 0;

      return digitosInteiros <= 7 && casasDecimais <= 3;
    }, "A quantidade atual deve ter no máximo 7 dígitos inteiros e 3 casas decimais."),

  quantidadeMinima: z
    .number({
      error: "A quantidade mínima é obrigatória.",
    })
    .min(0, "A quantidade mínima não pode ser negativa.")
    .refine((valor) => {
      const partes = valor.toString().split(".");
      const digitosInteiros = partes[0].replace("-", "").length;
      const casasDecimais = partes[1]?.length ?? 0;

      return digitosInteiros <= 7 && casasDecimais <= 3;
    }, "A quantidade mínima deve ter no máximo 7 dígitos inteiros e 3 casas decimais."),

  quantidadeIdeal: z
    .number({
      error: "A quantidade ideal é obrigatória.",
    })
    .min(0, "A quantidade ideal não pode ser negativa.")
    .refine((valor) => {
      const partes = valor.toString().split(".");
      const digitosInteiros = partes[0].replace("-", "").length;
      const casasDecimais = partes[1]?.length ?? 0;

      return digitosInteiros <= 7 && casasDecimais <= 3;
    }, "A quantidade ideal deve ter no máximo 7 dígitos inteiros e 3 casas decimais."),
});

export const produtoUpdateSchema = produtoInsertSchema.extend({
  ativo: z.boolean({
    error: "O campo ativo é obrigatório.",
  }),
});

export const produtoSchema = z.object({
  id: z.number().int(),
  nome: z.string(),
  categoriaId: z.number().int(),
  unidade: unidadeSchema,
  quantidadeAtual: z.number(),
  quantidadeMinima: z.number(),
  quantidadeIdeal: z.number(),
  ativo: z.boolean(),
});

export const paginaProdutosSchema = z.object({
  content: z.array(produtoSchema),
  totalElements: z.number().int(),
  totalPages: z.number().int(),
  size: z.number().int(),
  number: z.number().int(),
});

export type Unidade = z.infer<typeof unidadeSchema>;
export type ProdutoInsert = z.infer<typeof produtoInsertSchema>;
export type ProdutoUpdate = z.infer<typeof produtoUpdateSchema>;
export type ProdutoSchema = z.infer<typeof produtoSchema>;
export type PaginaProdutos = z.infer<typeof paginaProdutosSchema>;
