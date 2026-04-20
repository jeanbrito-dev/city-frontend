import {
  ThumbsUp,
  MessageCircle,
  MapPin,
  Clock,
  AlertCircle,
  CalendarDays,
  CheckCircle
} from "lucide-react";

export default function DenunciaCard({ data }) {

  const getStatusStyle = () => {
    switch (data.status) {
      case "Evento":
        return {
          bg: "rgba(52,199,89,0.2)",
          color: "var(--color-success)",
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

        {/* LOCAL */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400 mt-1">
          <MapPin size={12} />
          {data.local}
        </div>

        {/* DATA */}
        <div className="flex items-center gap-1 text-[11px] text-gray-400">
          <Clock size={12} />
          {data.data}
        </div>

        {/* AÇÕES */}
        <div className="flex items-center gap-2 text-[11px] mt-2 text-gray-500 font-medium">
          <span className="flex items-center gap-1">
            <ThumbsUp size={12} />
            {data.likes}
          </span>

          <span className="flex items-center gap-1">
            <MessageCircle size={12} />
            {data.comentarios}
          </span>

          <span className="ml-auto text-gray-400 font-normal">
            Ver detalhes
          </span>
        </div>

      </div>
    </div>
  );
}