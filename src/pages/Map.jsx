import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { getLoggedUser } from "../utils/auth";

import DenunciaCard from "../components/DenunciaCard";
import { getOccurrences } from "../services/api";
import MapPopup from "../components/MapPopup";

export const getMarkerIcon = (categoria) => {
  let color = "#888888"; // Outros
  if (categoria === "Infraestrutura")
    color = "#4237E0"; // blue (primary)
  else if (categoria === "Segurança")
    color = "#FF0202"; // red
  else if (categoria === "Limpeza urbana")
    color = "#34C759"; // green
  else if (categoria === "Trânsito") color = "#ECBD02"; // yellow

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
    <path fill="${color}" d="M12 0C5.373 0 0 5.373 0 12c0 7.252 11.083 23.013 11.536 23.666.24.346.732.346.972 0C12.963 35.013 24 19.252 24 12c0-6.627-5.373-12-12-12zm0 17.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 6.5 12 6.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z"/>
  </svg>`;

  return L.divIcon({
    className: "custom-div-icon",
    html: svg,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48],
  });
};

export default function Dashboard() {
  const user = getLoggedUser();
  const nome = user?.nome || "Usuário";

  const [data, setData] = useState([]);
  const [formatted, setFormatted] = useState([]);
  const [search, setSearch] = useState("");

  const [showAll, setShowAll] = useState(false);

  // filtro categoria
  const [categoria, setCategoria] = useState("Todas");
  const [open, setOpen] = useState(false);

  // pega dados do backend
  useEffect(() => {
    getOccurrences().then(setData);
  }, []);

  // helper pra limitar texto
  const formatEndereco = (text) => {
    if (!text) return "Local não encontrado";
    return text.length > 35 ? text.slice(0, 35) + "..." : text;
  };

  // formata imediatamente
  useEffect(() => {
    const formattedData = data.map((item) => ({
      ...item,
      local: "Carregando...",
      data: item.createdAt
        ? new Date(item.createdAt).toLocaleDateString("pt-BR")
        : "Agora",
    }));

    setFormatted(formattedData);

    loadAddresses(formattedData);
  }, [data]);

  const loadAddresses = async (items) => {
    const updated = await Promise.all(
      items.map(async (item) => {
        if (!item.latitude || !item.longitude) {
          return item;
        }

        try {
          const res = await fetch(
            `https://city-backend-production.up.railway.app/geocode/reverse?lat=${item.latitude}&lon=${item.longitude}`,
          );

          const geo = await res.json();

          const addr = geo.address || {};

          const endereco = [addr.road, addr.city || addr.town]
            .filter(Boolean)
            .join(", ");

          return {
            ...item,
            local: formatEndereco(endereco || "Local não encontrado"),
          };
        } catch {
          return {
            ...item,
            local: "Erro ao carregar",
          };
        }
      }),
    );

    setFormatted(updated);
  };

  // categorias dinâmicas
  const categorias = [
    "Todas",
    ...new Set(formatted.map((i) => i.categoria).filter(Boolean)),
  ];

  // filtro
  const filtered = formatted.filter((item) => {
    const matchSearch = item.titulo
      ?.toLowerCase()
      .includes(search.toLowerCase());

    const matchCategoria =
      categoria === "Todas" || item.categoria === categoria;

    return matchSearch && matchCategoria;
  });

  // limite de cards
  const visibleItems = showAll ? filtered : filtered.slice(0, 3);

  return (
    <div className="min-h-screen p-4 md:p-8 bg-[#F3F3F3] font-text">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-6">
        <div>
          <h1 className="font-title text-[32px] md:text-[40px] font-bold leading-tight">
            Mapa de <span className="text-primary">ocorrências</span>
          </h1>
          <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
            Visualize todas as ocorrências reportadas em
            <br className="hidden md:block" /> Caraguatatuba
          </p>
        </div>

        {/* Legend */}
        <div className="bg-white border border-gray-200 rounded-xl p-4 shadow-sm w-full lg:w-auto min-w-[300px]">
          <p className="text-sm font-bold mb-3 text-gray-800">Legenda:</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-y-3 gap-x-6 text-xs text-gray-600 font-medium">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#4237E0]"></div>
              <span>Infraestrutura</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#FF0202]"></div>
              <span>Segurança</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#34C759]"></div>
              <span>Limpeza</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#ECBD02]"></div>
              <span>Trânsito</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-[#888888]"></div>
              <span>Outros</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mapa */}
      <section className="max-w-[1555px] mx-auto mb-6">
        <div className="h-70 md:h-120 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <MapContainer
            center={[-23.6205, -45.4132]}
            zoom={13}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution="&copy; OpenStreetMap contributors"
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />

            {formatted
              .filter(
                (occ) =>
                  occ.latitude &&
                  occ.longitude &&
                  occ.status?.toLowerCase() !== "resolvido",
              )
              .map((occ) => (
                <Marker
                  key={occ.id}
                  position={[Number(occ.latitude), Number(occ.longitude)]}
                  icon={getMarkerIcon(occ.categoria)}
                >
                  <Popup
                    className="custom-popup"
                    closeButton={true}
                    maxWidth={280}
                    minWidth={240}
                  >
                    <MapPopup occ={occ} />
                  </Popup>
                </Marker>
              ))}
          </MapContainer>
        </div>
        <div className="flex justify-center md:justify-end mt-4">
          <Link
            to="/relatar"
            className="bg-[#2D8FFF] hover:bg-[#1a7ae6] text-white px-6 py-2.5 rounded-xl text-[14px] font-medium shadow-sm cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-95"
          >
            + Registrar ocorrência
          </Link>
        </div>
      </section>

      <section className="max-w-5xl mx-auto">
        <h2 className="text-[18px] mb-4 font-semibold">Minhas denúncias</h2>

        {/* BUSCA + FILTRO */}
        <div className="bg-[#EDEDED] rounded-xl p-3 mb-5">
          <div className="flex flex-col md:flex-row gap-2 items-center">
            <div className="bg-white rounded-lg px-3 py-2 flex items-center gap-2 w-full">
              <Search size={14} className="text-gray-400" />
              <input
                placeholder="Buscar ocorrências..."
                className="flex-1 text-[12px] outline-none bg-transparent"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>

            {/* Dropdown */}
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setOpen(!open)}
                className="bg-white rounded-lg px-6 py-2 text-[12px] w-full flex justify-between items-center gap-2"
              >
                {categoria}
                <ChevronDown size={14} />
              </button>

              {open && (
                <div className="absolute mt-1 w-full bg-white rounded-lg shadow z-10">
                  {categorias.map((cat) => (
                    <div
                      key={cat}
                      onClick={() => {
                        setCategoria(cat);
                        setOpen(false);
                      }}
                      className="px-3 py-2 text-[12px] hover:bg-gray-100 cursor-pointer"
                    >
                      {cat}
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Informações */}
        <div className="flex justify-between items-center md:flex-col md:gap-1 mb-4">
          <p className="text-[14px]">Destaques Recentes</p>

          <span className="text-[11px] text-gray-400">
            {showAll
              ? "Todos os resultados"
              : `Mostrando ${Math.min(3, filtered.length)}`}
          </span>
        </div>

        {/* Cards */}
        <div className="bg-[#EDEDED] rounded-[14px] p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {visibleItems.map((item) => (
              <DenunciaCard key={item.id} data={item} />
            ))}
          </div>
        </div>

        {/* BOTÃO */}
        {filtered.length > 3 && (
          <div className="flex justify-center mt-6">
            <button
              onClick={() => setShowAll(!showAll)}
              className="bg-gradient text-white px-10 py-2 rounded-[10px] font-medium text-[14px] cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-95"
            >
              {showAll ? "Ver menos" : "Ver mais"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}
