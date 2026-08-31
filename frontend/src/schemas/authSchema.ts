import { z } from "zod";

/**
 * ========================================
 * SCHEMAS DE RESPOSTA DA API
 * ========================================
 *
 * Estes schemas validam o que o backend
 * devolve para o frontend.
 */

/**
 * Resposta do LOGIN
 */
export const loginResponseSchema = z.object({
  token: z.string(),
  nome: z.string(),
  sobrenome: z.string(),
  email: z.string().email(),
});

export type LoginResponseData = z.infer<typeof loginResponseSchema>;

/**
 * Resposta do CADASTRO
 */
export const registerResponseSchema = z.object({
  id: z.number(),
  nome: z.string(),
  sobrenome: z.string(),
  email: z.string().email(),
});

export type RegisterResponseData = z.infer<typeof registerResponseSchema>;

/**
 * ========================================
 * LOGIN
 * ========================================
 *
 * Schema usado para validar o formulário
 * de login antes de enviar para o backend.
 */

export const loginSchema = z.object({
  email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),

  senha: z.string().min(1, "A senha é obrigatória").min(6, "A senha deve ter no mínimo 6 caracteres"),

  lembrarDeMim: z.boolean().optional().default(false),
});

/**
 * Tipo dos dados do formulário de login.
 */
export type LoginData = z.infer<typeof loginSchema>;

/**
 * Validação do formulário de login.
 */
export function validateLogin(data: unknown) {
  const result = loginSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      success: false as const,
      errors: fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}

/**
 * ========================================
 * CADASTRO
 * ========================================
 *
 * Schema usado para validar o formulário
 * de cadastro antes de enviar para o backend.
 */

export const registerSchema = z
  .object({
    nome: z.string().min(1, "O nome é obrigatório").max(100, "O nome deve ter no máximo 100 caracteres"),

    sobrenome: z.string().min(1, "O sobrenome é obrigatório").max(100, "O sobrenome deve ter no máximo 100 caracteres"),

    email: z.string().min(1, "O e-mail é obrigatório").email("Digite um e-mail válido"),

    senha: z.string().min(1, "A senha é obrigatória").min(6, "A senha deve ter no mínimo 6 caracteres"),

    /**
     * Campo usado apenas no frontend
     * para confirmar a senha.
     */
    confirmarSenha: z.string().min(1, "Confirme a senha"),
  })
  .refine((data) => data.senha === data.confirmarSenha, {
    message: "As senhas não coincidem",
    path: ["confirmarSenha"],
  });

/**
 * Tipo dos dados do formulário de cadastro.
 */
export type RegisterData = z.infer<typeof registerSchema>;

/**
 * Validação do formulário de cadastro.
 */
export function validateRegister(data: unknown) {
  const result = registerSchema.safeParse(data);

  if (!result.success) {
    const fieldErrors = result.error.flatten().fieldErrors;

    return {
      success: false as const,
      errors: fieldErrors,
    };
  }

  return {
    success: true as const,
    data: result.data,
  };
}
