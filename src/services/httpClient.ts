import axios from "axios";
import process from "process";

export const httpClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  timeout: 10_000,
  headers: { "Content-Type": "application/json" },
});

httpClient.interceptors.response.use(
  (res: any) => res,
  (error: { response: { data: { detail: string; }; }; }) => {
    const mensagem =
      error.response?.data?.detail ?? "Não foi possível concluir a operação.";
    return Promise.reject(new Error(mensagem));
  }
);