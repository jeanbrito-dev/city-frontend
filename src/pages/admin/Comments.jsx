import React, { useEffect, useState } from "react";
import { Trash2, Search, Filter, AlertTriangle, MessageCircle, X } from "lucide-react";
import {
  getAdminOccurrences,
  getComments,
  deleteAdminComment,
  deleteAdminReply,
} from "../../services/api";
import AdminTable from "../../components/admin/AdminTable";

export default function Comments() {
  const [occurrences, setOccurrences] = useState([]);
  const [comments, setComments] = useState([]);
  const [filteredComments, setFilteredComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [occurrenceFilter, setOccurrenceFilter] = useState("Todos");
  const [confirmDelete, setConfirmDelete] = useState({ open: false, type: "", commentId: null, replyId: null, text: "", occurrenceId: null });
  const [activeRepliesModal, setActiveRepliesModal] = useState({ open: false, comment: null });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setLoading(true);
      const occList = await getAdminOccurrences();
      setOccurrences(occList);

      // Load comments for all occurrences in parallel
      const commentsResults = await Promise.all(
        occList.map(async (o) => {
          try {
            const list = await getComments(o.id);
            return list.map((c) => ({
              ...c,
              occurrenceId: o.id,
              occurrenceTitle: o.titulo,
            }));
          } catch {
            return [];
          }
        })
      );

      const flatComments = commentsResults.flat();
      // Sort by date desc
      flatComments.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setComments(flatComments);
      setFilteredComments(flatComments);
    } catch (err) {
      console.error("Erro ao carregar comentários:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const matched = comments.filter((c) => {
      const textMatch = c.texto?.toLowerCase().includes(search.toLowerCase());
      const authorMatch = c.autor?.toLowerCase().includes(search.toLowerCase());
      const occMatch = occurrenceFilter === "Todos" || Number(c.occurrenceId) === Number(occurrenceFilter);
      return (textMatch || authorMatch) && occMatch;
    });
    setFilteredComments(matched);
  }, [search, occurrenceFilter, comments]);

  const handleDelete = async () => {
    const { type, commentId, replyId, occurrenceId } = confirmDelete;
    try {
      if (type === "comment") {
        await deleteAdminComment(commentId);
        
        // Update local state
        setComments((prev) => prev.filter((c) => c.id !== commentId));
        
        // If the active replies modal is open for this comment, close it
        if (activeRepliesModal.open && activeRepliesModal.comment?.id === commentId) {
          setActiveRepliesModal({ open: false, comment: null });
        }
      } else if (type === "reply") {
        await deleteAdminReply(replyId);
        
        // Update replies in local state
        setComments((prev) =>
          prev.map((c) => {
            if (c.id !== commentId) return c;
            return {
              ...c,
              replies: c.replies.filter((r) => r.id !== replyId),
            };
          })
        );

        // Update modal state if open
        if (activeRepliesModal.open && activeRepliesModal.comment?.id === commentId) {
          setActiveRepliesModal((prev) => ({
            ...prev,
            comment: {
              ...prev.comment,
              replies: prev.comment.replies.filter((r) => r.id !== replyId),
            },
          }));
        }
      }
      setConfirmDelete({ open: false, type: "", commentId: null, replyId: null, text: "", occurrenceId: null });
    } catch (err) {
      console.error("Erro ao deletar:", err);
      alert("Erro ao excluir item");
    }
  };

  const columns = [
    {
      key: "occurrenceTitle",
      label: "Relato",
      width: "220px",
      render: (row) => (
        <span className="font-semibold text-slate-800 line-clamp-2">
          {row.occurrenceTitle}
        </span>
      ),
    },
    {
      key: "autor",
      label: "Autor",
      width: "140px",
      render: (row) => <span className="text-primary font-medium">{row.autor}</span>,
    },
    {
      key: "texto",
      label: "Comentário",
      render: (row) => <p className="text-slate-600 line-clamp-3 m-0">{row.texto}</p>,
    },
    {
      key: "replies",
      label: "Respostas",
      width: "120px",
      render: (row) => {
        const count = row.replies?.length || 0;
        return (
          <button
            onClick={() => setActiveRepliesModal({ open: true, comment: row })}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border ${
              count > 0
                ? "bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 cursor-pointer"
                : "bg-slate-50 text-slate-400 border-slate-200 cursor-pointer hover:bg-slate-100"
            }`}
          >
            <MessageCircle size={14} />
            <span>{count}</span>
          </button>
        );
      },
    },
    {
      key: "createdAt",
      label: "Enviado Em",
      width: "140px",
      render: (row) =>
        row.createdAt
          ? new Date(row.createdAt).toLocaleDateString("pt-BR", {
              day: "2-digit",
              month: "2-digit",
              hour: "2-digit",
              minute: "2-digit",
            })
          : "N/A",
    },
    {
      key: "actions",
      label: "Ações",
      width: "80px",
      render: (row) => (
        <button
          onClick={() =>
            setConfirmDelete({
              open: true,
              type: "comment",
              commentId: row.id,
              occurrenceId: row.occurrenceId,
              text: row.texto,
            })
          }
          className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition cursor-pointer"
          title="Excluir comentário"
        >
          <Trash2 size={16} />
        </button>
      ),
    },
  ];

  return (
    <div className="space-y-6 font-text">
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div>
          <h1 className="font-title text-3xl font-bold text-slate-800 tracking-wide">Comentários</h1>
          <p className="text-sm text-slate-500 mt-1">Modere os comentários e respostas enviados pelos cidadãos nas ocorrências.</p>
        </div>

        {/* Filters */}
        <div className="flex flex-col md:flex-row gap-3 items-center w-full lg:w-auto">
          {/* Search */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2 w-full md:w-64">
            <Search size={16} className="text-slate-400" />
            <input
              type="text"
              placeholder="Buscar por texto ou autor..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent"
            />
          </div>

          {/* Filter by Occurrence */}
          <div className="bg-white border border-slate-200 shadow-sm rounded-xl px-4 py-2.5 flex items-center gap-2 w-full md:w-64">
            <Filter size={16} className="text-slate-400" />
            <select
              value={occurrenceFilter}
              onChange={(e) => setOccurrenceFilter(e.target.value)}
              className="flex-1 text-sm outline-none bg-transparent text-slate-600 cursor-pointer"
            >
              <option value="Todos">Todos os relatos</option>
              {occurrences.map((o) => (
                <option key={o.id} value={o.id}>
                  {o.titulo}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <AdminTable
        columns={columns}
        data={filteredComments}
        loading={loading}
        emptyMessage="Nenhum comentário correspondente."
      />

      {/* Comment & Replies Inspector Modal */}
      {activeRepliesModal.open && activeRepliesModal.comment && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-40 px-4">
          <div className="bg-white rounded-3xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200/80 bg-slate-50 flex items-center justify-between">
              <div>
                <h3 className="font-bold text-slate-800 text-base m-0">Moderando Respostas</h3>
                <p className="text-xs text-slate-400 mt-0.5">Comentário principal por {activeRepliesModal.comment.autor}</p>
              </div>
              <button
                onClick={() => setActiveRepliesModal({ open: false, comment: null })}
                className="p-1.5 rounded-lg hover:bg-slate-200 text-slate-400 hover:text-slate-700 transition cursor-pointer"
              >
                <X size={18} />
              </button>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-y-auto p-6 space-y-5 custom-scrollbar">
              {/* Main Comment */}
              <div className="bg-slate-50 border border-slate-200/60 rounded-2xl p-4">
                <p className="text-xs text-slate-400 font-semibold m-0">COMENTÁRIO PRINCIPAL</p>
                <p className="text-sm text-slate-700 mt-2 font-normal leading-relaxed">{activeRepliesModal.comment.texto}</p>
              </div>

              {/* Replies List */}
              <div className="space-y-4">
                <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                  Respostas ({activeRepliesModal.comment.replies?.length || 0})
                </h4>

                {activeRepliesModal.comment.replies?.length > 0 ? (
                  <div className="space-y-3 pl-3 border-l-2 border-slate-200">
                    {activeRepliesModal.comment.replies.map((reply) => (
                      <div key={reply.id} className="bg-white border border-slate-100 rounded-xl p-3.5 flex items-start justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-xs font-bold text-slate-800">
                              {reply.autor}
                            </span>
                            {reply.isAuthor && (
                              <span className="bg-blue-50 text-blue-600 border border-blue-100 text-[10px] font-bold px-1.5 py-0.2 rounded">
                                Autor do relato
                              </span>
                            )}
                            <span className="text-[10px] text-slate-400">
                              {new Date(reply.createdAt).toLocaleDateString("pt-BR")}
                            </span>
                          </div>
                          <p className="text-xs text-slate-600 leading-relaxed font-normal m-0">{reply.texto}</p>
                        </div>
                        <button
                          onClick={() =>
                            setConfirmDelete({
                              open: true,
                              type: "reply",
                              commentId: activeRepliesModal.comment.id,
                              replyId: reply.id,
                              occurrenceId: activeRepliesModal.comment.occurrenceId,
                              text: reply.texto,
                            })
                          }
                          className="p-1.5 rounded bg-red-50 text-red-500 hover:bg-red-100 hover:text-red-700 transition cursor-pointer"
                          title="Excluir resposta"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-xs text-slate-400 text-center py-4 bg-slate-50/50 rounded-xl">Sem respostas neste comentário.</p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
              Você tem certeza que deseja excluir permanentemente {confirmDelete.type === "comment" ? "este comentário" : "esta resposta"}?
            </p>
            <div className="bg-slate-50 border border-slate-150 rounded-xl p-3.5 text-xs text-slate-600 mt-3 italic line-clamp-3">
              "{confirmDelete.text}"
            </div>

            <div className="flex justify-end gap-3 mt-6">
              <button
                onClick={() => setConfirmDelete({ open: false, type: "", commentId: null, replyId: null, text: "", occurrenceId: null })}
                className="px-4 py-2.5 rounded-xl bg-slate-100 text-slate-600 font-semibold hover:bg-slate-200 transition text-sm cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleDelete}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white font-semibold transition text-sm shadow-lg shadow-red-600/20 cursor-pointer"
              >
                Excluir
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
