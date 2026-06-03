import React, { useEffect, useState } from "react";
import { Trash2, Search, Filter, AlertTriangle, Eye } from "lucide-react";
import { getAdminOccurrences, updateAdminOccurrenceStatus, deleteAdminOccurrence } from "../../services/api";
import AdminTable from "../../components/admin/AdminTable";
import StatusBadge from "../../components/admin/StatusBadge";

export default function Occurrences() {
  const [occurrences, setOccurrences] = useState([]);
  const [filteredOccurrences, setFilteredOccurrences] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("Todas");
  const [confirmDelete, setConfirmDelete] = useState({ open: false, id: null, title: "" });
  const [updatingStatusId, setUpdatingStatusId] = useState(null);

  useEffect(() => {
    loadOccurrences();
  }, []);

  const loadOccurrences = async () => {
    try {
      setLoading(true);
      const data = await getAdminOccurrences();
      setOccurrences(data);
      setFilteredOccurrences(data);
    } catch (err) {
      console.error("Erro ao carregar ocorrências:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const matched = occurrences.filter((o) => {
      const titleMatch = o.titulo?.toLowerCase().includes(search.toLowerCase());
      const authorMatch = o.autor?.toLowerCase().includes(search.toLowerCase());
      const categoryMatch = categoryFilter === "Todas" || o.categoria === categoryFilter;
      return (titleMatch || authorMatch) && categoryMatch;
    });
    setFilteredOccurrences(matched);
  }, [search, categoryFilter, occurrences]);

  const handleDelete = async () => {
    if (!confirmDelete.id) return;
    try {
      await deleteAdminOccurrence(confirmDelete.id);
      setOccurrences((prev) => prev.filter((o) => o.id !== confirmDelete.id));
      setConfirmDelete({ open: false, id: null, title: "" });
    } catch (err) {
      console.error("Erro ao deletar ocorrência:", err);
      alert("Erro ao excluir ocorrência");
    }
  };

  const handleStatusChange = async (id, newStatus) => {
    try {
      setUpdatingStatusId(id);
      await updateAdminOccurrenceStatus(id, newStatus);
      setOccurrences((prev) =>
        prev.map((o) => (o.id === id ? { ...o, status: newStatus } : o))
      );
    } catch (err) {
      console.error("Erro ao atualizar status:", err);
      alert("Erro ao alterar status");
    } finally {
      setUpdatingStatusId(null);
    }
  };

  const categories = [
    "Todas",
    ...new Set(occurrences.map((o) => o.categoria).filter(Boolean)),
  ];

  const columns = [
    { key: "id", label: "ID", width: "70px" },
    { key: "titulo", label: "Título" },
    { key: "categoria", label: "Categoria", width: "150px" },
    {
      key: "autor",
      label: "Autor",
      render: (row) => <span>@{row.autor || "cidadão"}</span>,
    },
    {
      key: "status",
      label: "Status",
      width: "180px",
      render: (row) => (
        <div className="flex items-center gap-2">
          {updatingStatusId === row.id ? (
            <span className="text-xs text-slate-400">Salvando...</span>
          ) : (
            <select
              value={row.status || "pendente"}
              onChange={(e) => handleStatusChange(row.id, e.target.value)}
              className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2 py-1 outline-none text-slate-700 focus:border-primary focus:bg-white cursor-pointer"
            >
              <option value="pendente">Pendente</option>
              <option value="em_progresso">Em Progresso</option>
              <option value="resolvido">Resolvido</option>
            </select>
          )}
          <StatusBadge status={row.status} />
        </div>
      ),
    },
    {
      key: "createdAt",
      label: "Data",
      width: "140px",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("pt-BR")
          : "N/A",
    },
    {
      key: "actions",
      label: "Ações",
      width: "120px",
      render: (row) => (
        <div className="flex items-center gap-2">
          <a
            href={`/ocorrencia/${row.id}`}
            target="_blank"
            rel="noopener noreferrer"
            className="p-2 rounded-lg bg-slate-100 text-slate-600 hover:bg-slate-200 transition"
            title="Visualizar no portal"
          >
            <Eye size={16} />
          </a>
          <button
            onClick={() => setConfirmDelete({ open: true, id: row.id, title: row.titulo })}
            className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
            title="Excluir ocorrência"
          >
            <Trash2 size={16} />
          </button>
        </div>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-text">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-3xl font-bold text-slate-800 tracking-wide">Ocorrências</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os relatos urbanos, atualize seus status e remova duplicados.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center w-full lg:w-auto">
          {/* Search */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2 w-full md:w-64">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por título ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>

          {/* Dropdown Category */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2 w-full md:w-56">
            <Filter size={16} className="text-slate-400" />
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-slate-600 cursor-pointer"
            >
              {categories.map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredOccurrences}
        loading={loading}
        emptyMessage="Nenhuma ocorrência encontrada para os filtros selecionados."
      />

      {/* Delete Confirmation Modal */}
      {confirmDelete.open && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-3xl w-full max-w-md p-6 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 right-0 h-1.5 bg-red-600" />
            <div className="flex items-center gap-3 mb-4">
              <div className="bg-red-50 p-2.5 rounded-xl border border-red-100">
                <AlertTriangle className="text-red-600 size-6 animate-pulse" />
              </div>
              <h2 className="text-lg font-bold text-slate-800 m-0">Confirmar Exclusão</h2>
            </div>

            <p className="text-sm text-slate-500 leading-relaxed">
              Você tem certeza que deseja excluir permanentemente a ocorrência{" "}
              <span className="font-semibold text-slate-700">"{confirmDelete.title}"</span>?
              Esta ação removerá a postagem do mapa público e também todos os seus comentários.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete({ open: false, id: null, title: "" })}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition text-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition text-sm shadow-lg shadow-red-600/20 cursor-pointer"
              >
                Excluir Relato
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
