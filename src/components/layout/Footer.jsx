import { Phone, Mail, Globe } from "lucide-react";

export default function Footer() {
  const linkContact = "text-tertiary hover:text-tertiary/50 transition";

  return (
    <footer className="bg-footer pt-16 text-center flex flex-col gap-5">
      <div className="grid grid-cols-1 md:grid-cols-[1fr_auto_1fr] gap-8 items-stretch md:pb-8 px-6">
        {/* Sobre */}
        <div className="flex flex-col gap-8 md:pl-30 md:gap-2 md:text-left">
          <span className="font-title text-3xl text-white">
            Uni<span className="text-primary">city</span>
          </span>
          <p className="text-gray-200">
            Uma plataforma colaborativa para melhorar nossa cidade. Relate
            problemas, divulgue eventos e ajude a comunidade.
          </p>
        </div>

        {/* Linha */}
        <span className="bg-gray-200 w-full h-px md:w-px md:h-full"></span>

        {/* Contato */}
        <div className="flex flex-col md:flex-row items-center gap-2 md:gap-6 text-gray-200 md:text-right md:pr-30">
          {/* Telefone */}
          <div className="flex flex-col items-center md:items-center gap-2">
            <Phone
              className="hidden md:block rounded-full bg-tertiary text-black p-1"
              size={30}
            />
            <span>Telefone: (23)34567885</span>
          </div>

          {/* Email */}
          <div className="flex flex-col items-center md:items-center gap-2">
            <Mail
              className="hidden md:block rounded-full bg-tertiary text-black p-1"
              size={30}
            />
            <span>
              Email:{" "}
              <a href="mailto:unicity@gmail.com" className={linkContact}>
                unicity@gmail.com
              </a>
            </span>
          </div>

          {/* Instagram */}
          <div className="flex flex-col items-center md:items-center gap-2">
            <Globe
              className="hidden md:block rounded-full bg-tertiary text-black p-1"
              size={30}
            />
            <span>
              Instagram:{" "}
              <a
                href="https://instagram.com/unicity_oficial"
                target="_blank"
                rel="noopener noreferrer"
                className={linkContact}
              >
                @unicity_oficial
              </a>
            </span>
          </div>
        </div>
      </div>
      <span className="block w-full h-px bg-gray-600 mt-5"></span>
      <p className="text-gray-400 text-sm pb-6">
        © {new Date().getFullYear()} Unicity. Todos os direitos reservados.
      </p>
    </footer>
  );
}
