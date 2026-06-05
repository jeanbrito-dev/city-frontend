import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { login } from "../services/api";
import { setToken } from "../utils/auth";

export default function Login() {
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await login({ email, senha });

      if (res.token) {
        setToken(res.token);
        navigate(`/dashboard?nome=${res.user.nome}`);
      } else {
        alert("Credenciais inválidas");
      }
    } catch {
      alert("Erro ao fazer login");
    }
  };

  return (
    <div className="w-full max-w-sm font-text">
      <h1 className="text-2xl font-semibold text-center mb-2">
        Bem-vindo
      </h1>

      <p className="text-sm text-blue-600 font-semibold text-center mb-6">
        Acesse sua conta na Unicity
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-4">
        <div className="text-left">
          <label className="text-sm">Email</label>
          <input
            type="email"
            placeholder="seu@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-full outline-none"
          />
        </div>

        <div className="text-left">
          <label className="text-sm">Senha</label>
          <input
            type="password"
            placeholder="sua senha"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className="w-full mt-1 px-4 py-2 border border-gray-400 rounded-full outline-none"
          />
        </div>

        <button
          type="submit" className="mt-4 bg-gradient text-white py-3 rounded-full font-medium cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95">Entrar</button>
      </form>

      <p className="text-sm text-center mt-6">
        Ainda não tem uma conta?{" "}
        <Link to="/cadastro" className="text-blue-600 hover:underline font-medium">
          Registrar-se
        </Link>
      </p>
    </div>
  );
}