import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft, Menu, X } from "lucide-react";
import AdminSidebar from "../admin/AdminSidebar";
import { getLoggedUser } from "../../utils/auth";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const logged = getLoggedUser();
    setUser(logged);
    setChecking(false);
  }, []);

  if (checking) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-3 text-slate-400">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
        <p className="text-sm font-medium">Verificando credenciais...</p>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-text">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />

          <ShieldAlert
            size={56}
            className="text-red-500 mx-auto mb-4 animate-bounce"
          />

          <h1 className="font-title text-2xl font-bold text-white mb-2 tracking-wide">
            Acesso Restrito
          </h1>

          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Esta área é exclusiva para administradores da plataforma. Seu usuário
            atual não possui permissões suficientes.
          </p>

          <div className="flex flex-col gap-3">
            <Link
              to="/dashboard"
              className="flex items-center justify-center gap-2 bg-primary hover:bg-primary/95 text-white font-medium py-3 rounded-2xl transition shadow-lg shadow-primary/20"
            >
              <ArrowLeft size={16} />
              Voltar ao Início
            </Link>

            <Link
              to="/login"
              className="text-xs text-slate-500 hover:text-slate-400 font-semibold underline mt-2"
            >
              Fazer login com outra conta
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex font-text overflow-x-hidden">
      {/* Overlay mobile */}
      {sidebarOpen && (
        <button
          type="button"
          aria-label="Fechar menu"
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 z-40 md:hidden"
        />
      )}

      {/* Sidebar responsiva */}
      <aside
        className={`
          fixed md:sticky md:top-0
          left-0 top-0 z-50
          h-screen w-[260px]
          bg-slate-950
          transition-transform duration-300
          ${sidebarOpen ? "translate-x-0" : "-translate-x-full"}
          md:translate-x-0
        `}
      >
        <div className="md:hidden flex justify-end p-3">
          <button
            type="button"
            aria-label="Fechar menu"
            onClick={() => setSidebarOpen(false)}
            className="w-9 h-9 rounded-xl bg-white/10 text-white flex items-center justify-center"
          >
            <X size={20} />
          </button>
        </div>

        <AdminSidebar />
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 min-w-0 flex flex-col max-h-screen overflow-y-auto custom-scrollbar">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-4 md:px-8 py-4 flex items-center justify-between sticky top-0 z-30">
          <div className="flex items-center gap-3 min-w-0">
            <button
              type="button"
              aria-label="Abrir menu"
              onClick={() => setSidebarOpen(true)}
              className="md:hidden w-10 h-10 rounded-xl bg-primary text-white flex items-center justify-center shrink-0"
            >
              <Menu size={20} />
            </button>

            <h1 className="text-base md:text-lg font-bold text-slate-800 m-0 truncate">
              Portal de Gestão
            </h1>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <span className="text-[10px] md:text-xs text-slate-400 font-semibold uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">
              Modo Admin
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-4 md:p-8 overflow-x-hidden">
          <Outlet />
        </div>
      </main>
    </div>
  );
}