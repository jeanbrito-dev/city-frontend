import { useState } from "react";
import { NavLink } from "react-router";
import { Menu, X } from "lucide-react";

export default function Header() {
    const [open, setOpen] = useState(false);
    const [isLogged, setIsLogged] = useState(false);

    const navLinkClass = "hover:text-primary transition";
    const navLinkMobile = "border-b-1 border-gray-300 pb-2 text-center";

    return (
        <header className="p-4 shadow-xl">
            <div className="flex items-center justify-between">

                {/* Logo */}
                <NavLink to="/" className="flex items-center gap-2">
                    <img src="/logo.png" alt="Logo" className="size-10" />
                    <span className="font-title text-xl">
                        Uni<span className="text-primary">city</span>
                    </span>
                </NavLink>

                {/* Menu central (desktop) */}
                <nav className="hidden md:flex gap-6 absolute left-1/2 -translate-x-1/2">
                    <NavLink to="/" className={navLinkClass}>Home</NavLink>
                    <NavLink to="/relatar" className={navLinkClass}>Relatar</NavLink>
                    <NavLink to="/mapa" className={navLinkClass}>Mapa</NavLink>

                    {isLogged && (
                        <NavLink to="/minhas-denuncias" className={navLinkClass}>
                            Minhas denúncias
                        </NavLink>
                    )}
                </nav>

                {/* Ações (direita desktop) */}
                <div className="hidden md:flex items-center gap-4">
                    {isLogged ? (
                        <button 
                            onClick={() => setIsLogged(false)}
                            className="bg-danger text-white px-4 py-2 rounded-xl"
                        >
                            Logout
                        </button>
                    ) : (
                        <>
                            <NavLink to="/login" className="text-primary transition border border-gray-400 px-4 py-2 rounded-xl">
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

                {/* Botão Hamburguer */}
                <button 
                    className="md:hidden"
                    onClick={() => setOpen(!open)}
                >
                    <div className="transition-transform duration-300">
                        {open ? <X size={28} /> : <Menu size={28} />}
                    </div>
                </button>
            </div>

            {/* Menu Mobile com animação */}
            <div className={`md:hidden overflow-hidden transition-all duration-300 ${open ? "max-h-96 mt-4" : "max-h-0"}`}>
                <nav className="flex flex-col gap-4">
                    <NavLink to="/" onClick={() => setOpen(false)} className={navLinkMobile}>Home</NavLink>
                    <NavLink to="/relatar" onClick={() => setOpen(false)} className={navLinkMobile}>Relatar</NavLink>
                    <NavLink to="/mapa" onClick={() => setOpen(false)} className={navLinkMobile}>Mapa</NavLink>

                    {isLogged ? (
                        <>
                            <NavLink to="/minhas-denuncias" onClick={() => setOpen(false)} className={navLinkMobile}>
                                Minhas denúncias
                            </NavLink>
                            <button onClick={() => setOpen(false)} className="bg-danger text-white px-4 py-2 rounded-xl text-center">
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <NavLink to="/login" onClick={() => setOpen(false)} className="text-primary transition border border-gray-400 px-4 py-2 rounded-xl mt-8 text-center">
                                Login
                            </NavLink>
                            <NavLink to="/cadastrar" onClick={() => setOpen(false)} className="bg-primary text-white px-4 py-2 rounded-xl text-center">
                                Registrar
                            </NavLink>
                        </>
                    )}
                </nav>
            </div>
        </header>
    );
}