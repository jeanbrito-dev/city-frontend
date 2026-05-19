import { AlertTriangle, MapPin, Image as ImageIcon, Send } from "lucide-react";
import { useState, useRef } from "react";
import { createOccurrence } from "../services/api";
import { useNavigate } from "react-router-dom";

export default function RelatarOcorrencia() {
  const [categoria, setCategoria] = useState("Ocorrência");
  const [open, setOpen] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = useRef();
  const user = JSON.parse(localStorage.getItem("user"));
  const navigate = useNavigate();

  // novos states
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [local, setLocal] = useState("");
  const [loading, setLoading] = useState(false);
  const [warning, setWarning] = useState(false);

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
    if (file) setFileName(file.name);
  };

  const getCoordinates = async (address) => {
    try {
      const res = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`,
      );

      const data = await res.json();

      if (!data || data.length === 0) return null;

      return {
        latitude: parseFloat(data[0].lat),
        longitude: parseFloat(data[0].lon),
      };
    } catch {
      return null;
    }
  };

  // envio para API
  const handleSubmit = async () => {
    if (!titulo || !descricao || !local) {
      alert("Preencha todos os campos obrigatórios");
      return;
    }

    if (!user) {
      setWarning(true);
      return;
    }

    try {
      setLoading(true);

      // converte endereço → coordenadas
      const coords = await getCoordinates(local);

      // valida endereço
      if (!coords) {
        alert("Endereço não encontrado. Seja mais específico.");
        return;
      }

      const user = JSON.parse(localStorage.getItem("user"));

      await createOccurrence({
        titulo,
        descricao,
        categoria,
        status: "pendente",
        latitude: coords.latitude,
        longitude: coords.longitude,
        autor: user?.nome || "Anônimo",
      });

      alert("Ocorrência criada!");

      // reset
      setTitulo("");
      setDescricao("");
      setLocal("");
      setCategoria("Ocorrência");
      setFileName("");
    } catch (err) {
      console.error(err);
      alert("Erro ao enviar");
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
      {warning && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[300px] text-center shadow-xl">
            <h2 className="text-lg font-semibold mb-2">Login necessário</h2>

            <p className="text-sm text-gray-500 mb-5">
              Você precisa estar logado para publicar uma ocorrência.
            </p>

            <button
              onClick={() => navigate("/login")}
              className="bg-primary text-white px-5 py-2 rounded-xl text-sm"
            >
              Fazer login
            </button>
          </div>
        </div>
      )}
      {/* HEADER */}
      <div className="text-center mb-6">
        <h1
          className="text-[22px] md:text-[32px] font-semibold"
          style={{ fontFamily: "var(--font-title)" }}
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

        <div className="bg-white rounded-[10px] px-3 py-2 flex items-center gap-2 text-gray-400 text-[12px] md:text-[14px] mb-4">
          <MapPin size={14} />
          <input
            value={local}
            onChange={(e) => setLocal(e.target.value)}
            placeholder="Rua, Bairro ou Ponto de Referência"
            className="flex-1 outline-none bg-transparent text-gray-600"
          />
        </div>

        {/* MOBILE → URL */}
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

        {/* DESKTOP → FILE */}
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
            className="bg-gradient text-white px-6 py-2 md:px-8 md:py-3 rounded-[10px] text-[13px] md:text-[15px] font-medium flex items-center gap-2"
          >
            {loading ? "Enviando..." : "Publicar Ocorrência"}
            <Send size={16} />
          </button>
        </div>
      </div>
    </div>
  );
}
