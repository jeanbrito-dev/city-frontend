import { Link } from "react-router-dom";
import { useEffect } from "react";

/* Essa função e para criar o efeito ripple (ondinha) em qualquer elemento que esteja com a classe btn-ripple */
function useRipple() {
  useEffect(() => {
    const handler = (e) => {
      const btn = e.currentTarget;
      const circle = document.createElement("span");
      const rect = btn.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      circle.style.cssText = `
        position:absolute; border-radius:50%; pointer-events:none;
        width:${size}px; height:${size}px;
        left:${e.clientX - rect.left - size / 2}px;
        top:${e.clientY - rect.top - size / 2}px;
        background:rgba(255,255,255,0.28);
        transform:scale(0); animation:ripple 0.55s ease-out forwards;
      `;
      btn.appendChild(circle);
      circle.addEventListener("animationend", () => circle.remove());
    };

    const btns = document.querySelectorAll(".btn-ripple");
    btns.forEach((btn) => btn.addEventListener("click", handler));
    return () => btns.forEach((btn) => btn.removeEventListener("click", handler));
  }, []);
}
import heroImage from "../assets/hero-desktop.jpeg";
import sectionImageOne from "../assets/hero-mobile.jpeg";
import sectionImageTwo from "../assets/hero-extra.jpeg";

function useScrollReveal() {
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) e.target.classList.add("visible");
        });
      },
      { threshold: 0.12 }
    );
    document.querySelectorAll(".reveal").forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);
}

const mobileCards = [
  {
    title: "Mapa Interativo",
    description:
      "Visualize todas as ocorrências reportadas em Caraguatatuba em tempo real",
  },
  {
    title: "Reporte Ocorrências",
    description:
      "Ajude a melhorar a cidade reportando problemas de infraestrutura, segurança e mais",
  },
  {
    title: "Transparência",
    description:
      "Acompanhe o status das ocorrências e veja as ações tomadas pela administração",
  },
];

const desktopCards = [
  {
    title: "Transparência",
    description:
      "Acompanhe o status das ocorrências e veja as ações tomadas pela administração",
  },
  {
    title: "Mapa Interativo",
    description:
      "Visualize todas as ocorrências reportadas em Caraguatatuba em tempo real",
  },
  {
    title: "Reporte Ocorrências",
    description:
      "Ajude a melhorar a cidade reportando problemas de infraestrutura, segurança e mais",
  },
  {
    title: "Usabilidade",
    description: "Interface simplificada para melhor experiência e compreensão",
  },
];

function MobileHero() {
  return (
    <div className="lg:hidden">
      <div className="relative pl-4 pt-3">
        <div className="relative ml-4 h-95 overflow-hidden rounded-bl-[44px] rounded-tr-[20px] bg-[#cfddeb]">
          <img
            src={heroImage}
            alt="Paisagem de Caraguatatuba"
            className="absolute inset-0 h-full w-full object-cover hero-img"
            style={{ objectPosition: "center 65%" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,35,58,0.08)_0%,rgba(17,35,58,0.28)_100%)]" />

          <div className="absolute right-4 top-12 w-50 text-right z-10">
            <h1 className="font-title text-3xl leading-[0.90] font-semibold tracking-[-0.03em] text-white">
              <span className="fade-up block" style={{ animationDelay: "0ms" }}>Juntos por uma</span>
              <span className="fade-up block text-tertiary" style={{ animationDelay: "120ms" }}>Caraguatatuba</span>
              <span className="fade-up block" style={{ animationDelay: "240ms" }}>melhor</span>
            </h1>
          </div>
        </div>

        <div className="absolute left-0 top-55 w-52.5 rounded-[20px] bg-tertiary/90 px-6 py-5 shadow-[0_10px_24px_rgba(66,55,224,0.20)] z-20">
          <p className="font-title text-[15px] leading-[1.3] tracking-[-0.015em] text-white">
            Reporte ocorrências e acompanhe soluções
          </p>
        </div>
      </div>

      <div className="mt-8 px-8 flex flex-col gap-5">
        <Link
          to="/mapa"
          className="btn-ripple flex min-h-15 items-center justify-center rounded-2xl bg-primary px-6 text-center font-text text-lg font-semibold text-white"
        >
          Ver mapa
        </Link>
        <Link
          to="/relatar"
          className="btn-ripple flex min-h-15 items-center justify-center rounded-2xl bg-[#D9D9D9] px-6 text-center font-text text-lg font-semibold text-white"
        >
          Registrar ocorrência
        </Link>
      </div>
    </div>
  );
}

