import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Search, ChevronDown } from "lucide-react";

import MapPage from "./Map";
import DenunciaCard from "../components/DenunciaCard";
import { getOccurrences } from "../services/api";
import { Link } from "react-router";

export default function Dashboard() {
  const [searchParams] = useSearchParams();
  const nome = searchParams.get("nome") || "Usuário";

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
              `https://nominatim.openstreetmap.org/reverse?lat=${item.latitude}&lon=${item.longitude}&format=json`
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
        })
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
      <h1 className="text-[20px] md:text-[28px] text-center md:text-left mb-6 font-semibold">
        Bem-vindo <span className="text-primary font-bold">{nome}</span>
      </h1>

      {/* MAP */}
      <div className="mb-6">
        <MapPage />

        <div className="flex justify-center md:justify-end mt-3">
          <Link
            to="/relatar"
            className="bg-gradient text-white px-5 py-2 rounded-[10px] text-[14px] font-medium"
          >
            + Registrar ocorrência
          </Link>
        </div>
      </div>

      <section className="max-w-5xl mx-auto">
        <h2 className="text-[18px] mb-4 font-semibold">
          Minhas denúncias
        </h2>

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

            {/* DROPDOWN */}
            <div className="relative w-full md:w-auto">
              <button
                onClick={() => setOpen(!open)}
                className="bg-white rounded-lg px-6 py-2 text-[12px] w-full flex justify-between items-center gap-2"
              >
                {categoria}
                <ChevronDown size={14} />
              </button>

              {open && (
                <div className="absolute mt-1 w-full bg-white rounded-[8px] shadow z-10">
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
              className="bg-gradient text-white px-10 py-2 rounded-[10px] font-medium text-[14px]"
            >
              {showAll ? "Ver menos" : "Ver mais"}
            </button>
          </div>
        )}
      </section>
    </div>
  );
}