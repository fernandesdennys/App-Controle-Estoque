import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

interface RotaPrivadaProps {
  children: React.ReactNode;
}

export default function RotaPrivada({ children }: RotaPrivadaProps) {
  const { estaLogado } = useAuth();

  if (!estaLogado) {
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
}