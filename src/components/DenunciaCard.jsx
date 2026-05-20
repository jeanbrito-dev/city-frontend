import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Clock,
  AlertCircle,
  CalendarDays,
  CheckCircle,
  Pencil,
} from "lucide-react";

import { updateOccurrence, getOccurrenceById, getComments, toggleLike as apiToggleLike } from "../services/api";

export default function DenunciaCard({ data }) {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState(data.titulo);
  const [descricao, setDescricao] = useState(data.descricao);
  const [status, setStatus] = useState(data.status);
  const [categoria, setCategoria] = useState(data.categoria);

  
  const [likes, setLikes] = useState(0);
  const [comentarios, setComentarios] = useState(0);
  const [liked, setLiked] = useState(false);

  const getLoggedUser = () => {
    try {
      return JSON.parse(localStorage.getItem("user"));
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const user = getLoggedUser();
        const occ = await getOccurrenceById(data.id);
        setLikes(occ.likes || 0);

        if (user && occ.likedBy) {
          setLiked(occ.likedBy.includes(user.id));
        }

        const comments = await getComments(data.id);
        const total = comments.reduce(
          (acc, c) => acc + 1 + (c.replies?.length || 0),
          0,
        );
        setComentarios(total);
      } catch (err) {
        console.error("Erro ao buscar contagens:", err);
      }
    };

    fetchCounts();
  }, [data.id]);


  const handleLike = async () => {
    const user = getLoggedUser();
    if (!user) return;

    const wasLiked = liked;
    setLiked(!wasLiked);
    setLikes((prev) => (wasLiked ? prev - 1 : prev + 1));

    try {
      const result = await apiToggleLike(data.id, user.id);
      setLikes(result.likes);
      setLiked(result.liked);
    } catch (err) {
      console.error("Erro ao curtir:", err);
      setLiked(wasLiked);
      setLikes((prev) => (wasLiked ? prev + 1 : prev - 1));
    }
  };

  const getStatusStyle = () => {
    switch (data.status) {
      case "Em análise":
        return {
          bg: "rgba(207, 153, 52, 0.15)",
          color: "var(--color-warning)",
          icon: <CalendarDays size={10} />,
        };
      case "Resolvido":
        return {
          bg: "rgba(52,199,89,0.3)",
          color: "var(--color-success)",
          icon: <CheckCircle size={10} />,
        };
      default:
        return {
          bg: "rgba(66,55,224,0.2)",
          color: "var(--color-primary)",
          icon: <AlertCircle size={10} />,
        };
    }
  };

  const handleUpdate = async () => {
    try {
      await updateOccurrence(data.id, {
        titulo,
        descricao,
        status,
        categoria,
      });

      setOpen(false);
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar");
    }
  };

  const statusStyle = getStatusStyle();

  return (
    <div className="bg-white rounded-[10px] overflow-hidden">
      {/* topo */}
      <div className="h-20 bg-gray-200 p-2">
        <span
          className="flex items-center gap-1 text-[10px] px-2 py-[2px] rounded font-medium w-fit"
          style={{
            backgroundColor: statusStyle.bg,
            color: statusStyle.color,
          }}
        >
          {statusStyle.icon}
          {data.status}
        </span>
      </div>

      {/* conteúdo */}
      <div className="p-3" style={{ fontFamily: "var(--font-text)" }}>
        <p className="text-[12px] font-semibold text-gray-900">{data.titulo}</p>

        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
          <MapPin size={12} />
          {data.local}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Clock size={12} />
          {data.data}
        </div>

        <div className="flex items-center gap-2 text-[11px] mt-2 text-gray-500 font-medium">
          <button
            onClick={handleLike}
            className={`flex items-center gap-1 bg-transparent border-none cursor-pointer p-0 font-medium text-[11px] transition-colors ${
              liked ? "text-primary" : "text-gray-500"
            }`}
          >
            <ThumbsUp
              size={13}
              className={liked ? "fill-primary text-primary" : ""}
            />
            {likes}
          </button>

          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {comentarios}
          </span>

          <Link
            to={`/ocorrencia/${data.id}`}
            className="ml-auto text-gray-400 font-normal hover:text-primary transition-colors"
          >
            Ver detalhes
          </Link>

          <Pencil
            size={14}
            className="ml-2 cursor-pointer text-gray-500 hover:text-primary"
            onClick={() => setOpen(true)}
          />
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-50 px-4">
          <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">
            {/* HEADER */}
            <div className="bg-gradient px-5 py-4 text-white">
              <h2 className="text-lg font-semibold">Editar ocorrência</h2>

              <p className="text-xs opacity-80 mt-1">
                Atualize as informações da ocorrência
              </p>
            </div>

            {/* CONTEÚDO */}
            <div className="p-5 flex flex-col gap-4">
              {/* TÍTULO */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Título
                </label>

                <input
                  value={titulo}
                  onChange={(e) => setTitulo(e.target.value)}
                  placeholder="Digite o título"
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* DESCRIÇÃO */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Descrição
                </label>

                <textarea
                  value={descricao}
                  onChange={(e) => setDescricao(e.target.value)}
                  placeholder="Descreva a ocorrência"
                  className="w-full h-28 resize-none rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                />
              </div>

              {/* TIPO */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Tipo da ocorrência
                </label>

                <select
                  value={categoria}
                  onChange={(e) => setCategoria(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="Ocorrência">Ocorrência</option>
                  <option value="Evento">Evento</option>
                  <option value="Infraestrutura">Infraestrutura</option>
                  <option value="Segurança">Segurança</option>
                  <option value="Limpeza Urbana">Limpeza Urbana</option>
                  <option value="Iluminação Pública">Iluminação Pública</option>
                  <option value="Trânsito">Trânsito</option>
                  <option value="Saúde Pública">Saúde Pública</option>
                  <option value="Meio Ambiente">Meio Ambiente</option>
                  <option value="Sugestão">Sugestão</option>
                </select>
              </div>

              {/* STATUS */}
              <div>
                <label className="text-xs font-medium text-gray-600 block mb-1">
                  Status
                </label>

                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                  className="w-full rounded-xl border border-gray-300 px-3 py-2 text-sm outline-none focus:border-primary"
                >
                  <option value="Pendente">Pendente</option>
                  <option value="Em análise">Em análise</option>
                  <option value="Resolvido">Resolvido</option>
                </select>
              </div>
            </div>

            {/* FOOTER */}
            <div className="flex justify-end gap-3 border-t border-gray-200 px-5 py-4">
              <button
                onClick={() => setOpen(false)}
                className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:bg-gray-100 transition"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdate}
                className="bg-primary hover:opacity-90 text-white px-5 py-2 rounded-xl text-sm transition"
              >
                Salvar alterações
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}


