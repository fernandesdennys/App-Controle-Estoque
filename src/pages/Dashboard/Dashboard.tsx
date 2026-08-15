import React from "react";
import Sidebar from "../../components/layout/Sidebar/Sidebar";
import Header from "../../components/layout/Header/Header";

function Dashboard() {
  const dataAtual = new Date();

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = ["jan", "fev", "mar", "abr", "mai", "jun", "jul", "ago", "set", "out", "nov", "dez"];
  const dataFormatada = `${dias[dataAtual.getDay()]}, ${dataAtual.getDate()} ${meses[dataAtual.getMonth()]}`;

  const statusStyles = {
    BAIXO: "text-warning-500 bg-warning-100",
    ESGOTADO: "text-danger-500 bg-danger-100",
    "VENCE EM 4D": "text-danger-500 bg-danger-100",
  };

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

  return (
    <div id="dashboard" className="flex min-h-screen flex-col">
      <main id="dashboard-main" className="flex-1 bg-linear-to-b from-brand-200 to-brand-100">
        <span id="dashboard-breadcrumb" className="pb-1 font-bold text-brand-900">
          1. Início
        </span>

        <Header />

        <div id="dashboard-welcome" className="my-3 flex items-center justify-around">
          <h1 id="dashboard-greeting" className="text-[22px] font-extrabold text-brand-900">
            Olá, Família Souza
          </h1>

          <span id="dashboard-date" className="mt-2 text-[12px] font-bold text-brand-500">
            {dataFormatada}
          </span>
        </div>

        <div className="mx-5 flex justify-between pb-3">
          <div id="attention-title-container">
            <h1 id="attention-title" className="font-bold">
              Precisa de atenção
            </h1>
          </div>
          <div id="attention-count-container">
            <p id="attention-count" className="flex w-15 justify-center rounded-2xl bg-danger-100 px-1 text-[14px] font-bold text-danger-400">
              4 itens
            </p>
          </div>
        </div>

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
                  className={`rounded-2xl px-3 py-1 text-xs font-bold whitespace-nowrap ${statusStyles[product.status as keyof typeof statusStyles]}`}
                >
                  {product.status}
                </div>
              </div>
            ))}
          </div>
        </div>
        <div id="attention-actions">
          <button
            type="button"
            className="m-auto mt-3 flex w-[90%] cursor-pointer items-center justify-center rounded-full bg-brand-200 py-2 font-bold text-brand-800 hover:bg-brand-100 hover:shadow-sm"
          >
            Ver lista de compras
          </button>
        </div>
      </main>

      <Sidebar />
    </div>
  );
}

export default Dashboard;
