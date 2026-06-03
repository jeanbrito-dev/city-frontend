import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import {
  Users as UsersIcon,
  AlertTriangle,
  Clock,
  CheckCircle,
  MessageSquare,
  ArrowUpRight
} from "lucide-react";
import { getAdminUsers, getAdminOccurrences, getComments } from "../../services/api";
import StatusBadge from "../../components/admin/StatusBadge";

export default function Dashboard() {
  const [stats, setStats] = useState({
    users: 0,
    occurrences: 0,
    pending: 0,
    resolved: 0,
    comments: 0,
  });
  const [recentOccurrences, setRecentOccurrences] = useState([]);
  const [categoryCounts, setCategoryCounts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        setLoading(true);
        const [users, occurrences] = await Promise.all([
          getAdminUsers(),
          getAdminOccurrences(),
        ]);

        const pending = occurrences.filter((o) => o.status?.toLowerCase() === "pendente").length;
        const resolved = occurrences.filter((o) => o.status?.toLowerCase() === "resolvido").length;

        // Fetch comments in parallel
        let commentsCount = 0;
        try {
          const commentsResults = await Promise.all(
            occurrences.map((o) => getComments(o.id).catch(() => []))
          );
          commentsCount = commentsResults.reduce((acc, current) => {
            return acc + current.reduce((sum, c) => sum + 1 + (c.replies?.length || 0), 0);
          }, 0);
        } catch (err) {
          console.error("Erro ao buscar comentários do painel:", err);
        }

        // Categories breakdown
        const catsMap = {};
        occurrences.forEach((o) => {
          if (o.categoria) {
            catsMap[o.categoria] = (catsMap[o.categoria] || 0) + 1;
          }
        });
        const sortedCats = Object.entries(catsMap)
          .map(([name, count]) => ({ name, count }))
          .sort((a, b) => b.count - a.count);

        setStats({
          users: users.length,
          occurrences: occurrences.length,
          pending,
          resolved,
          comments: commentsCount,
        });

        setCategoryCounts(sortedCats);
        setRecentOccurrences(occurrences.slice(0, 5));
      } catch (err) {
        console.error("Erro ao carregar dados do dashboard:", err);
      } finally {
        setLoading(false);
      }
    }

    loadData();
  }, []);

  const cards = [
    {
      title: "Total de Usuários",
      value: stats.users,
      icon: UsersIcon,
      color: "text-blue-600 bg-blue-50 border-blue-100",
    },
    {
      title: "Total de Ocorrências",
      value: stats.occurrences,
      icon: AlertTriangle,
      color: "text-indigo-600 bg-indigo-50 border-indigo-100",
    },
    {
      title: "Aguardando Resolução",
      value: stats.pending,
      icon: Clock,
      color: "text-amber-600 bg-amber-50 border-amber-100",
    },
    {
      title: "Ocorrências Resolvidas",
      value: stats.resolved,
      icon: CheckCircle,
      color: "text-emerald-600 bg-emerald-50 border-emerald-100",
    },
    {
      title: "Comentários & Respostas",
      value: stats.comments,
      icon: MessageSquare,
      color: "text-pink-600 bg-pink-50 border-pink-100",
    },
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="h-8 bg-slate-200 rounded-md w-1/4 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-32 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="h-80 bg-slate-100 rounded-2xl border border-slate-200 lg:col-span-2 animate-pulse" />
          <div className="h-80 bg-slate-100 rounded-2xl border border-slate-200 animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 font-text">
      <div>
        <h1 className="font-title text-3xl font-bold text-slate-800 tracking-wide">Visão Geral</h1>
        <p className="text-sm text-slate-500 mt-1">Estatísticas em tempo real e monitoramento da plataforma Unicity.</p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-5">
        {cards.map((card) => {
          return (
            <div
              key={card.title}
              className={`bg-white p-5 rounded-2xl border border-slate-200/80 shadow-sm flex flex-col justify-between transition-all duration-300 hover:shadow-md hover:scale-[1.02]`}
            >
              <div className="flex items-start justify-between">
                <span className="text-[13px] font-semibold text-slate-400 uppercase tracking-wide">
                  {card.title}
                </span>
                <div className={`p-2 rounded-xl border ${card.color}`}>
                  <card.icon className="size-5" />
                </div>
              </div>
              <div className="mt-4">
                <span className="text-3xl font-bold text-slate-800 tracking-tight">
                  {card.value}
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Details Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Occurrences */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 lg:col-span-2">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-lg font-bold text-slate-800 m-0">Últimas Ocorrências</h2>
            <Link
              to="/admin/occurrences"
              className="flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
            >
              Ver todas
              <ArrowUpRight size={14} />
            </Link>
          </div>

          <div className="divide-y divide-slate-100">
            {recentOccurrences.length > 0 ? (
              recentOccurrences.map((occ) => (
                <div key={occ.id} className="py-3.5 flex items-center justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm font-semibold text-slate-800 truncate m-0">
                      {occ.titulo}
                    </p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-xs text-slate-400">
                        Por: @{occ.autor || "cidadão"}
                      </span>
                      <span className="text-slate-300">•</span>
                      <span className="text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded">
                        {occ.categoria}
                      </span>
                    </div>
                  </div>
                  <StatusBadge status={occ.status} />
                </div>
              ))
            ) : (
              <p className="text-sm text-slate-400 text-center py-6">Nenhuma ocorrência registrada.</p>
            )}
          </div>
        </div>

        {/* Categories Breakdown */}
        <div className="bg-white rounded-2xl border border-slate-200/80 shadow-sm p-6 flex flex-col">
          <h2 className="text-lg font-bold text-slate-800 mb-5">Ocorrências por Categoria</h2>
          
          <div className="flex-1 space-y-4">
            {categoryCounts.length > 0 ? (
              categoryCounts.map((cat) => {
                const total = stats.occurrences;
                const percentage = total > 0 ? Math.round((cat.count / total) * 100) : 0;
                return (
                  <div key={cat.name} className="space-y-1.5">
                    <div className="flex items-center justify-between text-xs font-semibold">
                      <span className="text-slate-600">{cat.name}</span>
                      <span className="text-slate-800">{cat.count} ({percentage}%)</span>
                    </div>
                    <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                      <div
                        className="bg-primary h-full rounded-full transition-all duration-550"
                        style={{ width: `${percentage}%` }}
                      />
                    </div>
                  </div>
                );
              })
            ) : (
              <p className="text-sm text-slate-400 text-center py-6 my-auto">Sem dados disponíveis.</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
