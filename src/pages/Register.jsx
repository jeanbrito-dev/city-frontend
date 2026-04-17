import { Link } from "react-router"

export default function Register() {
    const inputStyle = "w-full mt-1 px-4 py-1.5 md:py-2 border border-gray-400 rounded-full outline-none"

  return (
    <div className="w-full max-w-sm font-text">
      <h1 className="text-2xl font-semibold text-center mb-2 md:mb-3">
        Criar uma conta
      </h1>

      <p className="text-sm text-secondary font-semibold text-center mb-3 md:mb-8">
        Faça parte do portal do cidadão de Caraguatatuba
      </p>

      <form className="flex flex-col gap-3">
        <div className="text-left">
          <label className="text-sm">Nome completo</label>
          <input
            type="text"
            placeholder="Seu nome"
            className={inputStyle}
          />
        </div>

        <div className="text-left">
          <label className="text-sm">Email</label>
          <input
            type="email"
            placeholder="seu@gmail.com"
            className={inputStyle}
          />
        </div>

        <div className="text-left"> 
          <label className="text-sm">Senha</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            className={inputStyle}
          />
        </div>

        <div className="text-left">
          <label className="text-sm">Confirmar senha</label>
          <input
            type="password"
            placeholder="Digite a senha novamente"
            className={inputStyle}
          />
        </div>

        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition">
          Criar conta
        </button>
      </form>

      <p className="text-sm text-center mt-4 md:mt-6">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-blue-600 cursor-pointer">
          Fazer login
        </Link>
      </p>
    </div>
  );
}