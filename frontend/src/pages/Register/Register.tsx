import { useState, type FormEvent } from "react";
import { useNavigate, Link } from "react-router-dom";
import { httpClient } from "../../services/httpClient";
import { validateRegister, type RegisterData } from "../../schemas/authSchema";
import React from "react";

type FormErrors = Partial<Record<keyof RegisterData, string[]>>;

export default function Register() {
  const navigate = useNavigate();

  const [nome, setNome] = useState("");
  const [sobrenome, setSobrenome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmarSenha, setConfirmarSenha] = useState("");

  const [errors, setErrors] = useState<FormErrors>({});
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const [sucesso, setSucesso] = useState(false);

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    setApiError(null);

    const resultado = validateRegister({ nome, sobrenome, email, senha, confirmarSenha });

    if (!resultado.success) {
      setErrors(resultado.errors);
      return;
    }

    setErrors({});
    setLoading(true);

    try {
      await httpClient.post("/register", {
        nome: resultado.data.nome,
        sobrenome: resultado.data.sobrenome,
        email: resultado.data.email,
        senha: resultado.data.senha,
      });

      setSucesso(true);

      setTimeout(() => navigate("/login"), 1500);
    } catch (error) {
      const mensagem = error instanceof Error ? error.message : "Não foi possível cadastrar.";
      setApiError(mensagem);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface-bg p-6 font-sans">
      <div className="w-full max-w-95 rounded-3xl border-2 border-brand-700 bg-surface-card px-9 pt-10 pb-8 shadow-[0_4px_24px_rgba(22,26,43,0.06)] shadow-brand-700">
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

        <h1 className="mb-1 text-center text-[22px] font-semibold text-ink-900">Criar conta</h1>
        <p className="mb-7 text-center text-[13px] text-ink-600">Cadastre-se para gerenciar sua dispensa</p>

        <form onSubmit={handleSubmit} noValidate>
          <div className="mb-4">
            <label htmlFor="nome" className="mb-1.5 block pl-1 text-xs font-medium text-ink-600">
              Nome
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-surface-line bg-surface-bg px-4 py-3.5 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <input
                id="nome"
                type="text"
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Seu nome"
                className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 outline-none"
              />
            </div>
            {errors.nome && <p className="mt-1 pl-1 text-xs text-danger-500">{errors.nome[0]}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="sobrenome" className="mb-1.5 block pl-1 text-xs font-medium text-ink-600">
              Sobrenome
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-surface-line bg-surface-bg px-4 py-3.5 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <input
                id="sobrenome"
                type="text"
                value={sobrenome}
                onChange={(e) => setSobrenome(e.target.value)}
                placeholder="Seu sobrenome"
                className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 outline-none"
              />
            </div>
            {errors.sobrenome && <p className="mt-1 pl-1 text-xs text-danger-500">{errors.sobrenome[0]}</p>}
          </div>

          <div className="mb-4">
            <label htmlFor="email" className="mb-1.5 block pl-1 text-xs font-medium text-ink-600">
              E-mail
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-surface-line bg-surface-bg px-4 py-3.5 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
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

          <div className="mb-4">
            <label htmlFor="senha" className="mb-1.5 block pl-1 text-xs font-medium text-ink-600">
              Senha
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-surface-line bg-surface-bg px-4 py-3.5 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
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

          <div className="mb-5.5">
            <label htmlFor="confirmarSenha" className="mb-1.5 block pl-1 text-xs font-medium text-ink-600">
              Confirmar senha
            </label>
            <div className="flex items-center gap-2.5 rounded-2xl border border-surface-line bg-surface-bg px-4 py-3.5 transition-colors focus-within:border-brand-400 focus-within:ring-2 focus-within:ring-brand-100">
              <input
                id="confirmarSenha"
                type="password"
                value={confirmarSenha}
                onChange={(e) => setConfirmarSenha(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-transparent text-sm text-ink-900 placeholder-ink-400 outline-none"
              />
            </div>
            {errors.confirmarSenha && (
              <p className="mt-1 pl-1 text-xs text-danger-500">{errors.confirmarSenha[0]}</p>
            )}
          </div>

          {apiError && (
            <p className="mb-3 rounded-xl bg-danger-50 px-3 py-2 text-center text-xs text-danger-500">{apiError}</p>
          )}

          {sucesso && (
            <p className="mb-3 rounded-xl bg-green-50 px-3 py-2 text-center text-xs text-green-600">
              Conta criada! Redirecionando para o login...
            </p>
          )}

          <button
            type="submit"
            disabled={loading || sucesso}
            className="w-full rounded-2xl bg-brand-600 py-3.5 text-sm font-semibold text-white shadow-[0_4px_14px_rgba(90,58,184,0.3)] transition-colors hover:bg-brand-700 disabled:cursor-not-allowed disabled:bg-brand-300"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="mt-6 text-center text-xs text-ink-600">
          Já tem uma conta?{" "}
          <Link to="/login" className="font-semibold text-brand-600 hover:text-brand-700 hover:underline">
            Entrar
          </Link>
        </p>
      </div>
    </div>
  );
}