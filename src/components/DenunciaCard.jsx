import { useState } from "react";
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

import { updateOccurrence } from "../services/api";

export default function DenunciaCard({ data }) {
  const [open, setOpen] = useState(false);
  const [titulo, setTitulo] = useState(data.titulo);
  const [descricao, setDescricao] = useState(data.descricao);
  const [status, setStatus] = useState(data.status);

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
      });

      setOpen(false);
      window.location.reload();
    } catch {
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
        <p className="text-[12px] font-semibold text-gray-900">
          {data.titulo}
        </p>

        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
          <MapPin size={12} />
          {data.local}
        </div>

        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Clock size={12} />
          {data.data}
        </div>

        <div className="flex items-center gap-2 text-[11px] mt-2 text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <ThumbsUp size={12} />
            {data.likes}
          </span>

          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {data.comentarios}
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
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-5 w-[300px]">
            <h2 className="text-sm font-semibold mb-3">
              Editar ocorrência
            </h2>

            <input
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full mb-2 px-2 py-1 border rounded text-xs"
              placeholder="Título"
            />

            <textarea
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              className="w-full mb-2 px-2 py-1 border rounded text-xs"
              placeholder="Descrição"
            />

            <select
              value={status}
              onChange={(e) => setStatus(e.target.value)}
              className="w-full mb-3 px-2 py-1 border rounded text-xs"
            >
              <option value="Pendente">Aberto</option>
              <option value="Em análise">Em análise</option>
              <option value="Resolvido">Resolvido</option>
            </select>

            <div className="flex justify-end gap-2">
              <button
                onClick={() => setOpen(false)}
                className="text-xs text-gray-500"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdate}
                className="bg-primary text-white px-3 py-1 rounded text-xs"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}