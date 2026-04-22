import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";

export default function Header() {
  const [open, setOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));

  const navLinkClass = "hover:text-primary transition";
  const navLinkMobile = "border-b-1 border-gray-300 pb-2 text-center";

  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  return (
    <header className="p-4 shadow-xl">
      <div className="flex items-center justify-between">
        {/* Logo */}
        <NavLink to={user ? "/dashboard" : "/"} className="flex items-center gap-2">
          <img src="/logo.png" alt="Logo" className="size-10" />
          <span className="font-title text-xl">
            Uni<span className="text-primary">city</span>
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

          {user && (
            <NavLink to="/minhas-denuncias" className={navLinkClass}>
              Minhas denúncias
            </NavLink>
          )}
        </nav>

        {/* Ações desktop */}
        <div className="hidden md:flex items-center gap-4">
          {user ? (
            <button
              onClick={handleLogout}
              className="bg-danger text-white px-4 py-2 rounded-xl"
            >
              Logout
            </button>
          ) : (
            <>
              <NavLink
                to="/login"
                className="text-primary border border-gray-400 px-4 py-2 rounded-xl"
              >
                Login
              </NavLink>
              <NavLink
                to="/cadastro"
                className="bg-primary text-white px-4 py-2 rounded-xl"
              >
                Cadastrar-se
              </NavLink>
            </>
          )}
        </div>

        {/* Botão mobile */}
        <button className="md:hidden" onClick={() => setOpen(!open)}>
          {open ? <X size={28} /> : <Menu size={28} />}
        </button>
      </div>

      {/* Menu mobile */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-4" : "max-h-0"}`}
      >
        <nav className="flex flex-col gap-4">
          <NavLink to={user ? "/dashboard" : "/"} className={navLinkClass}>
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
              <NavLink
                to="/minhas-denuncias"
                onClick={() => setOpen(false)}
                className={navLinkMobile}
              >
                Minhas denúncias
              </NavLink>
              <button
                onClick={handleLogout}
                className="bg-danger text-white px-4 py-2 rounded-xl text-center"
              >
                Logout
              </button>
            </>
          ) : (
            <>
              <NavLink
                to="/login"
                onClick={() => setOpen(false)}
                className="text-primary border border-gray-400 px-4 py-2 rounded-xl mt-4 text-center"
              >
                Login
              </NavLink>
              <NavLink
                to="/cadastro"
                onClick={() => setOpen(false)}
                className="bg-primary text-white px-4 py-2 rounded-xl text-center"
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
