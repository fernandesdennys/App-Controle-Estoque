import { z } from "zod";

export const tipoMovimentacaoSchema = z.enum(["ENTRADA", "SAIDA", "AJUSTE", "DESCARTE"]);

export const movimentacaoInsertSchema = z.object({
  quantidade: z
    .number({
      error: "A quantidade é obrigatória.",
    })
    .min(0.001, "A quantidade deve ser maior que zero.")
    .refine((valor) => {
      const partes = valor.toString().split(".");

      const digitosInteiros = partes[0].replace("-", "").length;
      const casasDecimais = partes[1]?.length ?? 0;

      return digitosInteiros <= 7 && casasDecimais <= 3;
    }, "A quantidade deve ter no máximo 7 dígitos inteiros e 3 casas decimais."),

  observacao: z.string().max(255, "A observação deve ter no máximo 255 caracteres.").optional(),
});

export const movimentacaoResponseSchema = z.object({
  id: z.number(),
  produtoId: z.number(),
  tipo: tipoMovimentacaoSchema,
  quantidade: z.number(),
  observacao: z.string().nullable(),
  criadoEm: z.string(),
});

export type TipoMovimentacao = z.infer<typeof tipoMovimentacaoSchema>;

export type MovimentacaoInsert = z.infer<typeof movimentacaoInsertSchema>;

export type Movimentacao = z.infer<typeof movimentacaoResponseSchema>;
