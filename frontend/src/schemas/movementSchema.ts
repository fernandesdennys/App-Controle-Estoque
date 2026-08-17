import { z } from "zod";

export const movimentacaoSchema = z.object({
  quantidade: z
    .number({
      error: "A quantidade é obrigatória.",
    })
    .positive("A quantidade deve ser maior que zero."),

  observacao: z
    .string()
    .max(255, "A observação deve ter no máximo 255 caracteres.")
    .optional(),
});

export type MovimentacaoForm = z.infer<typeof movimentacaoSchema>;