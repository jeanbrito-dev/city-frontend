import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import {
  ThumbsUp,
  MessageCircle,
  AlertCircle,
  Pencil,
  Trash2,
  Check,
  X,
} from "lucide-react";

import {
  getOccurrenceById,
  getComments,
  addComment as apiAddComment,
  addReply as apiAddReply,
  toggleLike as apiToggleLike,
  updateComment as apiUpdateComment,
  deleteComment as apiDeleteComment,
  updateReply as apiUpdateReply,
  deleteReply as apiDeleteReply,
} from "../services/api";
import { getLoggedUser as getAuthUser } from "../utils/auth";

export default function OccurrenceDetails() {
  const { id } = useParams();

  const [occurrence, setOccurrence] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [liked, setLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [commentText, setCommentText] = useState("");
  const [comments, setComments] = useState([]);
  const [replyingTo, setReplyingTo] = useState(null);
  const [replyText, setReplyText] = useState("");
  const [editingComment, setEditingComment] = useState(null);
  const [editingReply, setEditingReply] = useState(null);

  const [successModal, setSuccessModal] = useState("");
  const [errorModal, setErrorModal] = useState("");

  const [confirmDelete, setConfirmDelete] = useState({
    open: false,
    type: null,
    commentId: null,
    replyId: null,
  });

  const [editText, setEditText] = useState("");

  // Pega o usuário logado
  const getLoggedUser = () => {
    try {
      return getAuthUser();
    } catch {
      return null;
    }
  };

  const isOwner = (author) => {
    const user = getLoggedUser();
    if (!user) return false;

    return author === `@${user.nome}`;
  };

  // Busca dados da ocorrência
  useEffect(() => {
    const fetchOccurrence = async () => {
      try {
        setLoading(true);
        const data = await getOccurrenceById(id);
        setOccurrence(data);
        setLikesCount(data.likes || 0);

        // Verifica se o usuário logado já curtiu
        const user = getLoggedUser();
        if (user && data.likedBy) {
          setLiked(data.likedBy.includes(user.id));
        }
      } catch (err) {
        console.error(err);
        setError("Ocorrência não encontrada");
      } finally {
        setLoading(false);
      }
    };

    fetchOccurrence();
  }, [id]);

  // Busca comentários desta ocorrência (separado)
  useEffect(() => {
    const fetchComments = async () => {
      try {
        const data = await getComments(id);
        setComments(data);
      } catch (err) {
        console.error("Erro ao buscar comentários:", err);
        setComments([]);
      }
    };

    fetchComments();
  }, [id]);

  const handleLike = async () => {
    const user = getLoggedUser();
    if (!user) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikesCount((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const result = await apiToggleLike(id, user.id);
      setLikesCount(result.likes);
      setLiked(result.liked);
    } catch (err) {
      console.error("Erro ao curtir:", err);
      // reverte em caso de erro
      setLiked(wasLiked);
      setLikesCount((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  // Enviar comentário novo via API
  const handleComment = async () => {
    if (!commentText.trim()) return;
    const user = getLoggedUser();
    const userName = user?.nome || "Anônimo";

    try {
      const newComment = await apiAddComment(id, {
        autor: `@${userName}`,
        texto: commentText,
      });

      setComments((prev) => [...prev, newComment]);
      setCommentText("");
    } catch (err) {
      console.error("Erro ao comentar:", err);
    }
  };

  // Enviar resposta via API
  const handleReply = async (commentId) => {
    if (!replyText.trim()) return;
    const user = getLoggedUser();
    const userName = user?.nome || "Anônimo";
    const isOccurrenceAuthor =
      userName.toLowerCase() === occurrence?.autor?.toLowerCase();

    try {
      const newReply = await apiAddReply(id, commentId, {
        autor: `@${userName}`,
        texto: replyText,
        isAuthor: isOccurrenceAuthor,
      });

      setComments((prev) =>
        prev.map((c) => {
          if (c.id === commentId) {
            return { ...c, replies: [...(c.replies || []), newReply] };
          }
          return c;
        }),
      );

      setReplyText("");
      setReplyingTo(null);
    } catch (err) {
      console.error("Erro ao responder:", err);
    }
  };

  const handleEditComment = async (commentId) => {
    if (!editText.trim()) return;

    try {
      const updated = await apiUpdateComment(id, commentId, {
        texto: editText,
      });

      setComments((prev) =>
        prev.map((c) => (c.id === commentId ? updated : c)),
      );

      setEditingComment(null);
      setEditText("");
      setSuccessModal("Comentário atualizado");
    } catch (err) {
      console.error("Erro ao editar comentário:", err);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await apiDeleteComment(id, commentId);

      setComments((prev) => prev.filter((c) => c.id !== commentId));

      setSuccessModal("Comentário deletado com sucesso");

      setConfirmDelete({
        open: false,
        type: null,
        commentId: null,
        replyId: null,
      });
    } catch (err) {
      console.error(err);

      setErrorModal("Erro ao deletar comentário");
    }
  };

  const handleEditReply = async (commentId, replyId) => {
    if (!editText.trim()) return;

    try {
      const updatedReply = await apiUpdateReply(id, commentId, replyId, {
        texto: editText,
      });

      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;

          return {
            ...c,
            replies: c.replies.map((r) =>
              r.id === replyId ? updatedReply : r,
            ),
          };
        }),
      );

      setEditingReply(null);
      setEditText("");
      setSuccessModal("Resposta atualizada");
    } catch (err) {
      console.error("Erro ao editar resposta:", err);
    }
  };

  const handleDeleteReply = async (commentId, replyId) => {
    try {
      await apiDeleteReply(id, commentId, replyId);

      setComments((prev) =>
        prev.map((c) => {
          if (c.id !== commentId) return c;

          return {
            ...c,
            replies: c.replies.filter((r) => r.id !== replyId),
          };
        }),
      );

      setSuccessModal("Resposta deletada com sucesso");

      setConfirmDelete({
        open: false,
        type: null,
        commentId: null,
        replyId: null,
      });
    } catch (err) {
      console.error(err);

      setErrorModal("Erro ao deletar resposta");
    }
  };

  // Contagem total
  const totalComments = comments.reduce(
    (acc, c) => acc + 1 + (c.replies?.length || 0),
    0,
  );

  // Loading
  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4 font-text">
        <div className="w-10 h-10 rounded-full border-3 border-primary border-t-transparent animate-spin" />
        <p className="text-gray-400 text-sm">Carregando ocorrência...</p>
      </div>
    );
  }

  // Error
  if (error || !occurrence) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center p-4 font-text">
        <div className="bg-white rounded-2xl p-8 text-center max-w-[360px] shadow-sm">
          <AlertCircle size={48} className="text-danger mx-auto" />
          <h2 className="font-title text-xl font-semibold mt-4 mb-2">
            Ocorrência não encontrada
          </h2>
          <p className="text-gray-500 text-sm">
            A ocorrência que você procura pode ter sido removida ou o link está
            incorreto.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F3F3F3] font-text">
      <div className="max-w-[1100px] mx-auto px-4 py-6 md:px-8 md:py-10">
        <div className="bg-tertiary/25 rounded-2xl p-5 md:p-8">
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* ===== COLUNA ESQUERDA ===== */}
            <div className="flex-1 flex flex-col">
              <h1 className="font-title text-[26px] md:text-[30px] font-bold text-gray-900 leading-tight">
                {occurrence.titulo}
              </h1>

              <p className="text-[13px] text-gray-600 mt-1 mb-4">
                Ocorrência feita por{" "}
                <span className="text-primary font-medium">
                  @{occurrence.autor}
                </span>
              </p>

              <div className="rounded-2xl overflow-hidden mb-5 aspect-[4/3] bg-gray-300">
                {occurrence.imagemUrl ? (
                  <img
                    src={occurrence.imagemUrl}
                    alt={occurrence.titulo}
                    className="w-full h-full object-cover block"
                  />
                ) : (
                  <div className="w-full h-full flex flex-col items-center justify-center text-gray-400">
                    <AlertCircle size={48} />
                    <p className="mt-2 text-sm">Sem imagem</p>
                  </div>
                )}
              </div>

              <div className="mb-5">
                <h3 className="text-[15px] font-semibold text-gray-900 mb-2 border-b-2 border-primary inline-block pb-0.5">
                  Descrição
                </h3>

                <div className="bg-white rounded-xl px-5 py-4 shadow-sm">
                  <p className="text-[13px] text-gray-600 leading-relaxed m-0">
                    {occurrence.descricao || "Sem descrição disponível."}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-6 mt-auto">
                <button
                  onClick={handleLike}
                  className={`flex items-center gap-1.5 text-base bg-transparent border-none cursor-pointer font-text ${
                    liked ? "text-primary" : "text-gray-600"
                  }`}
                >
                  <ThumbsUp
                    size={20}
                    className={liked ? "fill-primary text-primary" : ""}
                  />

                  <span className="font-medium">{likesCount}</span>
                </button>

                <div className="flex items-center gap-1.5 text-base text-gray-600">
                  <MessageCircle size={20} />

                  <span className="font-medium">{totalComments}</span>
                </div>
              </div>
            </div>

            {/* ===== COMENTÁRIOS ===== */}
            <div className="flex-1 bg-white rounded-2xl px-5 py-5 md:px-6 md:py-6 shadow-sm flex flex-col">
              <h2 className="font-title text-[20px] md:text-[22px] font-semibold text-gray-900 text-center mb-4">
                Comentários
              </h2>

              <div className="flex-1 overflow-y-auto max-h-[450px] pr-1 custom-scrollbar">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="mb-4 bg-[#F7F7F7] rounded-2xl p-4 border border-gray-200"
                    >
                      {/* HEADER */}
                      <div className="flex items-start justify-between gap-3">
                        <div>
                          <span className="text-[13px] font-semibold text-gray-900 block">
                            {comment.autor}
                          </span>

                          <span className="text-[10px] text-gray-400">
                            {new Date(comment.createdAt).toLocaleString(
                              "pt-BR",
                            )}
                          </span>
                        </div>

                        {isOwner(comment.autor) && (
                        <div className="flex gap-2">
                          <button
                            onClick={() => {
                              setEditingComment(comment.id);
                              setEditText(comment.texto);
                            }}
                            className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                          >
                            <Pencil size={13} />
                          </button>

                          <button
                            onClick={() =>
                              setConfirmDelete({
                                open: true,
                                type: "comment",
                                commentId: comment.id,
                                replyId: null,
                              })
                            }
                            className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                        )}
                      </div>

                      {/* TEXTO */}
                      {editingComment === comment.id ? (
                        <div className="flex gap-2 mt-3">
                          <input
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-[12px] outline-none focus:border-primary"
                          />

                          <button
                            onClick={() => handleEditComment(comment.id)}
                            className="bg-primary text-white p-2 rounded-xl"
                          >
                            <Check size={14} />
                          </button>

                          <button
                            onClick={() => {
                              setEditingComment(null);
                              setEditText("");
                            }}
                            className="bg-gray-200 text-gray-600 p-2 rounded-xl"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ) : (
                        <p className="text-[13px] text-gray-600 mt-3 leading-relaxed">
                          {comment.texto}
                        </p>
                      )}

                      {/* BOTÃO RESPONDER */}
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id,
                          )
                        }
                        className="text-primary text-[11px] font-medium mt-2 hover:underline"
                      >
                        Responder
                      </button>

                      {/* RESPOSTAS */}
                      {comment.replies?.length > 0 && (
                        <div className="mt-4 ml-4 flex flex-col gap-3 border-l-2 border-gray-200 pl-4">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`rounded-2xl p-3 ${
                                reply.isAuthor
                                  ? "bg-[#EEF2FA] border border-primary/20"
                                  : "bg-white border border-gray-200"
                              }`}
                            >
                              <div className="flex items-start justify-between gap-3">
                                <div>
                                  <span
                                    className={`text-[12px] font-semibold block ${
                                      reply.isAuthor
                                        ? "text-primary"
                                        : "text-gray-800"
                                    }`}
                                  >
                                    {reply.autor}
                                  </span>

                                  <span className="text-[10px] text-gray-400">
                                    {new Date(reply.createdAt).toLocaleString(
                                      "pt-BR",
                                    )}
                                  </span>
                                </div>

                                {isOwner(reply.autor) && (
                                <div className="flex gap-2">
                                  <button
                                    onClick={() => {
                                      setEditingReply(reply.id);
                                      setEditText(reply.texto);
                                    }}
                                    className="p-2 rounded-lg bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                                  >
                                    <Pencil size={12} />
                                  </button>

                                  <button
                                    onClick={() =>
                                      setConfirmDelete({
                                        open: true,
                                        type: "reply",
                                        commentId: comment.id,
                                        replyId: reply.id,
                                      })
                                    }
                                    className="p-2 rounded-lg bg-red-50 text-red-500 hover:bg-red-100 transition"
                                  >
                                    <Trash2 size={12} />
                                  </button>
                                </div>
                                )}
                              </div>

                              {editingReply === reply.id ? (
                                <div className="flex gap-2 mt-3">
                                  <input
                                    value={editText}
                                    onChange={(e) =>
                                      setEditText(e.target.value)
                                    }
                                    className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-[11px] outline-none focus:border-primary"
                                  />

                                  <button
                                    onClick={() =>
                                      handleEditReply(comment.id, reply.id)
                                    }
                                    className="bg-primary text-white p-2 rounded-xl"
                                  >
                                    <Check size={13} />
                                  </button>

                                  <button
                                    onClick={() => {
                                      setEditingReply(null);
                                      setEditText("");
                                    }}
                                    className="bg-gray-200 text-gray-600 p-2 rounded-xl"
                                  >
                                    <X size={13} />
                                  </button>
                                </div>
                              ) : (
                                <p className="text-[12px] text-gray-600 mt-2 leading-relaxed">
                                  {reply.texto}
                                </p>
                              )}
                            </div>
                          ))}
                        </div>
                      )}

                      {/* INPUT RESPOSTA */}
                      {replyingTo === comment.id && (
                        <div className="mt-4 flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Responder ${comment.autor}...`}
                            className="flex-1 px-3 py-2 rounded-xl border border-gray-300 text-[12px] outline-none focus:border-primary"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleReply(comment.id)
                            }
                          />

                          <button
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="bg-gradient text-white px-4 rounded-xl text-[12px] disabled:opacity-40"
                          >
                            Enviar
                          </button>
                        </div>
                      )}
                    </div>
                  ))
                ) : (
                  <div className="text-center py-8 text-gray-400 text-sm">
                    <MessageCircle
                      size={32}
                      className="mx-auto mb-2 text-gray-300"
                    />

                    <p>Nenhum comentário ainda. Seja o primeiro!</p>
                  </div>
                )}
              </div>

              {/* NOVO COMENTÁRIO */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="flex-1 px-4 py-2.5 rounded-[10px] border border-gray-300 text-[13px] outline-none bg-white focus:border-primary"
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  />

                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="bg-gradient text-white text-[12px] font-medium px-4 py-2.5 rounded-[10px] disabled:opacity-40"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* MODAL DELETE */}
        {confirmDelete.open && (
          <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
            <div className="bg-white rounded-2xl w-full max-w-sm p-5 shadow-xl">
              <h2 className="text-lg font-semibold text-danger">
                Confirmar exclusão
              </h2>

              <p className="text-sm text-gray-500 mt-2">
                Essa ação não pode ser desfeita.
              </p>

              <div className="flex justify-end gap-3 mt-6">
                <button
                  onClick={() =>
                    setConfirmDelete({
                      open: false,
                      type: null,
                      commentId: null,
                      replyId: null,
                    })
                  }
                  className="px-4 py-2 rounded-xl bg-gray-100 text-sm"
                >
                  Cancelar
                </button>

                <button
                  onClick={() => {
                    if (confirmDelete.type === "comment") {
                      handleDeleteComment(confirmDelete.commentId);
                    }

                    if (confirmDelete.type === "reply") {
                      handleDeleteReply(
                        confirmDelete.commentId,
                        confirmDelete.replyId,
                      );
                    }
                  }}
                  className="bg-danger text-white px-4 py-2 rounded-xl text-sm"
                >
                  Deletar
                </button>
              </div>
            </div>
          </div>
        )}

        {/* SUCCESS */}
        {successModal && (
          <div className="fixed top-5 right-5 z-[70]">
            <div className="bg-success text-white px-5 py-3 rounded-2xl shadow-xl">
              {successModal}
            </div>
          </div>
        )}

        {/* ERROR */}
        {errorModal && (
          <div className="fixed top-5 right-5 z-[70]">
            <div className="bg-danger text-white px-5 py-3 rounded-2xl shadow-xl">
              {errorModal}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
