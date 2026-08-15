import React from "react";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Sidebar/Sidebar";

function Pantry() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="from-brand-200 to-brand-100 flex-1 bg-linear-to-b">
        <span className="text-brand-900 pb-1 font-bold">4. Histórico</span>
        <Header />
      </main>
      <Sidebar />
    </div>
  );
}
export default Pantry;
