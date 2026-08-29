import { useState, type FormEvent } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { validateLogin, type LoginData } from "../../schemas/authSchema";
import React from "react";

type FormErrors = Partial<Record<keyof LoginData, string[]>>;

export default function Login() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [lembrarDeMim, setLembrarDeMim] = useState(false);

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setApiError(null);

    const resultado = validateLogin({ email, senha, lembrarDeMim });

    if (!resultado.success) {
      setErrors(resultado.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      const response = await axios.post("/api/login", resultado.data);
      console.log("Login efetuado:", response.data);
      navigate("/dashboard");
    } catch (error) {
      setApiError("E-mail ou senha inválidos. Tente novamente.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-linear-to-b from-brand-100 to-brand-50 p-6 font-sans">
      <div className="w-full max-w-95 rounded-3xl  shadow-brand-800 bg-surface-card px-9 pt-10 pb-8 shadow-[0_4px_24px_rgba(22,26,43,0.06)]">
        {/* logo */}
        <div className="mb-5 flex justify-center">
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-linear-to-br from-brand-500 to-brand-700 shadow-[0_4px_14px_rgba(90,58,184,0.35)]">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="#ffffff"
              strokeWidth={2}
              strokeLinecap="round"
              strokeLinejoin="round"
              className="h-6.5 w-6.5"
            >
              <path d="M3 7l9-4 9 4-9 4-9-4z" />
              <path d="M3 7v10l9 4 9-4V7" />
              <path d="M12 11v10" />
            </svg>
          </div>
        </div>

        <h1 className="mb-1 text-center text-[22px] font-semibold text-ink-900">Bem-vindo de volta</h1>
        <p className="mb-7 text-center text-[13px] text-ink-600">Entre para gerenciar sua dispensa</p>

        <form onSubmit={handleSubmit} noValidate>
          {/* E-mail */}
          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block pl-1 text-xs font-medium text-ink-600">
              E-mail
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-surface-line bg-surface-bg px-4 py-3.5 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-ink-400"
              >
                <path d="M22 6l-10 7L2 6" />
                <path d="M2 6h20v12H2z" />
              </svg>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="seuemail@empresa.com"
                className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 outline-none"
              />
            </div>
            {errors.email && <p className="mt-1 pl-1 text-xs text-danger-500">{errors.email[0]}</p>}
          </div>

          {/* Senha */}
          <div className="mb-4">
            <label htmlFor="senha" className="mb-1.5 block pl-1 text-xs font-medium text-ink-600">
              Senha
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-surface-line bg-surface-bg px-4 py-3.5 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth={2}
                strokeLinecap="round"
                strokeLinejoin="round"
                className="h-4 w-4 shrink-0 text-ink-400"
              >
                <rect x="4" y="11" width="16" height="9" rx="2" />
                <path d="M8 11V7a4 4 0 0 1 8 0v4" />
              </svg>
              <input
                id="senha"
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 outline-none"
              />
            </div>
            {errors.senha && <p className="mt-1 pl-1 text-xs text-danger-500">{errors.senha[0]}</p>}
          </div>

          {/* lembrar / esqueci */}
          <div className="mt-0.5 mb-5.5 flex items-center justify-between text-xs">
            <label className="flex items-center gap-2 text-ink-600">
              <input
                type="checkbox"
                checked={lembrarDeMim}
                onChange={(e) => setLembrarDeMim(e.target.checked)}
                className="accent-brand-600"
              />
              Lembrar de mim
            </label>
            <a href="#" className="font-medium text-brand-600 hover:text-brand-700 hover:underline">
              Esqueceu a senha?
            </a>
          </div>

          {apiError && (
            <p className="mb-3 rounded-xl bg-danger-50 px-3 py-2 text-center text-xs text-danger-500">{apiError}</p>
          )}

          {/* botão entrar */}
          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(90,58,184,0.3)] transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {loading ? "Entrando..." : "Entrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-600">
          Não tem uma conta?{" "}
          <a href="#" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Fale com o administrador
          </a>
        </p>
      </div>
    </div>
  );
}
