import { z } from "zod";

/**
 * Schema de validação do formulário de login.
 * Usado tanto para validar os dados no submit quanto para tipar o form.
 */
export const loginSchema = z.object({
  email: z
    .string()
    .min(1, "O e-mail é obrigatório")
    .email("Digite um e-mail válido"),

  senha: z
    .string()
    .min(1, "A senha é obrigatória")
    .min(6, "A senha deve ter no mínimo 6 caracteres"),

  lembrarDeMim: z.boolean().optional().default(false),
});

// Tipo inferido automaticamente do schema acima.
// Use esse tipo no estado do formulário (useState<LoginData>) em vez de
// criar uma interface separada.
export type LoginData = z.infer<typeof loginSchema>;

/**
 * Helper opcional para usar no submit do form.
 * Retorna os dados validados ou os erros por campo, já formatados
 * pra exibir junto de cada input.
 */
export function validateLogin(data: unknown) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;
    return { success: false as const, errors: fieldErrors };
  }

  return { success: true as const, data: result.data };
}