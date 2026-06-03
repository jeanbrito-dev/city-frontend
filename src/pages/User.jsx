import { useEffect, useState } from "react";
import {
  User,
  Mail,
  ShieldCheck,
  CalendarDays,
  Pencil,
  Trash2,
} from "lucide-react";

import { useNavigate } from "react-router-dom";
import { getUser, updateUser, deleteUser } from "../services/api";
import { getLoggedUser, setToken, logout } from "../utils/auth";

export default function Perfil() {
  const navigate = useNavigate();

  const storedUser = getLoggedUser();

  const [user, setUser] = useState(null);

  const [openEdit, setOpenEdit] = useState(false);
  const [openDelete, setOpenDelete] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const [nome, setNome] = useState("");
  const [email, setEmail] = useState("");
  const [senha, setSenha] = useState("");

  useEffect(() => {
    loadUser();
  }, []);

  const loadUser = async () => {
    try {
      const data = await getUser(storedUser.id);

      setUser(data);

      setNome(data.nome);
      setEmail(data.email);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdate = async () => {
    try {
      const updated = await updateUser(user.id, {
        nome,
        email,
        senha,
      });

      setToken(updated.token);

      setUser(updated.user);

      setOpenEdit(false);

      alert("Perfil atualizado");
    } catch (err) {
      console.error(err);
      alert("Erro ao atualizar");
    }
  };

  const handleDelete = async () => {
    try {
      await deleteUser(user.id);

      logout();

      navigate("/");

      alert("Conta deletada");
    } catch (err) {
      console.error(err);
      alert("Erro ao deletar conta");
    }
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-gray-500">Carregando usuário...</p>
      </div>
    );
  }

  const getFirstAndSecondName = (nomeCompleto) => {
    return nomeCompleto.split(" ").slice(0, 2).join(" ");
  };

  return (
    <div
      className="min-h-screen p-4 md:p-8"
      style={{
        backgroundColor: "#F3F3F3",
        fontFamily: "var(--font-text)",
      }}
    >
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="bg-gradient rounded-3xl p-6 md:p-8 text-white shadow-lg">
          <div className="flex flex-col md:flex-row items-center gap-5">
            {/* FOTO */}
            <div className="size-28 rounded-full bg-white/20 flex items-center justify-center border-4 border-white/30">
              <User size={50} />
            </div>

            {/* INFO */}
            <div className="text-center md:text-left">
              <h1
                className="text-2xl md:text-4xl font-semibold"
                style={{ fontFamily: "var(--font-title)" }}
              >
                {getFirstAndSecondName(user.nome)}
              </h1>

              <p className="text-sm opacity-90 mt-1">Perfil do cidadão</p>

              <div className="flex gap-3 mt-4 justify-center md:justify-start">
                <button
                  onClick={() => setOpenEdit(true)}
                  className="bg-white text-primary px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                >
                  <Pencil size={14} />
                  Editar perfil
                </button>

                <button
                  onClick={() => setOpenDelete(true)}
                  className="bg-red-500 text-white px-4 py-2 rounded-xl text-sm font-medium flex items-center gap-2"
                >
                  <Trash2 size={14} />
                  Deletar conta
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* DADOS */}
        <div className="bg-white rounded-2xl p-5 shadow-sm mt-6">
          <h2 className="text-lg font-semibold mb-5">Informações pessoais</h2>

          <div className="grid md:grid-cols-2 gap-5">
            {/* NOME */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <User size={18} className="text-primary" />
              </div>

              <div>
                <p className="text-xs text-gray-400">Nome</p>
                <p className="text-sm font-medium">{user.nome}</p>
              </div>
            </div>

            {/* EMAIL */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <Mail size={18} className="text-primary" />
              </div>

              <div>
                <p className="text-xs text-gray-400">Email</p>
                <p className="text-sm font-medium">{user.email}</p>
              </div>
            </div>

            {/* ROLE */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <ShieldCheck size={18} className="text-primary" />
              </div>

              <div>
                <p className="text-xs text-gray-400">Tipo de conta</p>

                <p className="text-sm font-medium">Cidadão</p>
              </div>
            </div>

            {/* DATA */}
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-xl">
                <CalendarDays size={18} className="text-primary" />
              </div>

              <div>
                <p className="text-xs text-gray-400">Conta criada em</p>

                <p className="text-sm font-medium">Agora</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* MODAL EDITAR */}
      {openEdit && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <h2 className="text-lg font-semibold mb-4">Editar perfil</h2>

            <div className="flex flex-col gap-3">
              <input
                value={nome}
                onChange={(e) => setNome(e.target.value)}
                placeholder="Nome"
                className="border rounded-xl px-3 py-2 outline-none"
              />

              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Email"
                className="border rounded-xl px-3 py-2 outline-none"
              />

              <input
                type="password"
                value={senha}
                onChange={(e) => setSenha(e.target.value)}
                placeholder="Nova senha (opcional)"
                className="border rounded-xl px-3 py-2 outline-none"
              />
            </div>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpenEdit(false)}
                className="text-gray-500"
              >
                Cancelar
              </button>

              <button
                onClick={handleUpdate}
                className="bg-primary text-white px-4 py-2 rounded-xl"
              >
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE 1 */}
      {openDelete && !confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <h2 className="text-lg font-semibold text-red-500">
              Deletar conta
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Tem certeza que deseja deletar sua conta?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => setOpenDelete(false)}
                className="text-gray-500"
              >
                Cancelar
              </button>

              <button
                onClick={() => setConfirmDelete(true)}
                className="bg-red-500 text-white px-4 py-2 rounded-xl"
              >
                Continuar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL DELETE 2 */}
      {confirmDelete && (
        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 px-4">
          <div className="bg-white rounded-2xl w-full max-w-md p-5">
            <h2 className="text-lg font-semibold text-red-500">
              Confirmação final
            </h2>

            <p className="text-sm text-gray-500 mt-2">
              Essa ação é irreversível. Deseja realmente apagar sua conta?
            </p>

            <div className="flex justify-end gap-3 mt-5">
              <button
                onClick={() => {
                  setConfirmDelete(false);
                  setOpenDelete(false);
                }}
                className="text-gray-500"
              >
                Cancelar
              </button>

              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded-xl"
              >
                Deletar conta
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
