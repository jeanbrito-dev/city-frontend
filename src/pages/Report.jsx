import {
  AlertTriangle,
  MapPin,
  Image as ImageIcon,
  Send,
  CheckCircle,
  XCircle,
} from "lucide-react";

import { useState, useRef } from "react";
import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { createOccurrence } from "../services/api";
import { useNavigate } from "react-router-dom";
import { getLoggedUser } from "../utils/auth";

function LocationPicker({ onSelect }) {
  useMapEvents({
    click(e) {
      onSelect(e.latlng);
    },
  });

  return null;
}

export default function RelatarOcorrencia() {
  const [categoria, setCategoria] = useState("Ocorrência");
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const [imagem, setImagem] = useState(null);

  const fileInputRef = useRef();

  const user = getLoggedUser();

  const navigate = useNavigate();

  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");

  const [mapOpen, setMapOpen] = useState(false);

  const [selectedPosition, setSelectedPosition] = useState(null);

  const [selectedCoords, setSelectedCoords] = useState({
    latitude: null,
    longitude: null,
  });

  const [loading, setLoading] = useState(false);

  const [warning, setWarning] = useState(false);

  const [successModal, setSuccessModal] = useState("");
  const [errorModal, setErrorModal] = useState("");

  const categorias = [
    "Ocorrência",
    "Evento",
    "Infraestrutura",
    "Segurança",
    "Limpeza Urbana",
    "Iluminação Pública",
    "Trânsito",
    "Saúde Pública",
    "Meio Ambiente",
    "Sugestão",
  ];

  const handleFile = (e) => {
    const file = e.target.files[0];

    if (file) {
      setFileName(file.name);
      setImagem(file);
    }
  };

  const showSuccess = (message) => {
    setSuccessModal(message);

    setTimeout(() => {
      setSuccessModal("");
    }, 3000);
  };

  const showError = (message) => {
    setErrorModal(message);

    setTimeout(() => {
      setErrorModal("");
    }, 3000);
  };

  const getCoordinates = async (address) => {
    try {
      const res = await fetch(
        `https://city-backend-production.up.railway.app/geocode/search?q=${encodeURIComponent(address)}`,
      );

      const data = await res.json();

      if (!data || data.length === 0) {
        return null;
      }

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } catch {
      return null;
    }
  };

  const getAddressFromCoords = async (lat, lon) => {
    try {
      const res = await fetch(
        `https://city-backend-production.up.railway.app/geocode/reverse?lat=${lat}&lon=${lon}`,
      );

      const data = await res.json();

      return data.endereco || "";
    } catch (err) {
      console.error(err);
      return "";
    }
  };

  const handleSubmit = async () => {
    if (!titulo || !descricao || !local) {
      showError("Preencha todos os campos obrigatórios");
      return;
    }

    if (!user) {
      setWarning(true);
      return;
    }

    try {
      setLoading(true);

      let coords;

      if (selectedCoords.latitude && selectedCoords.longitude) {
        coords = selectedCoords;
      } else {
        coords = await getCoordinates(local);

        if (!coords) {
          showError("Endereço não encontrado. Seja mais específico.");
          return;
        }
      }

      const formData = new FormData();

      formData.append("titulo", titulo);
      formData.append("descricao", descricao);
      formData.append("categoria", categoria);
      formData.append("status", "pendente");
      formData.append("latitude", coords.latitude);
      formData.append("longitude", coords.longitude);
      formData.append("autor", user?.nome || "Anônimo");
      formData.append("userId", user?.id);

      if (imagem) {
        formData.append("imagem", imagem);
      }

      await createOccurrence(formData);

      showSuccess("Ocorrência criada com sucesso!");

      setTitulo("");
      setDescricao("");
      setLocal("");
      setCategoria("Ocorrência");
      setFileName("");
      setImagem(null);
    } catch (err) {
      console.error(err);

      showError("Erro ao enviar ocorrência");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      className="min-h-screen flex flex-col items-center p-4 md:p-8"
      style={{
        backgroundColor: "#F3F3F3",
        fontFamily: "var(--font-text)",
      }}
    >
      {/* LOGIN */}
      {warning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl p-6 w-full max-w-[320px] text-center shadow-2xl animate-fade-in">
            <div className="w-14 h-14 rounded-full bg-yellow-100 flex items-center justify-center mx-auto mb-4">
              <AlertTriangle className="text-yellow-600" size={28} />
            </div>

            <h2 className="text-lg font-semibold mb-2">Login necessário</h2>

            <p className="text-sm text-gray-500 mb-5">
              Você precisa estar logado para publicar uma ocorrência.
            </p>

            <div className="flex gap-3">
              <button
                onClick={() => setWarning(false)}
                className="flex-1 bg-gray-100 text-gray-600 py-2 rounded-xl text-sm hover:bg-gray-200 transition"
              >
                Cancelar
              </button>

              <button
                onClick={() => navigate("/login")}
                className="flex-1 bg-primary text-white py-2 rounded-xl text-sm hover:opacity-90 transition"
              >
                Fazer login
              </button>
            </div>
          </div>
        </div>
      )}

      {/* SUCCESS */}
      {successModal && (
        <div className="fixed top-5 right-5 z-[999] animate-fade-in">
          <div className="bg-success text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <CheckCircle size={20} />
            <span className="text-sm font-medium">{successModal}</span>
          </div>
        </div>
      )}

      {/* ERROR */}
      {errorModal && (
        <div className="fixed top-5 right-5 z-[999] animate-fade-in">
          <div className="bg-danger text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3">
            <XCircle size={20} />
            <span className="text-sm font-medium">{errorModal}</span>
          </div>
        </div>
      )}

      {/* HEADER */}
      <div className="text-center mb-6">
        <h1
          className="text-[22px] md:text-[32px] font-semibold"
          style={{
            fontFamily: "var(--font-title)",
          }}
        >
          Relatar ocorrência
        </h1>

        <p className="text-[12px] md:text-[14px] text-gray-500 mt-1">
          Preencha os dados abaixo para compartilhar com a comunidade.
        </p>
      </div>

      {/* CARD */}
      <div className="w-full max-w-md md:max-w-2xl bg-[#EDEDED] rounded-[16px] p-4 md:p-6 shadow-sm">
        {/* CATEGORIA */}
        <label className="text-[13px] md:text-[15px] font-medium mb-1 block">
          Categoria
        </label>

        <div className="relative mb-4">
          <div
            onClick={() => setOpen(!open)}
            className="bg-white rounded-[10px] px-3 py-2 flex justify-between items-center cursor-pointer"
          >
            <span className="text-[12px] md:text-[14px] text-gray-600">
              {categoria}
            </span>

            <span>▾</span>
          </div>

          {open && (
            <div className="absolute w-full bg-white rounded-[10px] mt-1 shadow-md z-10">
              {categorias.map((cat) => (
                <div
                  key={cat}
                  onClick={() => {
                    setCategoria(cat);
                    setOpen(false);
                  }}
                  className="px-3 py-2 text-[12px] md:text-[14px] hover:bg-gray-100 cursor-pointer"
                >
                  {cat}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* TITULO */}
        <label className="text-[13px] md:text-[15px] font-medium mb-1 block">
          Título do Relato
        </label>

        <input
          value={titulo}
          onChange={(e) => setTitulo(e.target.value)}
          placeholder="Ex: Buraco na Avenida da Praia"
          className="w-full bg-white rounded-[10px] px-3 py-2 text-[12px] md:text-[14px] outline-none border border-blue-500 mb-4"
        />

        {/* DESCRIÇÃO */}
        <label className="text-[13px] md:text-[15px] font-medium mb-1 block">
          Descrição Detalhada
        </label>

        <textarea
          value={descricao}
          onChange={(e) => setDescricao(e.target.value)}
          placeholder="Descreva o que aconteceu..."
          className="w-full bg-white rounded-[10px] px-3 py-2 text-[12px] md:text-[14px] outline-none mb-4 h-24 resize-none"
        />

        {/* LOCAL */}
        <label className="text-[13px] md:text-[15px] font-medium mb-1 block">
          Localização
        </label>

        <div className="bg-white rounded-[12px] px-3 py-2 flex items-center gap-2 mb-4 shadow-sm">
          <MapPin size={16} className="text-gray-400 flex-shrink-0" />

          <input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Rua, Bairro ou Ponto de Referência"
            className="flex-1 outline-none bg-transparent text-gray-600 text-[13px] md:text-[14px]"
          />

          <button
            type="button"
            onClick={() => setMapOpen(true)}
            className="bg-primary hover:opacity-90 text-white px-3 py-2 rounded-lg text-xs md:text-sm font-medium transition whitespace-nowrap"
          >
            Mapa
          </button>
        </div>
        {mapOpen && (
          <div className="fixed inset-0 z-[9999] bg-black/60 backdrop-blur-sm flex items-center justify-center p-3 md:p-6">
            <div className="bg-white w-full max-w-6xl h-[90vh] md:h-[85vh] rounded-3xl overflow-hidden shadow-2xl flex flex-col">
              {/* Header */}
              <div className="px-5 md:px-7 py-5 border-b bg-gradient-to-r from-primary/10 to-primary/5">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h2 className="font-title text-xl md:text-2xl font-bold text-gray-900">
                      Selecionar localização
                    </h2>

                    <p className="text-sm text-gray-500 mt-1">
                      Clique no mapa para marcar exatamente onde ocorreu o
                      problema.
                    </p>
                  </div>

                  <button
                    onClick={() => setMapOpen(false)}
                    className="w-10 h-10 rounded-xl bg-white border border-gray-200 hover:bg-gray-50 flex items-center justify-center text-gray-500 transition"
                  >
                    ✕
                  </button>
                </div>
              </div>

              {/* Coordenadas */}
              {selectedCoords.latitude && (
                <div className="px-5 md:px-7 py-3 bg-gray-50 border-b">
                  <div className="flex flex-col md:flex-row gap-2 md:gap-6 text-xs md:text-sm">
                    <span>
                      <strong>Latitude:</strong>{" "}
                      {selectedCoords.latitude.toFixed(6)}
                    </span>

                    <span>
                      <strong>Longitude:</strong>{" "}
                      {selectedCoords.longitude.toFixed(6)}
                    </span>
                  </div>
                </div>
              )}

              {/* Mapa */}
              <div className="flex-1 relative">
                <MapContainer
                  center={[-23.6205, -45.4132]}
                  zoom={13}
                  className="h-full w-full"
                >
                  <TileLayer
                    attribution="&copy; Stadia Maps &copy; OpenStreetMap contributors"
                    url="https://tiles.stadiamaps.com/tiles/alidade_smooth/{z}/{x}/{y}{r}.png"
                  />

                  <LocationPicker
                    onSelect={async (pos) => {
                      setSelectedPosition(pos);

                      setSelectedCoords({
                        latitude: pos.lat,
                        longitude: pos.lng,
                      });

                      try {
                        const endereco = await getAddressFromCoords(
                          pos.lat,
                          pos.lng,
                        );

                        setLocal(
                          endereco ||
                            `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`,
                        );
                      } catch {
                        setLocal(
                          `${pos.lat.toFixed(6)}, ${pos.lng.toFixed(6)}`,
                        );
                      }
                    }}
                  />

                  {selectedPosition && <Marker position={selectedPosition} />}
                </MapContainer>

                {/* Dica flutuante */}
                <div className="absolute top-4 left-4 z-[1000] bg-white/95 backdrop-blur-sm rounded-2xl px-4 py-3 shadow-lg border border-gray-200 max-w-[250px]">
                  <p className="text-xs md:text-sm text-gray-600">
                    📍 Clique em qualquer ponto do mapa para selecionar a
                    localização.
                  </p>
                </div>
              </div>

              {/* Footer */}
              <div className="border-t bg-white p-4 md:p-5">
                <div className="flex flex-col-reverse md:flex-row justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setMapOpen(false)}
                    className="px-5 py-3 rounded-xl border border-gray-300 text-gray-600 font-medium hover:bg-gray-50 transition"
                  >
                    Cancelar
                  </button>

                  <button
                    type="button"
                    disabled={!selectedPosition}
                    onClick={() => setMapOpen(false)}
                    className="px-5 py-3 rounded-xl bg-gradient text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] transition"
                  >
                    Confirmar localização
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* MOBILE */}
        <div className="block md:hidden mb-4">
          <label className="text-[13px] font-medium mb-1 block">
            URL da imagem <span className="text-gray-400">(Opcional)</span>
          </label>

          <div className="bg-white rounded-[10px] px-3 py-2 flex items-center gap-2 text-gray-400 text-[12px]">
            <ImageIcon size={14} />

            <input
              placeholder="https://exemplo.com/imagem.jpg"
              className="flex-1 outline-none bg-transparent"
            />
          </div>

          <p className="text-[10px] text-gray-400 mt-1">
            Cole um link direto para uma imagem
          </p>
        </div>

        {/* DESKTOP */}
        <div className="hidden md:block mb-4">
          <label className="text-[15px] font-medium mb-1 block">
            Carregar imagem <span className="text-gray-400">(Opcional)</span>
          </label>

          <button
            onClick={() => fileInputRef.current.click()}
            className="bg-white rounded-[10px] px-3 py-2 text-[14px] flex items-center gap-2"
          >
            <ImageIcon size={14} />

            {fileName || "Escolher arquivo"}
          </button>

          <input
            type="file"
            accept=".jpg,.jpeg,.png"
            ref={fileInputRef}
            onChange={handleFile}
            className="hidden"
          />
        </div>

        {/* AVISO */}
        <div className="bg-[#FCE8D5] border border-[#F5CFA0] rounded-[10px] p-3 flex gap-2 mb-5">
          <AlertTriangle size={16} className="text-[#B26A00]" />

          <p className="text-[11px] md:text-[13px] text-[#8A4B00]">
            Ao enviar, você confirma que as informações são verdadeiras. Relatos
            falsos prejudicam a comunidade.
          </p>
        </div>

        {/* BOTÃO */}
        <div className="flex justify-center">
          <button
            onClick={handleSubmit}
            disabled={loading}
            className="bg-gradient text-white px-6 py-2 md:px-8 md:py-3 rounded-[10px] text-[13px] md:text-[15px] font-medium flex items-center gap-2 cursor-pointer transition-all duration-300 ease-in-out hover:scale-105 hover:opacity-90 hover:shadow-lg active:scale-95 disabled:opacity-50"
          >
            {loading ? "Enviando..." : "Publicar Ocorrência"}

            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
