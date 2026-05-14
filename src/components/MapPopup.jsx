import { NavLink } from "react-router-dom";
import { MapPin, ArrowRight } from "lucide-react";

const getCategoryColor = (categoria) => {
  if (categoria === "Infraestrutura") return "#4237E0";
  if (categoria === "Segurança") return "#FF0202";
  if (categoria === "Limpeza") return "#34C759";
  if (categoria === "Trânsito") return "#ECBD02";
  return "#888888";
};

const getStatusStyle = (status) => {
  if (status === "Resolvido") return { background: "#ECFDF5", color: "#059669" };
  if (status === "Em Análise") return { background: "#FFF7ED", color: "#D97706" };
  return { background: "#EEF2FF", color: "#4237E0" };
};

export default function MapPopup({ occ }) {
  const catColor = getCategoryColor(occ.categoria);
  const statusStyle = getStatusStyle(occ.status);

  return (
    <div style={{ margin: '-14px -20px -14px -20px', borderRadius: '12px', overflow: 'hidden', fontFamily: 'Roboto, sans-serif' }}>
      {/* Category accent bar */}
      <div style={{ height: '5px', background: catColor }} />

      <div style={{ padding: '14px 16px 12px' }}>
        {/* Header row: category + status */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '5px',
            fontSize: '11px',
            fontWeight: '600',
            color: catColor,
            textTransform: 'uppercase',
            letterSpacing: '0.5px',
          }}>
            <MapPin size={12} />
            {occ.categoria}
          </span>
          <span style={{
            fontSize: '10px',
            fontWeight: '600',
            padding: '2px 8px',
            borderRadius: '20px',
            ...statusStyle,
          }}>
            {occ.status}
          </span>
        </div>

        {/* Title */}
        <h3 style={{
          fontSize: '14px',
          fontWeight: '700',
          color: '#1A1A1A',
          margin: '0 0 6px 0',
          lineHeight: '1.3',
          fontFamily: 'Oswald, sans-serif',
        }}>
          {occ.titulo}
        </h3>

        {/* Description */}
        <p style={{
          fontSize: '12px',
          color: '#6B7280',
          margin: '0 0 12px 0',
          lineHeight: '1.5',
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
          overflow: 'hidden',
        }}>
          {occ.descricao}
        </p>

        {/* NavLink button */}
        <NavLink
          to={`/ocorrencia/${occ.id}`}
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '6px',
            width: '100%',
            padding: '8px 0',
            background: 'linear-gradient(135deg, #2D8FFF, #0634EB)',
            color: '#fff',
            border: 'none',
            borderRadius: '8px',
            fontSize: '12px',
            fontWeight: '600',
            textDecoration: 'none',
            cursor: 'pointer',
            transition: 'opacity 0.2s',
            letterSpacing: '0.3px',
          }}
          onMouseEnter={(e) => e.currentTarget.style.opacity = '0.85'}
          onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Ver detalhes
          <ArrowRight size={13} />
        </NavLink>
      </div>
    </div>
  );
}
