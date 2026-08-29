import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pantry from "./pages/Pantry/Pantry";
import ShoppingList from "./pages/ShoppingList/ShoppingList";
import HistoryPage from "./pages/History/History";
import Login from "./pages/Login/Login";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<Dashboard />} />
      <Route path="/pantry" element={<Pantry />} />
      <Route path="/shopping-list" element={<ShoppingList />} />
      <Route path="/history" element={<HistoryPage />} />
    </Routes>
  );
}

export default App;
