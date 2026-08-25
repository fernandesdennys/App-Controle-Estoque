import axios from "axios";

export const httpClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,

  timeout: 10_000,

  headers: {
    "Content-Type": "application/json",
  },
});

httpClient.interceptors.response.use(
  (res) => res,

  (error) => {
    const mensagem =
      error.response?.data?.detail ??
      "Não foi possível concluir a operação.";

    return Promise.reject(new Error(mensagem));
  }
);