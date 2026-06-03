import React, { useEffect, useState } from "react";
import { Trash2, Search, AlertTriangle } from "lucide-react";
import { getAdminUsers, deleteAdminUser } from "../../services/api";
import AdminTable from "../../components/admin/AdminTable";

export default function Users() {
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [confirmDelete, setConfirmDelete] = useState({ open: false, userId: null, userName: "" });

  useEffect(() => {
    loadUsers();
  }, []);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const data = await getAdminUsers();
      setUsers(data);
      setFilteredUsers(data);
    } catch (err) {
      console.error("Erro ao carregar usuários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const matched = users.filter((u) => {
      const nameMatch = u.nome?.toLowerCase().includes(search.toLowerCase());
      const emailMatch = u.email?.toLowerCase().includes(search.toLowerCase());
      return nameMatch || emailMatch;
    });
    setFilteredUsers(matched);
  }, [search, users]);

  const handleDelete = async () => {
    if (!confirmDelete.userId) return;
    try {
      await deleteAdminUser(confirmDelete.userId);
      setUsers((prev) => prev.filter((u) => u.id !== confirmDelete.userId));
      setConfirmDelete({ open: false, userId: null, userName: "" });
    } catch (err) {
      console.error("Erro ao deletar usuário:", err);
      alert("Erro ao excluir usuário");
    }
  };

  const columns = [
    { key: "id", label: "ID", width: "80px" },
    { key: "nome", label: "Nome" },
    { key: "email", label: "E-mail" },
    {
      key: "role",
      label: "Cargo",
      render: (row) => (
        <span
          className={`inline-flex px-2 py-0.5 rounded text-xs font-semibold uppercase tracking-wider ${
            row.role === "admin"
              ? "bg-purple-100 text-purple-700"
              : "bg-slate-100 text-slate-600"
          }`}
        >
          {row.role === "admin" ? "Administrador" : "Cidadão"}
        </span>
      ),
    },
    {
      key: "createdAt",
      label: "Registrado Em",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
    },
    {
      key: "actions",
      label: "Ações",
      width: "100px",
      render: (row) => (
        <button
          onClick={() => setConfirmDelete({ open: true, userId: row.id, userName: row.nome })}
          disabled={row.role === "admin"}
          className={`p-2 rounded-lg transition ${
            row.role === "admin"
              ? "opacity-30 cursor-not-allowed bg-slate-100 text-slate-400"
              : "bg-red-50 text-red-600 hover:bg-red-100 cursor-pointer"
          }`}
          title={row.role === "admin" ? "Não é possível excluir outro administrador" : "Excluir cidadão"}
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-text">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-3xl font-bold text-slate-800 tracking-wide">Usuários</h1>
          <p className="text-sm text-slate-500 mt-1">Gerencie os cadastros e contas registradas no sistema.</p>
        </div>

        {/* Search */}
        <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2 w-full md:w-80">
          <Search size={16} className="text-slate-400" />
          <input
            type="text"
            placeholder="Buscar por nome ou e-mail..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="flex-1 text-sm outline-none bg-transparent"
          />
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredUsers}
        loading={loading}
        emptyMessage="Nenhum usuário correspondente à pesquisa."
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
              Você tem certeza que deseja excluir permanentemente o usuário{" "}
              <span className="font-semibold text-slate-700">"{confirmDelete.userName}"</span>?
              Todas as ocorrências associadas a esta conta serão desvinculadas ou removidas.
            </p>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete({ open: false, userId: null, userName: "" })}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition text-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition text-sm shadow-lg shadow-red-600/20 cursor-pointer"
              >
                Excluir Conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
