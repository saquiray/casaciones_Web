'use client'

interface PaginacionProps {
  paginaActual: number
  totalPaginas: number
  onCambiarPagina: (pagina: number) => void
}

export default function Paginacion({ paginaActual, totalPaginas, onCambiarPagina }: PaginacionProps) {
  if (totalPaginas <= 1) return null

  const generarPaginas = () => {
    const paginas: (number | string)[] = []
    const rango = 2

    paginas.push(1)

    if (paginaActual > rango + 2) {
      paginas.push('...')
    }

    for (let i = Math.max(2, paginaActual - rango); i <= Math.min(totalPaginas - 1, paginaActual + rango); i++) {
      paginas.push(i)
    }

    if (paginaActual < totalPaginas - rango - 1) {
      paginas.push('...')
    }

    if (totalPaginas > 1) {
      paginas.push(totalPaginas)
    }

    return paginas
  }

  return (
    <div className="flex items-center justify-center gap-1.5 mt-6">
      <button
        onClick={() => onCambiarPagina(paginaActual - 1)}
        disabled={paginaActual === 1}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 hover:border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
        </svg>
        Anterior
      </button>

      <div className="flex items-center gap-1">
        {generarPaginas().map((pagina, index) =>
          typeof pagina === 'number' ? (
            <button
              key={index}
              onClick={() => onCambiarPagina(pagina)}
              className={`min-w-[40px] px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                pagina === paginaActual
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25'
                  : 'text-slate-300 bg-slate-800/50 border border-slate-700/50 hover:bg-slate-700/50 hover:border-slate-600/50'
              }`}
            >
              {pagina}
            </button>
          ) : (
            <span key={index} className="px-2 py-2 text-slate-500">
              {pagina}
            </span>
          )
        )}
      </div>

      <button
        onClick={() => onCambiarPagina(paginaActual + 1)}
        disabled={paginaActual === totalPaginas}
        className="flex items-center gap-1 px-3 py-2 text-sm font-medium text-slate-300 bg-slate-800/50 border border-slate-700/50 rounded-lg hover:bg-slate-700/50 hover:border-slate-600/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
      >
        Siguiente
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
        </svg>
      </button>
    </div>
  )
}
