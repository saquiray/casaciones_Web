import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-amber-400 to-amber-600 rounded-lg flex items-center justify-center">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 6l3 1m0 0l-3 9a5.002 5.002 0 006.001 0M6 7l3 9M6 7l6-2m6 2l3-1m-3 1l-3 9a5.002 5.002 0 006.001 0M18 7l3 9m-3-9l-6-2m0-2v2m0 16V5m0 16H9m3 0h3" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">Casaciones del Peru</h1>
              <p className="text-xs text-slate-400">Sistema de consulta jurisprudencial</p>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        {/* Hero */}
        <div className="text-center mb-16">
          <h2 className="text-4xl sm:text-5xl font-bold text-white mb-4">
            Consulta de Casaciones
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Accede a la jurisprudencia de las Salas Supremas del Peru.
            Busca, filtra y descarga resoluciones casatorias.
          </p>
        </div>

        {/* Cards */}
        <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {/* Card El Peruano */}
          <Link
            href="/el-peruano"
            className="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-amber-500/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-amber-500/20 to-transparent rounded-2xl" />

            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-amber-400 to-amber-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1m2 13a2 2 0 01-2-2V7m2 13a2 2 0 002-2V9a2 2 0 00-2-2h-2m-4-3H9M7 16h6M7 8h6v4H7V8z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Diario El Peruano
              </h3>

              <p className="text-slate-400 mb-6">
                Casaciones publicadas en el Diario Oficial El Peruano.
                Incluye resoluciones de las Salas Civiles, Laborales y Previsionales.
              </p>

              <div className="flex items-center gap-2 text-amber-400 font-medium">
                <span>Explorar casaciones</span>
                <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                Disponible
              </span>
            </div>
          </Link>

          {/* Card Poder Judicial */}
          <Link
            href="/poder-judicial"
            className="group relative bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 hover:shadow-2xl hover:shadow-blue-500/10"
          >
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-500/20 to-transparent rounded-2xl" />

            <div className="relative">
              <div className="w-14 h-14 bg-gradient-to-br from-blue-400 to-blue-600 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 14v3m4-3v3m4-3v3M3 21h18M3 10h18M3 7l9-4 9 4M4 10h16v11H4V10z" />
                </svg>
              </div>

              <h3 className="text-2xl font-bold text-white mb-3">
                Poder Judicial
              </h3>

              <p className="text-slate-400 mb-6">
                Casaciones del repositorio oficial del Poder Judicial del Peru.
                Base de datos complementaria con resoluciones adicionales.
              </p>

              <div className="flex items-center gap-2 text-blue-400 font-medium">
                <span>Explorar Sentencias</span>
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>

            <div className="absolute bottom-4 right-4">
              <span className="px-3 py-1 bg-green-500/20 text-green-400 text-xs font-medium rounded-full">
                Disponible
              </span>
            </div>
          </Link>
        </div>

        {/* Stats */}
        <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-6 max-w-4xl mx-auto">
          <div className="text-center">
            <div className="text-3xl font-bold text-white">50K+</div>
            <div className="text-sm text-slate-400">Casaciones</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">2013-2026</div>
            <div className="text-sm text-slate-400">Periodo</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">3</div>
            <div className="text-sm text-slate-400">Materias</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-white">PDF</div>
            <div className="text-sm text-slate-400">Descargables</div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-auto">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            Sistema de consulta de jurisprudencia casatoria
          </p>
        </div>
      </footer>
    </div>
  )
}
