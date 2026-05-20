import { useEffect, useState } from "react";
import { useSearchParams, Link } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import DenunciaCard from "../components/DenunciaCard";
import MapPopup from "../components/MapPopup";
import { getOccurrences } from "../services/api";
import { getMarkerIcon } from "./Map";

export default function Dashboard() {
  const user = JSON.parse(localStorage.getItem("user"));
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

  // formatação + reverse geocode
  useEffect(() => {
    const formatData = async () => {
      const result = await Promise.all(
        data.map(async (item) => {
          // evita request desnecessária
          if (!item.latitude || !item.longitude) {
            return {
              ...item,
              local: item.categoria || "Não informado",
              data: item.createdAt
                ? new Date(item.createdAt).toLocaleDateString("pt-BR")
                : "Agora",
              likes: item.id?.length || 0,
              comentarios: item.id?.length % 5 || 0,
            };
          }

          let endereco = "Local não encontrado";

          try {
            const res = await fetch(
              `https://nominatim.openstreetmap.org/reverse?lat=${item.latitude}&lon=${item.longitude}&format=json`,
            );
            const geo = await res.json();
            const addr = geo.address || {};

            endereco = [addr.road, addr.city || addr.town]
              .filter(Boolean)
              .join(", ");
          } catch {
            endereco = "Erro ao carregar";
          }

          return {
            ...item,
            local: formatEndereco(endereco),
            data: item.createdAt
              ? new Date(item.createdAt).toLocaleDateString("pt-BR")
              : "Agora",
            likes: item.id?.length || 0,
            comentarios: item.id?.length % 5 || 0,
          };
        }),
      );

      setFormatted(result);
    };

    if (data.length) formatData();
  }, [data]);

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
      <h1 className="text-[32px] md:text-[45px] text-center md:text-left mb-6 font-semibold">
        Bem-vindo <span className="text-primary font-bold">{nome}</span>
      </h1>

      {/* Mapa */}
      <section className="max-w-[1555px] mx-auto mb-6">
        <div className="h-72 md:h-120 w-full rounded-2xl overflow-hidden shadow-sm border border-gray-200">
          <MapContainer
            center={[-23.6205, -45.4132]}
            zoom={13}
            className="h-full w-full z-0"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />
            {formatted.map((occ) => (
              occ.latitude && occ.longitude ? (
                <Marker
                  key={occ.id}
                  position={[Number(occ.latitude), Number(occ.longitude)]}
                  icon={getMarkerIcon(occ.categoria)}
                >
                  <Popup className="custom-popup" closeButton={true} maxWidth={280} minWidth={240}>
                    <MapPopup occ={occ} />
                  </Popup>
                </Marker>
              ) : null
            ))}
          </MapContainer>
        </div>
        <div className="flex justify-center md:justify-end mt-4">
          <Link
            to="/relatar"
            className="bg-[#2D8FFF] hover:bg-[#1a7ae6] transition-colors text-white px-6 py-2.5 rounded-xl text-[14px] font-medium shadow-sm cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-95"
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

        {/* INFO */}
        <div className="flex justify-between items-center md:flex-col md:gap-1 mb-4">
          <p className="text-[14px]">Destaques Recentes</p>

          <span className="text-[11px] text-gray-400">
            {showAll
              ? "Todos os resultados"
              : `Mostrando ${Math.min(3, filtered.length)}`}
          </span>
        </div>

        {/* CARDS */}
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
