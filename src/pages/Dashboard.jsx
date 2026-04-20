import MapPage from "./Map";
import DenunciaCard from "../components/DenunciaCard";
import { Search, ChevronDown } from "lucide-react";
import { useSearchParams } from "react-router-dom";

export default function Dashboard() {


  const [searchParams] = useSearchParams();
  const nome = searchParams.get("nome") || "Usuário";

  const denuncias = [
    { id: 1, titulo: "Queda de árvore após tempestade", local: "Rua do Tingá", data: "1 dia atrás", likes: 12, comentarios: 2, status: "Ocorrência" },
    { id: 2, titulo: "Show de verão", local: "Praça de eventos", data: "1 dia atrás", likes: 109, comentarios: 42, status: "Evento" },
    { id: 3, titulo: "Festa do comércio", local: "Centro", data: "2 dias atrás", likes: 33, comentarios: 4, status: "Evento" },
    { id: 4, titulo: "Buraco na rua", local: "Indaiá", data: "3 dias atrás", likes: 8, comentarios: 1, status: "Ocorrência" },
    { id: 5, titulo: "Semáforo quebrado", local: "Centro", data: "4 dias atrás", likes: 15, comentarios: 3, status: "Ocorrência" },
    { id: 6, titulo: "Alagamento", local: "Martim de Sá", data: "5 dias atrás", likes: 20, comentarios: 6, status: "Resolvido" },
  ];

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{
        backgroundColor: "#F3F3F3",
        fontFamily: "var(--font-text)",
      }}
    >

      {/* HEADER */}
      <h1
        className="text-[20px] md:text-[28px] text-center md:text-left mb-6 font-semibold"
        style={{ fontFamily: "var(--font-title)" }}
      >
        Bem-vindo{" "}
        <span style={{ color: "var(--color-primary)", fontWeight: "700" }}>
          {nome}
        </span>
      </h1>

      {/* MAP */}
      <div className="mb-6">
        <MapPage />

        <div className="flex justify-center md:justify-end mt-3">
          <button className="bg-gradient text-white px-5 py-2 rounded-[10px] text-[14px] font-medium">
            + Registrar ocorrência
          </button>
        </div>
      </div>

      <section className="max-w-5xl mx-auto">

        <h2
          className="text-[18px] mb-4 font-semibold"
          style={{ fontFamily: "var(--font-title)" }}
        >
          Minhas denúncias
        </h2>

        {/* BUSCA */}
        <div className="bg-[#EDEDED] rounded-[12px] p-3 mb-5">
          <div className="flex flex-col md:flex-row gap-2 items-center">

            <div className="bg-white rounded-[8px] px-3 py-2 flex items-center gap-2 w-full">
              <Search size={14} className="text-gray-400" />
              <input
                placeholder="Buscar ocorrências..."
                className="flex-1 text-[12px] outline-none bg-transparent"
              />
            </div>

            <button className="bg-white rounded-[8px] px-3 py-2 text-[12px] w-full md:w-auto flex justify-between items-center gap-2">
              Todas as Categorias
              <ChevronDown size={14} />
            </button>

          </div>
        </div>

        {/* DESTAQUES */}
        <div className="flex justify-between items-center md:flex-col md:gap-1 mb-4">
          <p style={{ fontFamily: "var(--font-title)" }} className="text-[14px]">
            Destaques Recentes
          </p>

          <span className="text-[11px] text-gray-400">
            {denuncias.length} resultados
          </span>
        </div>

        {/* CARDS */}
        <div className="bg-[#EDEDED] rounded-[14px] p-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {denuncias.map((item) => (
              <DenunciaCard key={item.id} data={item} />
            ))}
          </div>
        </div>

        {/* BOTÃO */}
        <div className="flex justify-center mt-6">
          <button className="bg-gradient text-white px-10 py-2 rounded-[10px] font-medium text-[14px]">
            Ver mais
          </button>
        </div>

      </section>
    </div>
  );
}