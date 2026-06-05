import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { register } from "../services/api";

export default function Register() {
  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");
  const [confirmar, setConfirmar] = useState("");
  const navigate = useNavigate();

  const inputStyle =
    "w-full mt-1 px-4 py-2 border border-gray-400 rounded-full outline-none transition-all duration-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500";

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!nome || !email || !senha) {
      alert("Preencha todos os campos");
      return;
    }

    if (senha !== confirmar) {
      alert("Senhas não conferem");
      return;
    }

    try {
      const res = await register({ nome, email, senha });

      if (res.user) {
        navigate("/login");
      } else {
        alert("Erro ao cadastrar");
      }
    } catch {
      alert("Erro no cadastro");
    }
  };

  return (
    <div className="w-full max-w-sm font-text">
      <h1 className="text-2xl font-semibold text-center mb-2 md:mb-3">
        Criar uma conta
      </h1>

      <p className="text-sm text-secondary font-semibold text-center mb-3 md:mb-8">
        Faça parte do portal do cidadão de Caraguatatuba
      </p>

      <form onSubmit={handleSubmit} className="flex flex-col gap-3">
        <div className="text-left">
          <label className="text-sm">Nome completo</label>
          <input
            type="text"
            placeholder="Seu nome"
            value={nome}
            onChange={(e) => setNome(e.target.value)}
            className={inputStyle}
          />
        </div>

        <div className="text-left">
          <label className="text-sm">Email</label>
          <input
            type="email"
            placeholder="seu@gmail.com"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className={inputStyle}
          />
        </div>

        <div className="text-left">
          <label className="text-sm">Senha</label>
          <input
            type="password"
            placeholder="Mínimo 6 caracteres"
            value={senha}
            onChange={(e) => setSenha(e.target.value)}
            className={inputStyle}
          />
        </div>

        <div className="text-left">
          <label className="text-sm">Confirmar senha</label>
          <input
            type="password"
            placeholder="Digite a senha novamente"
            value={confirmar}
            onChange={(e) => setConfirmar(e.target.value)}
            className={inputStyle}
          />
        </div>

        <button className="mt-4 bg-gradient text-white py-3 rounded-full font-medium cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-xl hover:-translate-y-1 active:translate-y-0 active:scale-95">
          Criar conta
        </button>
      </form>

      <p className="text-sm text-center mt-4 md:mt-6">
        Já tem uma conta?{" "}
        <Link to="/login" className="text-blue-600 cursor-pointer hover:underline font-medium">
          Fazer login
        </Link>
      </p>
    </div>
  );
}