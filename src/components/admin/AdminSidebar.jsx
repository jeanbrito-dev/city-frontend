import React from "react";
import { NavLink, useNavigate } from "react-router-dom";
import {
  LayoutDashboard,
  Users,
  AlertTriangle,
  MessageSquare,
  ArrowLeft,
  LogOut,
  ShieldAlert,
} from "lucide-react";
import { getLoggedUser, logout } from "../../utils/auth";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const user = getLoggedUser();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
    { path: "/admin/occurrences", label: "Ocorrências", icon: AlertTriangle },
    { path: "/admin/users", label: "Usuários", icon: Users },
    { path: "/admin/comments", label: "Comentários", icon: MessageSquare },
  ];

  return (
    <div className="w-full h-full bg-slate-900 text-slate-100 flex flex-col border-r border-slate-800 shadow-xl overflow-hidden">
      {/* Header / Logo */}
      <div className="p-5 md:p-6 border-b border-slate-800/60 flex items-center gap-3 shrink-0">
        <div className="bg-primary/20 p-2 rounded-xl border border-primary/40 shrink-0">
          <ShieldAlert className="text-primary size-6 animate-pulse" />
        </div>

        <div className="min-w-0">
          <h2 className="font-title text-lg md:text-xl font-bold tracking-wider text-white m-0 truncate">
            UNICITY
          </h2>

          <p className="text-[10px] text-primary font-semibold uppercase tracking-widest mt-0.5 truncate">
            Painel Admin
          </p>
        </div>
      </div>

      {/* Nav links */}
      <nav className="flex-1 px-4 py-5 md:py-6 space-y-1.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            end={item.exact}
            className={({ isActive }) =>
              `flex items-center gap-3.5 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 group ${
                isActive
                  ? "bg-primary text-white shadow-lg shadow-primary/25"
                  : "text-slate-400 hover:bg-slate-800/50 hover:text-slate-100"
              }`
            }
          >
            <item.icon className="size-5 shrink-0 transition-transform duration-200 group-hover:scale-105" />
            <span className="truncate">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      {/* Footer Section */}
      <div className="p-4 border-t border-slate-800/60 bg-slate-950/40 flex flex-col gap-2 shrink-0">
        {/* Profile Card */}
        <div className="flex items-center gap-3 px-2 py-1.5 mb-2 min-w-0">
          <div className="size-9 rounded-full bg-slate-800 flex items-center justify-center border border-slate-700 text-primary font-bold text-sm shrink-0">
            {user?.nome ? user.nome[0].toUpperCase() : "A"}
          </div>

          <div className="min-w-0 flex-1">
            <p className="text-xs font-semibold text-slate-200 truncate m-0">
              {user?.nome || "Administrador"}
            </p>

            <p className="text-[10px] text-slate-500 truncate m-0">
              {user?.email || "admin@city.com"}
            </p>
          </div>
        </div>

        {/* Buttons */}
        <div className="grid grid-cols-2 gap-2">
          <button
            onClick={() => navigate("/dashboard")}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-slate-800 text-slate-300 border border-slate-700 hover:bg-slate-700 hover:text-white transition cursor-pointer min-w-0"
            title="Voltar ao portal"
          >
            <ArrowLeft className="size-3.5 shrink-0" />
            <span className="truncate">Voltar</span>
          </button>

          <button
            onClick={handleLogout}
            className="flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl text-xs font-medium bg-red-950/20 text-red-400 border border-red-900/30 hover:bg-red-900/20 hover:text-red-300 transition cursor-pointer min-w-0"
            title="Sair"
          >
            <LogOut className="size-3.5 shrink-0" />
            <span className="truncate">Sair</span>
          </button>
        </div>
      </div>
    </div>
  );
}