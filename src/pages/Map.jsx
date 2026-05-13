import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";

import L from "leaflet";
import { Filter, Search } from "lucide-react";
import { getOccurrences } from "../services/api";
import DenunciaCard from "../components/DenunciaCard";

export const getMarkerIcon = (categoria) => {
  let color = "#888888"; // Outros
  if (categoria === "Infraestrutura") color = "#4237E0"; // blue (primary)
  else if (categoria === "Segurança") color = "#FF0202"; // red
  else if (categoria === "Limpeza") color = "#34C759"; // green
  else if (categoria === "Trânsito") color = "#ECBD02"; // yellow

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 36" width="32" height="48">
    <path fill="${color}" d="M12 0C5.373 0 0 5.373 0 12c0 7.252 11.083 23.013 11.536 23.666.24.346.732.346.972 0C12.963 35.013 24 19.252 24 12c0-6.627-5.373-12-12-12zm0 17.5c-3.038 0-5.5-2.462-5.5-5.5S8.962 6.5 12 6.5s5.5 2.462 5.5 5.5-2.462 5.5-5.5 5.5z"/>
  </svg>`;

  return L.divIcon({
    className: 'custom-div-icon',
    html: svg,
    iconSize: [32, 48],
    iconAnchor: [16, 48],
    popupAnchor: [0, -48]
  });
};

export default function Map() {
  const [occurrences, setOccurrences] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("Todas as Categorias");
  
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [visibleCount, setVisibleCount] = useState(window.innerWidth < 768 ? 3 : 6);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    getOccurrences().then(setOccurrences);
  }, []);

  const filteredOccurrences = occurrences.filter((occ) => {
    const matchesSearch =
      occ.titulo?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      occ.descricao?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory =
      selectedCategory === "Todas as Categorias" ||
      occ.categoria === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  const occurrencesToShow = filteredOccurrences.slice(0, visibleCount);

  return (
    <div className="min-h-screen bg-[#F5F7FA] px-4 py-8 md:px-8 lg:px-16 font-text text-[#1A1A1A]">
      <div className="max-w-7xl mx-auto">
        
        {/* Header Section */}
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-6 gap-6">
          <div>
            <h1 className="font-title text-[32px] md:text-[40px] font-bold leading-tight">
              Mapa de <span className="text-primary">ocorrências</span>
            </h1>
            <p className="text-gray-500 mt-2 text-sm md:text-base font-medium">
              Visualize todas as ocorrências reportadas em<br className="hidden md:block" /> Caraguatatuba
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

        {/* Map */}
        <div className="h-[400px] md:h-[500px] w-full rounded-2xl overflow-hidden shadow-sm mb-6 border border-gray-200">
          <MapContainer
            center={[-23.6205, -45.4132]}
            zoom={13}
            className="h-full w-full"
          >
            <TileLayer
              attribution='&copy; OpenStreetMap contributors'
              url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
            />

            {filteredOccurrences.map((occ) => (
              <Marker
                key={occ.id}
                position={[Number(occ.latitude), Number(occ.longitude)]}
                icon={getMarkerIcon(occ.categoria)}
              >
                <Popup>
                  <strong>{occ.titulo}</strong>
                  <p className="text-xs text-gray-600 mt-1">{occ.descricao}</p>
                  <span className="text-[10px] font-bold text-primary mt-2 block">
                    {occ.categoria} - {occ.status}
                  </span>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        {/* Map Actions / Info */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-14">
          <p className="text-sm font-medium text-gray-800">
            Total de ocorrências no mapa: <span className="text-[#5A9AE7] font-semibold">{filteredOccurrences.length}</span>
          </p>
          <Link
            to="/relatar"
            className="w-full md:w-auto bg-[#2D8FFF] hover:bg-[#1a7ae6] text-white px-6 py-3 rounded-xl font-semibold text-[15px] text-center transition-colors shadow-sm"
          >
            + Registrar ocorrência
          </Link>
        </div>

        {/* Filters */}
        <div className="flex justify-center mb-16">
          <div className="bg-white rounded-[20px] p-3 md:p-4 shadow-[0_4px_24px_rgba(0,0,0,0.04)] flex flex-col md:flex-row gap-4 w-full max-w-4xl border border-gray-100">
            <div className="relative flex-1">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                placeholder="Buscar ocorrências (ex: buracos, alagamentos, etc.)"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-11 pr-4 py-3.5 border-none bg-[#F4F6F8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-gray-800 placeholder:text-gray-500"
              />
            </div>
            
            <div className="relative w-full md:w-72 shrink-0">
               <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Filter size={18} className="text-gray-400" />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="appearance-none block w-full pl-11 pr-10 py-3.5 border-none bg-[#F4F6F8] rounded-xl text-sm focus:outline-none focus:ring-1 focus:ring-primary transition-colors text-gray-700 cursor-pointer"
              >
                <option value="Todas as Categorias">Todas as Categorias</option>
                <option value="Infraestrutura">Infraestrutura</option>
                <option value="Segurança">Segurança</option>
                <option value="Limpeza">Limpeza</option>
                <option value="Trânsito">Trânsito</option>
                <option value="Outros">Outros</option>
              </select>
               <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Occurrences Grid */}
        <div className="bg-[#F9F9F9] -mx-4 md:-mx-8 lg:-mx-16 px-4 md:px-8 lg:px-16 pt-12 pb-16">
          <div className="max-w-7xl mx-auto">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[28px] font-bold font-title text-gray-900">Destaques Recentes</h2>
              <span className="text-[15px] font-medium text-gray-500">{filteredOccurrences.length} resultados</span>
            </div>

            {filteredOccurrences.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {occurrencesToShow.map((occ) => (
                  <DenunciaCard 
                    key={occ.id} 
                    data={{
                      id: occ.id,
                      titulo: occ.titulo,
                      descricao: occ.descricao,
                      status: occ.status,
                      local: "Endereço não informado", // Idealmente buscaria no banco ou map
                      data: new Date(occ.createdAt).toLocaleDateString(),
                      likes: Math.floor(Math.random() * 50) + 5, // mock
                      comentarios: Math.floor(Math.random() * 20) // mock
                    }} 
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-16 bg-white rounded-[20px] shadow-sm border border-gray-100">
                <p className="text-gray-500 text-lg">Nenhuma ocorrência encontrada com os filtros selecionados.</p>
              </div>
            )}

            {/* View More Button */}
            {filteredOccurrences.length > visibleCount && (
              <div className="w-full mt-8 flex justify-center">
                <button 
                  onClick={() => setVisibleCount(prev => prev + (isMobile ? 3 : 6))}
                  className="text-gray-800 font-semibold text-[15px] hover:text-primary transition-colors"
                >
                  Ver mais
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}