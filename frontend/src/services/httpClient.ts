import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  timeout: 10_000,

  headers: {
    "Content-Type": "application/json",
  },
});

// Adiciona o token salvo (se existir) no header Authorization
// de toda requisição, automaticamente.
httpClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

httpClient.interceptors.response.use(
  (res) => res,

  (error) => {
    const mensagem = error.response?.data?.message ?? "Não foi possível concluir a operação.";

    return Promise.reject(new Error(mensagem));
  }
);
