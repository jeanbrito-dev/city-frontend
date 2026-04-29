import { Link } from "react-router-dom";
import heroImage from "../assets/hero-desktop.jpeg";
import sectionImageOne from "../assets/hero-mobile.jpeg";
import sectionImageTwo from "../assets/hero-extra.jpeg";

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
            className="absolute inset-0 h-full w-full object-cover"
            style={{ objectPosition: "center 65%" }}
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,rgba(17,35,58,0.08)_0%,rgba(17,35,58,0.20)_100%)]" />
          <div className="absolute right-4 top-12 w-50 text-right">
            <h1 className="font-title text-3xl leading-[0.90] font-semibold tracking-[-0.03em] text-white">
              Juntos por uma
              <span className="block text-tertiary">Caraguatatuba</span>
              melhor
            </h1>
          </div>
        </div>

        <div className="absolute left-0 top-55 w-52.5 rounded-[20px] bg-tertiary/90 px-6 py-5 shadow-[0_10px_24px_rgba(66,55,224,0.20)]">
          <p className="font-title text-[15px] leading-[1.3] tracking-[-0.015em] text-white">
            Reporte ocorrências e acompanhe soluções
          </p>
        </div>
      </div>

      <div className="mt-8 px-8 flex flex-col gap-5">
        <Link
          to="/mapa"
          className="flex min-h-15 items-center justify-center rounded-2xl bg-primary px-6 text-center font-text text-lg font-semibold text-white transition hover:opacity-95"
        >
          Ver mapa
        </Link>
        <Link
          to="/relatar"
          className="flex min-h-15 items-center justify-center rounded-2xl bg-[#D9D9D9] px-6 text-center font-text text-lg font-semibold text-white transition hover:opacity-95"
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
          className="absolute inset-0 h-full w-full object-cover"
        />
        <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(8,11,28,0.80)_0%,rgba(8,11,28,0.50)_38%,rgba(8,11,28,0.10)_100%)]" />

        <div className="relative flex min-h-190 flex-col justify-center items-start px-12">
          <div className="max-w-130 text-left">
            <h1 className="font-title text-[64px] leading-[0.96] font-semibold text-white">
              Juntos por uma
              <span className="block text-tertiary">Caraguatatuba</span>
              melhor
            </h1>
          </div>

          <Link
            to="/mapa"
            className="mt-9 flex min-h-18 w-75 items-center justify-center rounded-xl bg-[#3C6FBD] px-6 text-center font-text text-2xl font-semibold text-white transition hover:opacity-95"
          >
            Ver mapa
          </Link>
        </div>
      </div>
    </div>
  );
}

function MobileCard({ title, description }) {
  return (
    <article className="min-h-50 bg-[#F7F7F7] px-6 pt-18 pb-8 sm:px-8 rounded-[10px] transition-all duration-300 hover:shadow-[0_8px_30px_rgba(66,55,224,0.12)] hover:scale-[1.02] hover:-translate-y-1 cursor-default">
      <h3 className="font-title text-2xl leading-[1.2]">{title}</h3>
      <p className="mt-4 font-text text-base leading-[1.65] text-[#2F2F2F]">
        {description}
      </p>
    </article>
  );
}

