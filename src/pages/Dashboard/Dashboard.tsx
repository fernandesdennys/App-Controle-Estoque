import React from "react";
import Header from "../../components/layout/Header/Header";

function Dashboard() {
  const dataAtual = new Date();

  const dias = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
  const meses = [
    "jan",
    "fev",
    "mar",
    "abr",
    "mai",
    "jun",
    "jul",
    "ago",
    "set",
    "out",
    "nov",
    "dez",
  ];

  const dataFormatada = `${dias[dataAtual.getDay()]}, ${dataAtual.getDate()} ${meses[dataAtual.getMonth()]}`;

  return (
    <main className="bg-linear-to-b from-brand-200 to-brand-100">
      <span className="font-bold text-brand-900 pb-1">1. Início</span>
      <Header />
      <div className="flex justify-around items-center my-3">
        <h1 className="font-bold text-[20px] text-brand-900">Olá, Família Souza</h1>
        <span className="font-bold text-[12px] text-brand-500">{dataFormatada}</span>
      </div>
      <div></div>
    </main>
  );
}

export default Dashboard;