function DesktopHero() {
  return (
    <div className="hidden lg:block">
      <div className="relative min-h-190 w-full overflow-hidden">
        <img
          src={heroImage}
          alt="Paisagem"
          className="absolute inset-0 h-full w-full object-cover hero-img"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,11,28,0.88)_0%,rgba(8,11,28,0.52)_42%,rgba(8,11,28,0.08)_100%)]" />

        <div className="relative flex min-h-190 flex-col justify-center items-start px-12 z-10">
          <div className="max-w-130 text-left">
            <h1 className="font-title text-[64px] leading-[0.96] font-semibold text-white">
              <span className="fade-up block" style={{ animationDelay: "80ms" }}>Juntos por uma</span>
              <span className="fade-up block text-tertiary" style={{ animationDelay: "220ms" }}>Caraguatatuba</span>
              <span className="fade-up block" style={{ animationDelay: "360ms" }}>melhor</span>
            </h1>

            <p
              className="fade-up mt-6 font-text text-[18px] text-white/65 leading-relaxed max-w-md"
              style={{ animationDelay: "480ms" }}
            >
              Relate problemas, acompanhe soluções e ajude a transformar a sua cidade.
            </p>
          </div>

          <Link
            to="/mapa"
            className="btn-ripple fade-up mt-9 flex min-h-18 w-75 items-center justify-center rounded-xl bg-[#3C6FBD] px-6 text-center font-text text-2xl font-semibold text-white"
            style={{ animationDelay: "580ms" }}
          >
            Ver mapa
          </Link>
        </div>
      </div>
    </div>
  );
}

function CTASection() {
  return (
    <section className="bg-gradient px-5 py-14 text-center text-white sm:px-8 lg:py-18">
      <div className="mx-auto max-w-160 reveal">
        <h2 className="font-title text-[34px] leading-[1.15] font-bold sm:text-[42px] lg:text-5xl">
          Pronto para fazer a diferença?
        </h2>

        <p className="mx-auto mt-5 font-text text-base leading-[1.6] text-[#EAF3FF] sm:text-lg lg:text-xl">
          Cadastre-se gratuitamente e comece a reportar ocorrências na sua região
        </p>

        <div className="mx-auto mt-12 flex flex-col items-center gap-4 lg:mt-12">
          <Link
            to="/cadastro"
            className="btn-ripple flex min-h-14.5 w-full max-w-80 items-center justify-center rounded-[14px] border-2 border-[#81E7FF] bg-white px-6 text-center font-text text-lg font-semibold text-primary lg:w-65"
          >
            Criar conta grátis
          </Link>

          <Link
            to="/relatar"
            className="btn-ripple flex min-h-14.5 w-full max-w-80 items-center justify-center rounded-[14px] border-2 border-white bg-transparent px-6 text-center font-text text-lg font-semibold text-white lg:w-65"
          >
            Reportar agora
          </Link>
        </div>

        <p className="mt-5 pb-2 font-text text-[15px] text-[#D6E6FF] lg:mt-4.5">
          Já tem uma conta?{" "}
          <Link to="/login" className="underline underline-offset-2">
            Fazer login
          </Link>
        </p>
      </div>
    </section>
  );
}

