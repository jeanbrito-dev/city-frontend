import { Link } from "react-router-dom";
import { AlertTriangle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-[#F3F3F3] px-4">
      
      <div className="bg-white p-8 rounded-[20px] shadow-md text-center max-w-sm w-full">
        
        {/* ÍCONE */}
        <div className="flex justify-center mb-4">
          <div className="bg-red-100 text-red-500 p-4 rounded-full">
            <AlertTriangle size={32} />
          </div>
        </div>

        {/* TÍTULO */}
        <h1 className="text-5xl font-bold text-primary font-title">
          404
        </h1>

        {/* TEXTO */}
        <p className="mt-2 text-gray-600 text-sm">
          Página não encontrada
        </p>

        <p className="mt-1 text-gray-400 text-xs">
          O conteúdo que você tentou acessar não existe ou foi removido.
        </p>

        {/* BOTÕES */}
        <div className="mt-6 flex flex-col gap-2">
          
          <Link
            to="/"
            className="bg-gradient text-white py-2 rounded-[10px] text-sm font-medium"
          >
            Voltar para o início
          </Link>

          <button
            onClick={() => window.history.back()}
            className="text-gray-500 text-xs hover:underline"
          >
            Voltar para página anterior
          </button>

        </div>

      </div>
    </div>
  );
}