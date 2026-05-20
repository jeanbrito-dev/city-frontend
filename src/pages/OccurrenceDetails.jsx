import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { ThumbsUp, MessageCircle, AlertCircle } from "lucide-react";

import {
  getOccurrenceById,
  getComments,
  addComment as apiAddComment,
  addReply as apiAddReply,
  toggleLike as apiToggleLike,
} from "../services/api";

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

  // Pega o usuário logado
  const getLoggedUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
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
      {/* Wrapper */}
      <div className="max-w-[1100px] mx-auto px-4 py-6 md:px-8 md:py-10">
        {/* ========== CARD AZUL PRINCIPAL ========== */}
        <div className="bg-tertiary/25 rounded-2xl p-5 md:p-8">
          {/* Layout: mobile coluna | desktop row */}
          <div className="flex flex-col md:flex-row gap-6 md:gap-8">
            {/* ===== COLUNA ESQUERDA ===== */}
            <div className="flex-1 flex flex-col">
              {/* Título */}
              <h1 className="font-title text-[26px] md:text-[30px] font-bold text-gray-900 leading-tight">
                {occurrence.titulo}
              </h1>
              <p className="text-[13px] text-gray-600 mt-1 mb-4">
                Ocorrência feita por{" "}
                <span className="text-primary font-medium">
                  @{occurrence.autor}
                </span>
              </p>

              {/* Imagem */}
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

              {/* Card branco da Descrição */}
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

              {/* Likes / Comments count */}
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

            {/* ===== COLUNA DIREITA: Comentários ===== */}
            <div className="flex-1 bg-white rounded-2xl px-5 py-5 md:px-6 md:py-6 shadow-sm flex flex-col">
              <h2 className="font-title text-[20px] md:text-[22px] font-semibold text-gray-900 text-center mb-4">
                Comentários
              </h2>

              {/* Lista com scroll */}
              <div className="flex-1 overflow-y-auto max-h-[400px] md:max-h-[450px] pr-1 custom-scrollbar">
                {comments.length > 0 ? (
                  comments.map((comment) => (
                    <div
                      key={comment.id}
                      className="py-3 border-b border-gray-200 last:border-b-0"
                    >
                      {/* Comentário principal */}
                      <span className="text-[13px] font-semibold text-gray-900 block mb-1">
                        {comment.autor}
                      </span>
                      <p className="text-[12px] text-gray-500 leading-normal m-0">
                        {comment.texto}
                      </p>
                      <button
                        onClick={() =>
                          setReplyingTo(
                            replyingTo === comment.id ? null : comment.id,
                          )
                        }
                        className="bg-transparent border-none text-primary text-[11px] font-medium cursor-pointer p-0 mt-1 block ml-auto hover:underline"
                      >
                        Responder
                      </button>

                      {/* Respostas aninhadas com scroll */}
                      {comment.replies?.length > 0 && (
                        <div className="ml-5 mt-2 max-h-[150px] overflow-y-auto pr-1 custom-scrollbar">
                          {comment.replies.map((reply) => (
                            <div
                              key={reply.id}
                              className={`pl-4 border-l-2 mb-2 ${
                                reply.isAuthor
                                  ? "border-primary bg-[#EEF2FA] rounded-r-xl py-3 pr-3"
                                  : "border-gray-200 py-2"
                              }`}
                            >
                              <span
                                className={`text-[12px] font-semibold block mb-0.5 ${
                                  reply.isAuthor
                                    ? "text-primary"
                                    : "text-gray-800"
                                }`}
                              >
                                {reply.autor}
                              </span>
                              <p className="text-[11px] text-gray-500 leading-normal m-0">
                                {reply.texto}
                              </p>
                              <button className="bg-transparent border-none text-primary text-[10px] font-medium cursor-pointer p-0 mt-1 block ml-auto hover:underline">
                                Responder
                              </button>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Input de resposta */}
                      {replyingTo === comment.id && (
                        <div className="ml-5 mt-2 flex gap-2">
                          <input
                            type="text"
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            placeholder={`Responder ${comment.autor}...`}
                            className="flex-1 px-3 py-2 rounded-lg border border-gray-300 text-[11px] font-text outline-none focus:border-primary transition-colors"
                            onKeyDown={(e) =>
                              e.key === "Enter" && handleReply(comment.id)
                            }
                            autoFocus
                          />
                          <button
                            onClick={() => handleReply(comment.id)}
                            disabled={!replyText.trim()}
                            className="bg-gradient text-white text-[11px] font-medium px-3 py-2 rounded-lg border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
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

              {/* Input de comentário novo */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={commentText}
                    onChange={(e) => setCommentText(e.target.value)}
                    placeholder="Escreva um comentário..."
                    className="flex-1 px-4 py-2.5 rounded-[10px] border border-gray-300 text-[13px] font-text outline-none bg-white transition-colors focus:border-primary"
                    onKeyDown={(e) => e.key === "Enter" && handleComment()}
                  />
                  <button
                    onClick={handleComment}
                    disabled={!commentText.trim()}
                    className="bg-gradient text-white text-[12px] font-medium px-4 py-2.5 rounded-[10px] border-none cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed"
                  >
                    Enviar
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}