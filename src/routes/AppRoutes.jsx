import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Map from "../pages/Map";
import Report from "../pages/Report";
import OccurrenceDetails from "../pages/OccurrenceDetails";
import NotFound from "../pages/NotFound";

export default function AppRoutes() {
  return (
    <Routes>
      {/* ROTAS COM LAYOUT PRINCIPAL */}
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/mapa" element={<Map />} />
        <Route path="/relatar" element={<Report />} />
        <Route path="/ocorrencia/:id" element={<OccurrenceDetails />} />
      </Route>

      {/* ROTAS DE AUTENTICAÇÃO */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      {/* ROTA FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}