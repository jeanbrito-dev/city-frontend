import { Link } from "react-router"

export default function Login() {
  return (
    <div className="w-full max-w-sm font-text">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Bem-vindo
      </h1>

      <p className="text-sm text-blue-600 font-semibold text-center mb-6">
        Acesse sua conta na Unicity
      </p>

      <form className="flex flex-col gap-4">
        <div className="text-left">
          <label className="text-sm">Email</label>
          <input
            type="email"
            placeholder="seu@email.com"
            className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-full outline-none"
          />
        </div>

        <div className="text-left">
          <label className="text-sm">Senha</label>
          <input
            type="password"
            placeholder="Digite sua senha"
            className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-full outline-none"
          />
          <p className="text-xs text-blue-600 text-right mt-1 cursor-pointer">
            Esqueceu a senha?
          </p>
        </div>

        <button className="mt-4 bg-blue-500 hover:bg-blue-600 text-white py-2 rounded-full transition">
          Entrar
        </button>
      </form>

      <p className="text-sm text-center mt-6">
        Ainda não tem uma conta?{" "}
        <Link to="/cadastro" className="text-blue-600 cursor-pointer">
          Registrar-se
        </Link>
      </p>
    </div>
  );
}