function CTASection() {
  return (
    <section className="bg-gradient px-5 py-14 text-center text-white sm:px-8 lg:py-18">
      <div className="mx-auto max-w-160">
        <h2 className="font-title text-[34px] leading-[1.15] font-bold sm:text-[42px] lg:text-5xl">
          Pronto para fazer a diferença?
        </h2>

        <p className="mx-auto mt-5 font-text text-base leading-[1.6] text-[#EAF3FF] sm:text-lg lg:text-xl">
          Cadastre-se gratuitamente e comece a reportar ocorrências na sua
          região
        </p>

        <div className="mx-auto mt-12 flex flex-col items-center gap-4 lg:mt-12">
          <Link
            to="/cadastro"
            className="flex min-h-14.5 w-full max-w-80 items-center justify-center rounded-[14px] border-2 border-[#81E7FF] bg-white px-6 text-center font-text text-lg font-semibold text-primary transition hover:scale-[1.01] lg:w-65"
          >
            Criar conta grátis
          </Link>

          <Link
            to="/relatar"
            className="flex min-h-14.5 w-full max-w-80 items-center justify-center rounded-[14px] border-2 border-white bg-transparent px-6 text-center font-text text-lg font-semibold text-white transition hover:scale-[1.01] lg:w-65"
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
  return (
    <section className="w-full bg-white text-black">
      <MobileHero />
      <DesktopHero />

      <section className="px-8 py-16 sm:px-10 lg:px-14.5 lg:pt-20 lg:pb-30">
        <div className="mb-8 h-[3px] w-36 mx-auto bg-primary lg:hidden" />

        <div className="lg:hidden">
          <div className="text-center">
            <h2 className="font-title text-[28px] leading-[1.1] sm:text-[34px]">
              Como funciona ?
            </h2>
            <p className="mx-auto mt-5 max-w-86.5 font-text text-base leading-[1.65] text-[#606060] sm:text-lg">
              Participe da gestão da nossa cidade de forma simples e
              transparente
            </p>
          </div>
          <div className="mt-12 grid gap-8">
            {mobileCards.map((card) => (
              <MobileCard key={card.title} {...card} />
            ))}
          </div>
        </div>

        <div className="hidden lg:block">
          <div className="mb-10 h-0.75 w-full bg-primary" />

          <div className="mx-auto max-w-275">
            {/* TOPO: TEXTO + IMAGENS */}
            <div className="grid grid-cols-[360px_1fr] gap-10 items-center">
              {/* TEXTO */}
              <div>
                <h2 className="font-title text-[58px] leading-[1.02]">
                  Como Funciona?
                </h2>

                <p className="mt-8.5 font-text text-[28px] leading-[1.45] text-[#5E5E5E]">
                  Participe da gestão da nossa cidade de forma simples e
                  transparente
                </p>

                <Link
                  to="/mapa"
                  className="mt-7 flex min-h-13.5 w-34.5 items-center justify-center rounded-lg bg-primary px-4 text-center font-text text-lg font-semibold text-white transition hover:opacity-95"
                >
                  Ver mapa
                </Link>

                <Link
                  to="/relatar"
                  className="mt-3.5 inline-flex font-text text-lg font-semibold text-primary transition hover:opacity-80"
                >
                  Registrar ocorrência →
                </Link>

                <p className="mt-2.5 font-text text-sm text-[#1f1f1f]">
                  Mapa Interativo
                </p>
              </div>

              {/* IMAGENS */}
              <div className="relative h-72.5">
                <img
                  src={sectionImageOne}
                  alt="Praia"
                  className="absolute right-40 top-0 h-64 w-80 rounded-xl object-cover shadow-[0_6px_20px_rgba(0,0,0,0.10)]"
                />

                <img
                  src={sectionImageTwo}
                  alt="Cidade"
                  className="absolute right-0 top-20 h-72 w-96 rounded-xl object-cover shadow-[0_8px_24px_rgba(0,0,0,0.14)]"
                />
              </div>
            </div>

            {/* CARDS EMBAIXO */}
            <div className="mt-32 grid grid-cols-2 gap-x-8 gap-y-9.5">
              {desktopCards.map((card) => (
                <article
                  key={card.title}
                  className="min-h-47.5 rounded-[10px] bg-[#F7F7F7] px-6.5 py-7 transition-all duration-300 hover:shadow-[0_8px_30px_rgba(66,55,224,0.12)] hover:scale-[1.02] hover:-translate-y-1 cursor-default"
                >
                  <h3 className="font-title text-2xl leading-[1.1]">
                    {card.title}
                  </h3>
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
