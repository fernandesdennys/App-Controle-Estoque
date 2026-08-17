import React from "react";
import Header from "../../components/layout/Header/Header";
import Sidebar from "../../components/layout/Footer/BottomNavigation";

function Pantry() {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 bg-linear-to-b from-brand-200 to-brand-100">
        <span className="pb-1 font-bold text-brand-900">3. Lista de Compras</span>
        <Header />
      </main>
      <Sidebar />
    </div>
  );
}
export default Pantry;
