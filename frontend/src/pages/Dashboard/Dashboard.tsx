import React, { useEffect, useState } from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";
import { FaPlus } from "react-icons/fa";
import { FaBars } from "react-icons/fa";
import CategoryCard from "../../components/ui/CategoryCard/CategoryCard";

// Service responsável por buscar os dados no backend
import { getCategoriasResumo } from "../../services/categoryService";

// Tipo dos dados que serão exibidos nos cards
import type { CategoriaResumo } from "../../types/category";

function Dashboard() {
  // ============================================================
  // DATA ATUAL
  // ============================================================

  const dataAtual = new Date();

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];

  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];

  const dataFormatada = `${dias[dataAtual.getDay()]}, ${dataAtual.getDate()} ${meses[dataAtual.getMonth()]}`;

  // ============================================================
  // CATEGORIAS
  // ============================================================

  /**
   * Guarda as categorias que serão exibidas na seção
   * "Por categoria".
   *
   * Inicialmente começa como um array vazio porque
   * os dados ainda não vieram do backend.
   */
  const [categorias, setCategorias] = useState<CategoriaResumo[]>([]);

  /**
   * Indica se estamos esperando a resposta do backend.
   */
  const [carregandoCategorias, setCarregandoCategorias] = useState(true);

  /**
   * Guarda uma eventual mensagem de erro.
   */
  const [erroCategorias, setErroCategorias] = useState<string | null>(null);

  // ============================================================
  // BUSCAR CATEGORIAS NO BACKEND
  // ============================================================

  useEffect(() => {
    /**
     * Função responsável por carregar os dados.
     */
    async function carregarCategorias() {
      try {
        // Começamos o carregamento
        setCarregandoCategorias(true);

        // Limpamos um possível erro anterior
        setErroCategorias(null);

        /**
         * Aqui acontece a chamada:
         *
         * GET /categorias
         *
         * +
         *
         * GET /produtos?abaixo_minimo=true
         *
         * O categoryService junta essas informações
         * e devolve os dados já preparados para o card.
         */
        const dados = await getCategoriasResumo();

        /**
         * Colocamos os dados recebidos dentro do estado.
         *
         * Isso fará o React renderizar novamente o componente.
         */
        setCategorias(dados);
      } catch (error) {
        /**
         * Se ocorrer algum problema na requisição,
         * mostramos uma mensagem amigável.
         */
        const mensagem = error instanceof Error ? error.message : "Não foi possível carregar as categorias.";

        setErroCategorias(mensagem);
      } finally {
        /**
         * Independentemente de dar certo ou errado,
         * terminamos o estado de carregamento.
         */
        setCarregandoCategorias(false);
      }
    }

    /**
     * Executa a função quando o Dashboard é carregado.
     */
    carregarCategorias();
  }, []);

  // ============================================================
  // ESTILOS DOS STATUS
  // ============================================================

  const statusStyles = {
    BAIXO: "text-warning-500 bg-warning-100",
    ESGOTADO: "text-danger-500 bg-danger-100",
    "VENCE EM 4D": "text-danger-500 bg-danger-100",
  };

  // ============================================================
  // PRODUTOS DE ATENÇÃO
  // ============================================================

  /**
   * Por enquanto essa lista continua fixa.
   *
   * Depois podemos conectar essa parte ao mesmo endpoint
   * /produtos?abaixo_minimo=true.
   */
  const alertProducts = [
    {
      id: 1,
      initials: "ME",
      name: "Arroz branco 5kg",
      category: "Mercearia",
      expiration: "vence em 20 dias",
      status: "BAIXO",
    },
    {
      id: 2,
      initials: "BE",
      name: "Leite integral",
      category: "Bebidas",
      expiration: "vence em 4 dias",
      status: "VENCE EM 4D",
    },
    {
      id: 3,
      initials: "LI",
      name: "Detergente neutro",
      category: "Limpeza",
      expiration: "vence em 400 dias",
      status: "ESGOTADO",
    },
    {
      id: 4,
      initials: "BE",
      name: "Iogurte natural",
      category: "Bebidas",
      expiration: "vence em 2 dias",
      status: "BAIXO",
    },
  ];

  // ============================================================
  // RENDERIZAÇÃO
  // ============================================================

  return (
    <div id="dashboard" className="flex min-h-screen flex-col">
      <main id="dashboard-main" className="flex-1 bg-linear-to-b from-brand-100 to-brand-50">
        <span id="dashboard-breadcrumb" className="pb-1 font-bold text-brand-900">
          1. Início
        </span>

        <Header />

        {/* =====================================================
            SAUDAÇÃO
        ====================================================== */}

        <div id="dashboard-welcome" className="my-3 flex items-center justify-around">
          <h1 id="dashboard-greeting" className="text-[22px] font-extrabold text-brand-900">
            Olá, Família Souza
          </h1>

          <span id="dashboard-date" className="mt-2 text-[12px] font-bold text-brand-500">
            {dataFormatada}
          </span>
        </div>

        {/* =====================================================
            TÍTULO - PRECISA DE ATENÇÃO
        ====================================================== */}

        <div className="mx-5 flex justify-between pb-3">
          <div id="attention-title-container">
            <h1 id="attention-title" className="font-bold">
              Precisa de atenção
            </h1>
          </div>

          <div id="attention-count-container">
            <p
              id="attention-count"
              className="flex w-15 justify-center rounded-2xl bg-danger-100 px-1 text-[14px] font-bold text-danger-400"
            >
              4 itens
            </p>
          </div>
        </div>

        {/* =====================================================
            LISTA DE PRODUTOS
        ====================================================== */}

        <div id="attention-section" className="mx-5">
          <div id="attention-product-list" className="rounded-2xl bg-white p-3 shadow-sm">
            {alertProducts.map((product) => (
              <div
                id={`attention-product-${product.id}`}
                key={product.id}
                className="grid grid-cols-[40px_1fr_auto] items-center gap-3 py-2 first:pt-0 last:pb-0"
              >
                {/* Ícone */}
                <div
                  id={`product-icon-${product.id}`}
                  className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-100 text-xs font-bold text-purple-700"
                >
                  {product.initials}
                </div>

                {/* Informações do produto */}
                <div id={`product-info-${product.id}`}>
                  <h2 className="text-[14px] leading-tight font-bold">{product.name}</h2>

                  <p className="text-[10px] text-gray-500">
                    {product.category} · {product.expiration}
                  </p>
                </div>

                {/* Status */}
                <div
                  id={`product-status-${product.id}`}
                  className={`rounded-2xl px-3 py-1 text-xs font-bold whitespace-nowrap ${
                    statusStyles[product.status as keyof typeof statusStyles]
                  }`}
                >
                  {product.status}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* =====================================================
            BOTÃO - LISTA DE COMPRAS
        ====================================================== */}

        <div id="attention-actions">
          <button
            type="button"
            className="m-auto mt-3 flex w-[90%] cursor-pointer items-center justify-center rounded-full border bg-brand-100 py-2 font-bold text-brand-800 hover:bg-brand-200 hover:shadow-sm"
          >
            Ver lista de compras
          </button>
        </div>

        {/* =====================================================
            AÇÕES
        ====================================================== */}

        <div className="mx-2 my-4 flex gap-2">
          <button
            type="button"
            className="text=[12px] flex h-24 flex-1 cursor-pointer flex-col items-start justify-between rounded-2xl bg-accent-lime-300 p-3 font-bold text-ink-900 hover:bg-accent-lime-500"
          >
            <FaPlus />

            <p className="text-left leading-tight">
              Nova entrada <br />
              no estoque
            </p>
          </button>

          <button
            type="button"
            className="flex h-24 flex-1 cursor-pointer flex-col items-start justify-between rounded-2xl bg-accent-blue-400 p-3 font-bold text-surface-card hover:bg-accent-blue-600"
          >
            <FaBars />

            <p className="text-left leading-tight">
              Registrar <br /> consumo
            </p>
          </button>
        </div>

        {/* =====================================================
            POR CATEGORIA
        ====================================================== */}

        <div className="font-bold text-ink-900">
          <h1>Por categoria</h1>

          <div className="mx-2 my-4 flex gap-2">
            {/* -------------------------------------------------
                CARREGANDO
            -------------------------------------------------- */}

            {carregandoCategorias && <p className="text-ink-500 text-sm">Carregando categorias...</p>}

            {/* -------------------------------------------------
                ERRO
            -------------------------------------------------- */}

            {!carregandoCategorias && erroCategorias && <p className="text-sm text-danger-500">{erroCategorias}</p>}

            {/* -------------------------------------------------
                NENHUMA CATEGORIA
            -------------------------------------------------- */}

            {!carregandoCategorias && !erroCategorias && categorias.length === 0 && (
              <p className="text-ink-500 text-sm">Nenhuma categoria precisa de atenção.</p>
            )}

            {/* -------------------------------------------------
                CATEGORIAS VINDAS DO BACKEND
            -------------------------------------------------- */}

            {!carregandoCategorias &&
              !erroCategorias &&
              categorias.map((categoria) => <CategoryCard key={categoria.id} categoria={categoria} />)}
          </div>
        </div>
      </main>

      <Sidebar />
    </div>
  );
}

export default Dashboard;
