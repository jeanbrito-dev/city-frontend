import { useState } from "react";
import { NavLink, useLocation, useNavigate } from "react-router";
import { Menu, X, ChevronDown, User, LogOut, ShieldAlert } from "lucide-react";
import { getLoggedUser, logout } from "../../utils/auth";

export default function Header() {
  const [open, setOpen] = useState(false);
  const [profileOpen, setProfileOpen] = useState(false);

  const user = getLoggedUser();

  const location = useLocation();
  const isHome = location.pathname === "/";

  const navigate = useNavigate();

  const navLinkClass = ({ isActive }) =>
    `pb-1 transition cursor-pointer ${
      isActive ? "border-b-2 border-primary" : "hover:text-primary"
    } ${isHome ? "lg:text-white lg:hover:text-white/80" : ""}`;

  const navLinkMobile = ({ isActive }) =>
    `border-b border-gray-300 pb-2 text-center transition cursor-pointer ${
      isActive ? "text-primary font-semibold" : "hover:text-primary"
    }`;

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  const getFirstAndSecondName = (nomeCompleto) => {
    return nomeCompleto.split(" ").slice(0, 2).join(" ");
  };

  return (
    <header
      className={`p-4 z-50 ${
        isHome
          ? "shadow-xl bg-white lg:absolute lg:top-0 lg:left-0 lg:w-full lg:bg-black/20 lg:backdrop-blur-[6px] lg:shadow-none"
          : "shadow-xl bg-white"
      }`}
    >
      <div className="flex items-center justify-between">
        {/* Logo */}
        <NavLink
          to={user ? "/dashboard" : "/"}
          className={`flex items-center gap-2 cursor-pointer transition-all duration-200 hover:scale-105 ${
            isHome ? "lg:text-white" : ""
          }`}
        >
          <img src="/logo.png" alt="Logo" className="size-10" />

          <span className="font-title text-xl">
            Uni
            <span
              className={
                isHome ? "text-primary lg:text-white" : "text-primary"
              }
            >
              city
            </span>
          </span>
        </NavLink>

        {/* Menu desktop */}
        <nav className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
          <NavLink to={user ? "/dashboard" : "/"} className={navLinkClass}>
            {user ? "Dashboard" : "Home"}
          </NavLink>

          <NavLink to="/relatar" className={navLinkClass}>
            Relatar
          </NavLink>

          <NavLink to="/mapa" className={navLinkClass}>
            Mapa
          </NavLink>
        </nav>

        {/* Desktop actions */}
        <div className="hidden md:flex items-center gap-4 relative">
          {user ? (
            <div className="relative">
              <button
                type="button"
                onClick={() => setProfileOpen(!profileOpen)}
                className="
                  flex
                  items-center
                  gap-2
                  bg-primary
                  text-white
                  font-bold
                  font-text
                  px-4
                  py-2
                  rounded-xl
                  cursor-pointer
                  transition-all
                  duration-300
                  hover:scale-105
                  hover:shadow-xl
                  hover:brightness-110
                  active:scale-95
                "
              >
                <User size={16} />
                {getFirstAndSecondName(user.nome)}
                <ChevronDown
                  size={16}
                  className={`transition-transform duration-300 ${
                    profileOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {profileOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-200 overflow-hidden z-50 animate-fade-in">
                  {user.role === "admin" && (
                    <NavLink
                      to="/admin"
                      onClick={() => setProfileOpen(false)}
                      className="
                        flex
                        items-center
                        gap-2
                        px-4
                        py-3
                        text-sm
                        text-primary
                        font-semibold
                        border-b
                        border-gray-100
                        cursor-pointer
                        transition-all
                        duration-200
                        hover:bg-primary/10
                      "
                    >
                      <ShieldAlert size={16} />
                      Painel Admin
                    </NavLink>
                  )}

                  <NavLink
                    to="/perfil"
                    onClick={() => setProfileOpen(false)}
                    className="
                      flex
                      items-center
                      gap-2
                      px-4
                      py-3
                      text-sm
                      cursor-pointer
                      transition-all
                      duration-200
                      hover:bg-gray-100
                      hover:pl-5
                    "
                  >
                    <User size={16} />
                    Minha conta
                  </NavLink>

                  <button
                    type="button"
                    onClick={handleLogout}
                    className="
                      w-full
                      flex
                      items-center
                      gap-2
                      px-4
                      py-3
                      text-sm
                      text-danger
                      cursor-pointer
                      transition-all
                      duration-200
                      hover:bg-red-50
                      hover:pl-5
                    "
                  >
                    <LogOut size={16} />
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
              <NavLink
                to="/login"
                className={`px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 active:scale-95 ${
                  isHome
                    ? "lg:text-white lg:border-tertiary text-primary border border-gray-400"
                    : "text-primary border border-gray-400"
                }`}
              >
                Login
              </NavLink>

              <NavLink
                to="/cadastro"
                className="bg-primary text-white px-4 py-2 rounded-xl cursor-pointer transition-all duration-300 hover:scale-105 hover:shadow-lg active:scale-95"
              >
                Cadastrar-se
              </NavLink>
            </>
          )}
        </div>

        {/* Mobile button */}
        <button
          type="button"
          className="md:hidden cursor-pointer transition-all duration-200 active:scale-90"
          onClick={() => setOpen(!open)}
        >
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Mobile menu */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${
          open ? "max-h-96 mt-4" : "max-h-0"
        }`}
      >
        <nav className="flex flex-col gap-4">
          <NavLink
            to={user ? "/dashboard" : "/"}
            onClick={() => setOpen(false)}
            className={navLinkMobile}
          >
            {user ? "Dashboard" : "Home"}
          </NavLink>

          <NavLink
            to="/relatar"
            onClick={() => setOpen(false)}
            className={navLinkMobile}
          >
            Relatar
          </NavLink>

          <NavLink
            to="/mapa"
            onClick={() => setOpen(false)}
            className={navLinkMobile}
          >
            Mapa
          </NavLink>

          {user ? (
            <>
              {user.role === "admin" && (
                <NavLink
                  to="/admin"
                  onClick={() => setOpen(false)}
                  className="bg-slate-800 text-white font-semibold font-text px-4 py-2 rounded-xl text-center flex items-center justify-center gap-2 cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95"
                >
                  <ShieldAlert size={16} />
                  Painel Admin
                </NavLink>
              )}

              <NavLink
                to="/perfil"
                onClick={() => setOpen(false)}
                className="bg-primary text-white font-semibold font-text px-4 py-2 rounded-xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95"
              >
                Minha conta
              </NavLink>

              <button
                type="button"
                onClick={handleLogout}
                className="bg-danger text-white px-4 py-2 rounded-xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="text-primary border border-gray-400 px-4 py-2 rounded-xl mt-4 text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] active:scale-95"
              >
                Login
              </NavLink>

              <NavLink
                to="/cadastro"
                onClick={() => setOpen(false)}
                className="bg-primary text-white px-4 py-2 rounded-xl text-center cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-lg active:scale-95"
              >
                Registrar
              </NavLink>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}