export default function Home() {
  useScrollReveal();
  useRipple();

  return (
    <section className="w-full bg-white text-black">
        <MobileHero />
        <DesktopHero />

        <section className="px-8 py-16 sm:px-10 lg:px-14.5 lg:pt-20 lg:pb-30">
          <div className="mb-8 h-[3px] w-36 mx-auto bg-primary lg:hidden" />

          {/* Mobile */}
          <div className="lg:hidden">
            <div className="text-center reveal">
              <h2 className="font-title text-[28px] leading-[1.1] sm:text-[34px]">
                Como funciona?
              </h2>
              <p className="mx-auto mt-5 max-w-86.5 font-text text-base leading-[1.65] text-[#606060] sm:text-lg">
                Participe da gestão da nossa cidade de forma simples e transparente
              </p>
            </div>
            <div className="mt-12 grid gap-8">
              {mobileCards.map((card, i) => (
                <article
                  key={card.title}
                  className="reveal feature-card min-h-50 bg-[#F7F7F7] px-6 pt-18 pb-8 sm:px-8 rounded-[10px]"
                  style={{ transitionDelay: `${i * 80}ms` }}
                >
                  <h3 className="font-title text-2xl leading-[1.2]">{card.title}</h3>
                  <p className="mt-4 font-text text-base leading-[1.65] text-[#2F2F2F]">
                    {card.description}
                  </p>
                </article>
              ))}
            </div>
          </div>

          {/* Desktop */}
          <div className="hidden lg:block">
            <div className="mb-10 h-0.75 w-full bg-primary" />

            <div className="mx-auto max-w-275">
              <div className="grid grid-cols-[360px_1fr] gap-10 items-center">
                <div className="reveal">
                  <h2 className="font-title text-[58px] leading-[1.02]">Como Funciona?</h2>
                  <p className="mt-8.5 font-text text-[28px] leading-[1.45] text-[#5E5E5E]">
                    Participe da gestão da nossa cidade de forma simples e transparente
                  </p>
                  <Link
                    to="/mapa"
                    className="btn-ripple mt-7 flex min-h-13.5 w-34.5 items-center justify-center rounded-lg bg-primary px-4 text-center font-text text-lg font-semibold text-white"
                  >
                    Ver mapa
                  </Link>
                  <Link
                    to="/relatar"
                    className="btn-ripple mt-3.5 inline-flex font-text text-lg font-semibold text-primary transition-opacity duration-200 hover:opacity-50"
                  >
                    Registrar ocorrência →
                  </Link>
                  <p className="mt-2.5 font-text text-sm text-[#1f1f1f]">Mapa Interativo</p>
                </div>

                <div className="relative h-72.5 reveal">
                  <img
                    src={sectionImageOne}
                    alt="Praia"
                    className="section-img absolute right-40 top-0 h-64 w-80 rounded-xl object-cover shadow-[0_6px_20px_rgba(0,0,0,0.10)] z-0"
                  />
                  <img
                    src={sectionImageTwo}
                    alt="Cidade"
                    className="section-img absolute right-0 top-20 h-72 w-96 rounded-xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.14)] z-[1]"
                  />
                </div>
              </div>

              <div className="mt-32 grid grid-cols-2 gap-x-8 gap-y-9.5">
                {desktopCards.map((card, i) => (
                  <article
                    key={card.title}
                    className="reveal feature-card min-h-47.5 rounded-[10px] bg-[#F7F7F7] px-6.5 py-7"
                    style={{ transitionDelay: `${i * 70}ms` }}
                  >
                    <h3 className="font-title text-2xl leading-[1.1]">{card.title}</h3>
                    <p className="mt-4 font-text text-lg leading-normal text-[#4B4B4B]">
                      {card.description}
                    </p>
                  </article>
                ))}
              </div>
            </div>
          </div>
        </section>

        <CTASection />
      </section>
  );
}