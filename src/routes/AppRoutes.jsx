import { Routes, Route } from "react-router-dom";

import MainLayout from "../components/layout/MainLayout";
import AuthLayout from "../components/layout/AuthLayout";
import AdminLayout from "../layouts/AdminLayout";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import Map from "../pages/Map";
import Report from "../pages/Report";
import OccurrenceDetails from "../pages/OccurrenceDetails";
import NotFound from "../pages/NotFound";
import User from "../pages/User";

import AdminDashboard from "../pages/admin/Dashboard";
import AdminUsers from "../pages/admin/Users";
import AdminOccurrences from "../pages/admin/Occurrences";
import AdminComments from "../pages/admin/Comments";

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
        <Route path="/perfil" element={<User />} />
      </Route>

      {/* ROTAS DE AUTENTICAÇÃO */}
      <Route element={<AuthLayout />}>
        <Route path="/login" element={<Login />} />
        <Route path="/cadastro" element={<Register />} />
      </Route>

      {/* ROTAS ADMIN */}
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<AdminDashboard />} />
        <Route path="users" element={<AdminUsers />} />
        <Route path="occurrences" element={<AdminOccurrences />} />
        <Route path="comments" element={<AdminComments />} />
      </Route>

      {/* ROTA FALLBACK */}
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
}