import React, { useEffect, useState } from "react";
import { Navigate, Outlet, Link } from "react-router-dom";
import { ShieldAlert, ArrowLeft } from "lucide-react";
import AdminSidebar from "../components/admin/AdminSidebar";
import { getLoggedUser } from "../utils/auth";

export default function AdminLayout() {
  const [user, setUser] = useState(null);
  const [checking, setChecking] = useState(true);

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

  // Se não estiver logado, redireciona para login
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Se não for admin, exibe tela de erro de permissão elegante
  if (user.role !== "admin") {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center p-4 font-text">
        <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 max-w-md w-full text-center shadow-2xl relative overflow-hidden">
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
          <ShieldAlert size={56} className="text-red-500 mx-auto mb-4 animate-bounce" />
          
          <h1 className="font-title text-2xl font-bold text-white mb-2 tracking-wide">
            Acesso Restrito
          </h1>
          <p className="text-slate-400 text-sm mb-6 leading-relaxed">
            Esta área é exclusiva para administradores da plataforma. Seu usuário atual não possui permissões suficientes.
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
    <div className="min-h-screen bg-slate-50 flex font-text">
      {/* Sidebar */}
      <AdminSidebar />

      {/* Main Content Area */}
      <main className="flex-1 flex flex-col overflow-y-auto max-h-screen custom-scrollbar">
        {/* Header Bar */}
        <header className="bg-white border-b border-slate-200/80 px-8 py-4 flex items-center justify-between sticky top-0 z-10">
          <div>
            <h1 className="text-lg font-bold text-slate-800 m-0">Portal de Gestão</h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-400 font-semibold uppercase tracking-widest bg-slate-100 px-2.5 py-1 rounded-md">
              Modo Admin
            </span>
          </div>
        </header>

        {/* Content */}
        <div className="flex-1 p-8">
          <Outlet />
        </div>
      </main>
    </div>
  );
}
