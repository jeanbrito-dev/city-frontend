import { NavLink } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

const getCategoryColor = (categoria) => {
  if (categoria === "Ocorrência") return "text-[#E74C3C]";
  if (categoria === "Evento") return "text-[#9B59B6]";
  if (categoria === "Infraestrutura") return "text-[#4237E0]";
  if (categoria === "Segurança") return "text-[#FF0202]";
  if (categoria === "Limpeza Urbana") return "text-[#34C759]";
  if (categoria === "Iluminação Pública") return "text-[#00B8D9]";
  if (categoria === "Trânsito") return "text-[#ECBD02]";
  if (categoria === "Saúde Pública") return "text-[#FF6B6B]";
  if (categoria === "Meio Ambiente") return "text-[#2ECC71]";
  if (categoria === "Sugestão") return "text-[#F39C12]";

  return "text-[#607D8B]"; // Não definido
};

const getCategoryBg = (categoria) => {
  if (categoria === "Ocorrência") return "bg-[#E74C3C]";
  if (categoria === "Evento") return "bg-[#9B59B6]";
  if (categoria === "Infraestrutura") return "bg-[#4237E0]";
  if (categoria === "Segurança") return "bg-[#FF0202]";
  if (categoria === "Limpeza Urbana") return "bg-[#34C759]";
  if (categoria === "Iluminação Pública") return "bg-[#00B8D9]";
  if (categoria === "Trânsito") return "bg-[#ECBD02]";
  if (categoria === "Saúde Pública") return "bg-[#FF6B6B]";
  if (categoria === "Meio Ambiente") return "bg-[#2ECC71]";
  if (categoria === "Sugestão") return "bg-[#F39C12]";

  return "bg-[#607D8B]"; // Não definido
};

const getStatusClasses = (status) => {
  if (status === "Resolvido") return "bg-[#ECFDF5] text-[#059669]";
  if (status === "Em Análise") return "bg-[#FFF7ED] text-[#D97706]";
  return "bg-[#EEF2FF] text-primary";
};

export default function MapPopup({ occ }) {
  return (
    <div className="-my-[14px] -mx-[20px] rounded-xl overflow-hidden font-text">
      {/* Category accent bar */}
      <div className={`h-[5px] ${getCategoryBg(occ.categoria)}`} />

      <div className="px-4 pt-3.5 pb-3">
        {/* Header row: category + status */}
        <div className="flex justify-between items-center mb-2">
          <span className={`inline-flex items-center gap-[5px] text-[11px] font-semibold uppercase tracking-wide ${getCategoryColor(occ.categoria)}`}>
            <MapPin size={12} />
            {occ.categoria}
          </span>
          <span className={`text-[10px] font-semibold px-2 py-0.5 rounded-full ${getStatusClasses(occ.status)}`}>
            {occ.status}
          </span>
        </div>

        {/* Title */}
        <h3 className="text-sm font-bold text-[#1A1A1A] mb-1.5 leading-tight font-title">
          {occ.titulo}
        </h3>

        {/* Description */}
        <p className="text-xs text-gray-500 mb-3 leading-relaxed line-clamp-2">
          {occ.descricao}
        </p>

        {/* NavLink button */}
        <NavLink
          to={`/ocorrencia/${occ.id}`}
          className="flex items-center justify-center gap-1.5 w-full py-2 bg-gradient !text-white rounded-lg text-xs font-semibold !no-underline cursor-pointer transition-opacity hover:opacity-85 tracking-wide"
        >
          Ver detalhes
          <ArrowRight size={13} />
        </NavLink>
      </div>
    </div>
  );
}
