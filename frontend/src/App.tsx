import React from "react";
import { Routes, Route } from "react-router-dom";
import Dashboard from "./pages/Dashboard/Dashboard";
import Pantry from "./pages/Pantry/Pantry";
import ShoppingList from "./pages/ShoppingList/ShoppingList";
import HistoryPage from "./pages/History/History";
import Login from "./pages/Login/Login";
import RotaPrivada from "./routes/components/RotaPrivada";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login />} />
      <Route path="/login" element={<Login />} />

      <Route
        path="/dashboard"
        element={
          <RotaPrivada>
            <Dashboard />
          </RotaPrivada>
        }
      />
      <Route
        path="/pantry"
        element={
          <RotaPrivada>
            <Pantry />
          </RotaPrivada>
        }
      />
      <Route
        path="/shopping-list"
        element={
          <RotaPrivada>
            <ShoppingList />
          </RotaPrivada>
        }
      />
      <Route
        path="/history"
        element={
          <RotaPrivada>
            <HistoryPage />
          </RotaPrivada>
        }
      />
    </Routes>
  );
}

export default App;
