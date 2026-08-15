import axios from "axios";

export const httpClient = axios.create({
  // URL do backend definida no .env
  baseURL: import.meta.env.VITE_API_URL,

  // Se o backend demorar mais de 10 segundos,
  // o Axios considera a requisição como timeout.
  timeout: 10_000,

  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor responsável por tratar erros vindos do backend.
httpClient.interceptors.response.use(
  // Se deu tudo certo, simplesmente devolve a resposta.
  (res) => res,

  // Se houve erro, tenta pegar a mensagem enviada pelo backend.
  (error) => {
    const mensagem =
      error.response?.data?.detail ??
      "Não foi possível concluir a operação.";

    return Promise.reject(new Error(mensagem));
  }
);