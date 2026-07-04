"use client";
import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const [darkMode, setDarkMode] = useState(true);
  const route = useRouter()
  return (
    <main
      className={`relative min-h-screen overflow-hidden transition-colors duration-500 ${darkMode
        ? "bg-[#090909] text-white"
        : "bg-white text-slate-900"
        }`}
    >      {/* Líneas verticales */}


      {/* Glow central */}
      <div className="absolute left-1/2 top-[55%] -translate-x-1/2 -translate-y-1/2">
        <div className="w-[700px] h-[700px] rounded-full bg-slate-900/40 blur-3xl" />
      </div>

      <div className="relative z-10">
        <div>
          <div className="absolute inset-0 flex justify-between px-10 opacity-30 pointer-events-none">
            {[...Array(10)].map((_, i) => (
              <div
                key={i}
                className={`h-full w-px ${darkMode
                  ? "bg-gradient-to-b from-transparent via-slate-500 to-transparent"
                  : "bg-gradient-to-b from-transparent via-slate-300 to-transparent"
                  }`}
              />
            ))}
          </div>
          {/* Navbar */}
          <header className="px-8 py-6">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              {/* Logo */}
              <Link href="/">
                <Image
                  src="/logo1.svg"
                  alt="Logo"
                  width={48}
                  height={48}
                  className="rounded-full"
                />
              </Link>


              {/* Menu */}
              <nav className="hidden md:flex items-center gap-12 text-sm text-slate-300">
                <Link
                  href="/poder-judicial"
                  className="hover:text-white transition"
                >
                  Recursos
                </Link>
                <Link
                  href="/poder-judicial"
                  className="hover:text-white transition"
                >
                  Pricing
                </Link><Link
                  href="/poder-judicial"
                  className="hover:text-white transition"
                >
                  Poder Judicial
                </Link>
                <Link
                  href="/tribunal-constitucional"
                  className="hover:text-white transition"
                >
                  Tribunal Constitucional
                </Link>
              </nav>

              {/* CTA */}
              <div className="flex items-center gap-4">
                <button
                  onClick={() => setDarkMode(!darkMode)}
                  className={`px-4 py-3 rounded-full border transition ${darkMode
                    ? "border-slate-700 bg-slate-900"
                    : "border-slate-300 bg-white"
                    }`}
                >
                  {darkMode ? "☀️" : "🌙"}
                </button>

                <button className="bg-yellow-400 text-black font-medium px-8 py-3 rounded-full hover:bg-yellow-300 transition" onClick={() => route.push("/login")}>
                  Comencemos
                </button>
              </div>
            </div>
          </header>

          {/* Hero */}
          <section className="animate-fade-up relative flex flex-col items-center justify-center min-h-[80vh] text-center px-6">
            <p className="text-sm uppercase tracking-[0.3em] text-slate-500 mb-6">
              Jurisprudencia Peruana
            </p>

            <h1
              className={`max-w-4xl text-5xl md:text-7xl font-light leading-tight ${darkMode ? "text-white" : "text-slate-900"
                }`}
            >            Toda la información en
              <br />
              un solo lugar
            </h1>

            <p
              className={`mt-6 max-w-xl ${darkMode ? "text-slate-400" : "text-slate-600"
                }`}
            >
              Sentencias, casaciones y jurisprudencia del Poder Judicial y
              Tribunal Constitucional del Perú.
            </p>


            {/* Cards flotantes */}
            <div className="hidden">

              <div className="absolute left-[12%] top-[45%] max-w-[220px] rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur p-4 text-left">
                <p className="text-xs text-slate-300">
                  Casación de fecha 10 de octubre de 2023, interpuesta por el
                  abogado Óscar Acuña Viera.
                </p>
              </div>

              <div className="absolute left-[20%] bottom-[15%] w-20 h-20 rounded-xl border border-slate-700 bg-slate-900/70" />

              <div className="absolute right-[10%] top-[35%] max-w-[230px] rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur p-4 text-left">
                <p className="text-xs text-slate-300">
                  Estos instrumentos internacionales, ello en virtud a los
                  artículos 26 y 27 de la Convención de Viena.
                </p>
              </div>

              <div className="absolute right-[16%] bottom-[22%] max-w-[260px] rounded-2xl border border-slate-700 bg-slate-900/80 backdrop-blur p-4 text-left">
                <p className="text-xs text-slate-300">
                  Principio de legalidad, principio de verdad material y numeral 4
                  del artículo 31 de la Convención de Viena.
                </p>
              </div>

              <div className="absolute right-[12%] top-[58%] w-32 h-16 rounded-xl border border-slate-700 bg-slate-900/70" />
              <div className="absolute left-[12%] top-[55%] w-36 h-16 rounded-xl border border-slate-700 bg-slate-900/70" />
            </div>
          </section>

        </div>
        <section className="relative z-10 py-24 px-6">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-16">
              <h2 className="text-4xl font-light mb-4">
                Fuentes Oficiales
              </h2>

              <p
                className={
                  darkMode
                    ? "text-slate-400"
                    : "text-slate-600"
                }
              >
                Consulta información proveniente de los repositorios oficiales del Estado Peruano.
              </p>
            </div>

            <div className="grid md:grid-cols-2 gap-8">

              {/* Poder Judicial */}
              <Link href="/poder-judicial">
                <div
                  className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${darkMode
                    ? "bg-slate-900/60 border-slate-800 hover:border-yellow-400"
                    : "bg-white border-slate-200 hover:border-yellow-500 shadow-sm"
                    }`}
                >
                  <div className="text-5xl mb-6">⚖️</div>

                  <h3 className="text-2xl font-semibold mb-4">
                    Poder Judicial
                  </h3>

                  <p
                    className={
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-600"
                    }
                  >
                    Casaciones y resoluciones emitidas por las Salas Supremas
                    del Poder Judicial del Perú.
                  </p>

                  <div className="mt-6 text-yellow-400">
                    Explorar →
                  </div>
                </div>
              </Link>

              {/* Tribunal Constitucional */}
              <Link href="/tribunal-constitucional">
                <div
                  className={`group p-8 rounded-3xl border transition-all duration-300 hover:-translate-y-2 ${darkMode
                    ? "bg-slate-900/60 border-slate-800 hover:border-blue-400"
                    : "bg-white border-slate-200 hover:border-blue-500 shadow-sm"
                    }`}
                >
                  <div className="text-5xl mb-6">🏛️</div>

                  <h3 className="text-2xl font-semibold mb-4">
                    Tribunal Constitucional
                  </h3>

                  <p
                    className={
                      darkMode
                        ? "text-slate-400"
                        : "text-slate-600"
                    }
                  >
                    Sentencias, precedentes y resoluciones del Tribunal
                    Constitucional del Perú.
                  </p>

                  <div className="mt-6 text-blue-400">
                    Explorar →
                  </div>
                </div>
              </Link>

            </div>
          </div>
        </section>
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-20">
              <h2 className="text-5xl font-light mb-6">
                Encuentra jurisprudencia en segundos
              </h2>

              <p className="text-slate-400 max-w-2xl mx-auto">
                Centralizamos información de múltiples fuentes oficiales y la
                ponemos a tu disposición mediante una búsqueda rápida y moderna.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="p-8 rounded-3xl border border-slate-800">
                <div className="text-4xl mb-6">📚</div>
                <h3 className="text-2xl mb-4">Repositorio Unificado</h3>
                <p className="text-slate-400">
                  Accede desde un único lugar a resoluciones del Poder Judicial
                  y Tribunal Constitucional.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-800">
                <div className="text-4xl mb-6">🔍</div>
                <h3 className="text-2xl mb-4">Búsqueda Avanzada</h3>
                <p className="text-slate-400">
                  Filtra por materia, fecha, expediente, órgano jurisdiccional
                  o palabras clave.
                </p>
              </div>

              <div className="p-8 rounded-3xl border border-slate-800">
                <div className="text-4xl mb-6">⚡</div>
                <h3 className="text-2xl mb-4">Resultados Instantáneos</h3>
                <p className="text-slate-400">
                  Encuentra resoluciones relevantes en segundos sin navegar
                  múltiples portales.
                </p>
              </div>

            </div>
          </div>
        </section>
        <section className="py-32 px-6">
          <div className="max-w-6xl mx-auto">

            <div className="text-center mb-20">
              <h2 className="text-5xl font-light mb-6">
                Elige la cantidad de análisis que necesitas
              </h2>

              <p className="text-slate-400 max-w-2xl mx-auto">
                Todas las funcionalidades están incluidas. La única diferencia
                entre planes es la cantidad de tokens disponibles para consultas
                .
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">

              <div className="rounded-3xl border border-slate-800 p-8">
                <h3 className="text-2xl mb-4">Básico</h3>

                <div className="text-5xl font-light mb-2">
                  S/19
                </div>

                <div className="text-slate-500 mb-8">
                  por mes
                </div>

                <div className="text-3xl mb-6">
                  500K
                </div>

                <p className="text-slate-400">
                  tokens mensuales
                </p>
              </div>

              <div className="rounded-3xl border border-yellow-500 p-8 relative">
                <span className="absolute top-4 right-4 bg-yellow-400 text-black text-xs px-3 py-1 rounded-full">
                  Popular
                </span>

                <h3 className="text-2xl mb-4">
                  Profesional
                </h3>

                <div className="text-5xl font-light mb-2">
                  S/49
                </div>

                <div className="text-slate-500 mb-8">
                  por mes
                </div>

                <div className="text-3xl mb-6">
                  2M
                </div>

                <p className="text-slate-400">
                  tokens mensuales
                </p>
              </div>

              <div className="rounded-3xl border border-slate-800 p-8">
                <h3 className="text-2xl mb-4">
                  Enterprise
                </h3>

                <div className="text-5xl font-light mb-2">
                  S/99
                </div>

                <div className="text-slate-500 mb-8">
                  por mes
                </div>

                <div className="text-3xl mb-6">
                  10M
                </div>

                <p className="text-slate-400">
                  tokens mensuales
                </p>
              </div>

            </div>

            <p className="text-center text-slate-500 mt-12">
              Todos los planes incluyen acceso completo a las funcionalidades de la plataforma.
            </p>

          </div>
        </section>
      </div>
    </main>
  );
}