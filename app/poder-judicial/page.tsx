'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import UserMenu from '@/components/UserMenu'
import ModalUpgrade from '@/components/ModalUpgrade'
import Paginacion from '@/components/Paginacion'
import { useAuth } from '@/components/AuthProvider'
import { usePoderJudicialSearch } from '@/src/hooks/usePoderJudicialSearch'

const AUTH_REQUIRED =
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

const TIPOS_PROCESO = [
  { value: 0, label: 'Cualquiera' },
  { value: 1, label: 'Acción de Amparo' },
  { value: 2, label: 'Acción de Cumplimiento' },
  { value: 3, label: 'Acción de Inconstitucionalidad' },
  { value: 4, label: 'Conflicto de Competencia' },
  { value: 5, label: 'Habeas Corpus' },
  { value: 6, label: 'Habeas Data' },
  { value: 7, label: 'Queja' },
]

const FILTROS_BUSQUEDA = [
  { value: 'S', label: 'Contenga solamente estas palabras' },
  { value: 'A', label: 'Contenga alguna de estas palabras' },
  { value: 'F', label: 'Contenga la frase completa' },
]

const YEARS = Array.from({ length: new Date().getFullYear() - 1989 }, (_, i) => {
  const year = new Date().getFullYear() - i
  return year.toString()
})

export default function ElPeruanoPage() {
  const { user, loading: authLoading } = useAuth()
  const { params, results, pagination, loading, error, search } = usePoderJudicialSearch()

  const [filtro, setFiltro] = useState<'S' | 'A' | 'F'>('S')
  const [searchTerm, setSearchTerm] = useState('')
  const [demandante, setDemandante] = useState('')
  const [demandado, setDemandado] = useState('')
  const [numexpediente, setNumexpediente] = useState('')
  const [anoingreso, setAnoingreso] = useState('')
  const [idtipoproceso, setIdtipoproceso] = useState(0)
  const [anopublica, setAnopublica] = useState('')
  const [showAdvanced, setShowAdvanced] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  useEffect(() => {
    const initSearch = () => {
      search({
        filtro,
        search: searchTerm,
        demandante,
        demandado,
        numexpediente,
        anoingreso,
        idtipoproceso,
        anopublica,
        pg: 1,
      })
    }

    if (AUTH_REQUIRED) {
      if (!authLoading && user) {
        initSearch()
      }
    } else {
      initSearch()
    }
  }, [authLoading, user])

  const handleBuscar = (e?: React.FormEvent) => {
    if (e) e.preventDefault()
    search({
      filtro,
      search: searchTerm,
      demandante,
      demandado,
      numexpediente,
      anoingreso,
      idtipoproceso,
      anopublica,
      pg: 1,
    })
  }

  const handleCambiarPagina = (nuevaPagina: number) => {
    search({
      ...params,
      pg: nuevaPagina,
    })
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleLimpiar = () => {
    setFiltro('S')
    setSearchTerm('')
    setDemandante('')
    setDemandado('')
    setNumexpediente('')
    setAnoingreso('')
    setIdtipoproceso(0)
    setAnopublica('')
    search({
      filtro: 'S',
      search: '',
      demandante: '',
      demandado: '',
      numexpediente: '',
      anoingreso: '',
      idtipoproceso: 0,
      anopublica: '',
      pg: 1,
    })
  }

  if (AUTH_REQUIRED && authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
      </div>
    )
  }

  const inputClass =
    'w-full px-3 py-2 text-sm bg-slate-900 border border-slate-700/60 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all'
  const labelClass = 'block text-xs font-semibold text-slate-400 mb-1.5'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* HEADER */}
      <header className="sticky top-0 z-40 backdrop-blur-md bg-slate-900/70 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-400 hover:text-white transition"
            >
              ← Volver
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">
                Tribunal Constitucional
              </h1>
              <p className="text-sm text-slate-400">
                Buscador de resoluciones y sentencias
              </p>
            </div>
          </div>
          {AUTH_REQUIRED && <UserMenu />}
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* FORMULARIO DE BUSQUEDA */}
        <form
          onSubmit={handleBuscar}
          className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-2xl p-5 mb-6 shadow-xl"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {/* Busqueda */}
            <div className="md:col-span-2">
              <label htmlFor="search" className={labelClass}>
                Búsqueda (palabras clave)
              </label>
              <input
                id="search"
                type="text"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                placeholder="Ej. terrorismo, indemnización, etc."
                className={inputClass}
              />
            </div>

            {/* Filtro palabras */}
            <div>
              <label htmlFor="filtro" className={labelClass}>
                Modo de búsqueda
              </label>
              <select
                id="filtro"
                value={filtro}
                onChange={e => setFiltro(e.target.value as 'S' | 'A' | 'F')}
                className={`${inputClass} cursor-pointer`}
              >
                {FILTROS_BUSQUEDA.map(opt => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-slate-800 text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Tipo proceso */}
            <div>
              <label htmlFor="idtipoproceso" className={labelClass}>
                Tipo de proceso
              </label>
              <select
                id="idtipoproceso"
                value={idtipoproceso}
                onChange={e => setIdtipoproceso(Number(e.target.value))}
                className={`${inputClass} cursor-pointer`}
              >
                {TIPOS_PROCESO.map(opt => (
                  <option
                    key={opt.value}
                    value={opt.value}
                    className="bg-slate-800 text-white"
                  >
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* ADVANCED TOGGLE */}
          <div className="mt-4 flex items-center justify-between border-t border-slate-700/30 pt-4">
            <button
              type="button"
              onClick={() => setShowAdvanced(!showAdvanced)}
              className="flex items-center gap-1.5 text-xs text-amber-500 hover:text-amber-400 font-medium transition-colors cursor-pointer"
            >
              {showAdvanced
                ? 'Ocultar Filtros Avanzados'
                : 'Mostrar Filtros Avanzados'}
              <svg
                className={`w-3.5 h-3.5 transition-transform duration-200 ${
                  showAdvanced ? 'rotate-180' : ''
                }`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2.5}
                  d="M19 9l-7 7-7-7"
                />
              </svg>
            </button>

            <div className="flex gap-2">
              <button
                type="button"
                onClick={handleLimpiar}
                className="px-4 py-2 text-xs font-semibold bg-slate-700/50 hover:bg-slate-700 text-slate-300 rounded-xl transition-all cursor-pointer"
              >
                Limpiar
              </button>
              <button
                type="submit"
                className="px-5 py-2 text-xs font-semibold bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black rounded-xl shadow-md shadow-amber-500/10 transition-all cursor-pointer"
              >
                Buscar
              </button>
            </div>
          </div>

          {/* ADVANCED FIELDS */}
          {showAdvanced && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4 mt-4 pt-4 border-t border-slate-700/30 animate-fadeIn">
              <div>
                <label htmlFor="numexpediente" className={labelClass}>
                  Nro. Expediente
                </label>
                <input
                  id="numexpediente"
                  type="text"
                  value={numexpediente}
                  onChange={e => setNumexpediente(e.target.value)}
                  placeholder="Ej. 02043-2012"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="anoingreso" className={labelClass}>
                  Año de Ingreso
                </label>
                <select
                  id="anoingreso"
                  value={anoingreso}
                  onChange={e => setAnoingreso(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" className="bg-slate-800 text-slate-400">
                    Cualquiera
                  </option>
                  {YEARS.map(y => (
                    <option
                      key={y}
                      value={y}
                      className="bg-slate-800 text-white"
                    >
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="anopublica" className={labelClass}>
                  Año de Publicación
                </label>
                <select
                  id="anopublica"
                  value={anopublica}
                  onChange={e => setAnopublica(e.target.value)}
                  className={`${inputClass} cursor-pointer`}
                >
                  <option value="" className="bg-slate-800 text-slate-400">
                    Cualquiera
                  </option>
                  {YEARS.map(y => (
                    <option
                      key={y}
                      value={y}
                      className="bg-slate-800 text-white"
                    >
                      {y}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label htmlFor="demandante" className={labelClass}>
                  Demandante
                </label>
                <input
                  id="demandante"
                  type="text"
                  value={demandante}
                  onChange={e => setDemandante(e.target.value)}
                  placeholder="Nombre demandante"
                  className={inputClass}
                />
              </div>

              <div>
                <label htmlFor="demandado" className={labelClass}>
                  Demandado
                </label>
                <input
                  id="demandado"
                  type="text"
                  value={demandado}
                  onChange={e => setDemandado(e.target.value)}
                  placeholder="Nombre demandado"
                  className={inputClass}
                />
              </div>
            </div>
          )}
        </form>

        {/* INFO Y RESULTADOS */}
        <div className="flex items-center justify-between mb-4">
          <div className="text-sm text-slate-400">
            {loading ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500/30 border-t-amber-500"></div>
                Buscando resoluciones...
              </span>
            ) : (
              <>
                <span className="text-white font-semibold">
                  {results.length > 0 ? results.length : 0}
                </span>{' '}
                resultados en esta página
              </>
            )}
          </div>

          {params.search && (
            <div className="text-xs text-slate-500">
              Filtro activo:{' '}
              <span className="text-amber-400">
                &ldquo;{params.search}&rdquo;
              </span>
            </div>
          )}
        </div>

        {/* ERROR STATE */}
        {error && (
          <div className="bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-xl mb-6 text-sm">
            ⚠️ {error}
          </div>
        )}

        {/* LOADING STATE / SKELETON */}
        {loading && (
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div
                key={i}
                className="animate-pulse bg-slate-800/40 border border-slate-700/40 rounded-2xl p-5 space-y-4"
              >
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-2 flex-1">
                    <div className="h-6 bg-slate-700 rounded w-2/3"></div>
                    <div className="flex gap-2">
                      <div className="h-4 bg-slate-700 rounded w-20"></div>
                      <div className="h-4 bg-slate-700 rounded w-20"></div>
                    </div>
                  </div>
                  <div className="h-10 bg-slate-700 rounded w-28"></div>
                </div>
                <div className="space-y-2">
                  <div className="h-4 bg-slate-700 rounded w-full"></div>
                  <div className="h-4 bg-slate-700 rounded w-5/6"></div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* RESULTADOS LISTADO */}
        {!loading && results.length > 0 && (
          <div className="space-y-5">
            {results.map((resultado, index) => {
              return (
                <div
                  key={`${resultado.expediente}-${index}`}
                  className="bg-slate-800/30 border border-slate-700/40 rounded-2xl overflow-hidden shadow-lg hover:border-slate-700 transition"
                >
                  <div className="p-5 border-b border-slate-700/30">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">
                      <div className="flex-1 min-w-0">
                        {/* TITULO */}
                        <h2 className="text-white font-bold text-lg leading-7 break-words">
                          {resultado.titulo}
                        </h2>

                        {/* BADGES */}
                        <div className="flex flex-wrap gap-2 mt-3">
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-700/40 border border-slate-600/30 text-slate-300 text-xs">
                            📂 {resultado.expediente}
                          </span>
                          <span className="px-2.5 py-0.5 rounded-lg bg-slate-700/40 border border-slate-600/30 text-slate-300 text-xs">
                            ⚖️ {resultado.tipoResolucion}
                          </span>
                          {resultado.fechaPublicacion && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-700/40 border border-slate-600/30 text-slate-300 text-xs">
                              📅 Pub: {resultado.fechaPublicacion}
                            </span>
                          )}
                          {resultado.fechaIngreso && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-slate-700/40 border border-slate-600/30 text-slate-300 text-xs">
                              📅 Ing: {resultado.fechaIngreso}
                            </span>
                          )}
                          {resultado.score > 0 && (
                            <span className="px-2.5 py-0.5 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                              ⭐ Score: {resultado.score.toFixed(2)}
                            </span>
                          )}
                        </div>

                        {/* PARTES */}
                        <div className="mt-3 grid grid-cols-1 md:grid-cols-2 gap-2 text-xs text-slate-300">
                          {resultado.demandante && (
                            <div>
                              <span className="font-semibold text-slate-400">
                                Demandante:
                              </span>{' '}
                              {resultado.demandante}
                            </div>
                          )}
                          {resultado.demandado && (
                            <div>
                              <span className="font-semibold text-slate-400">
                                Demandado:
                              </span>{' '}
                              {resultado.demandado}
                            </div>
                          )}
                        </div>
                      </div>

                      {/* BOTONES */}
                      <div className="flex lg:flex-col gap-2 shrink-0">
                        {resultado.pdfUrl ? (
                          <>
                            <a
                              href={resultado.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 text-center transition cursor-pointer"
                            >
                              Ver PDF
                            </a>
                            <a
                              href={resultado.pdfUrl}
                              download
                              target="_blank"
                              rel="noopener noreferrer"
                              className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 text-center transition cursor-pointer"
                            >
                              Descargar
                            </a>
                          </>
                        ) : (
                          <span className="px-4 py-2.5 rounded-xl text-xs font-semibold bg-slate-800 border border-slate-700 text-slate-500 text-center">
                            PDF No Disponible
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* RESUMEN / HIGHLIGHT */}
                  {resultado.resumen && (
                    <div className="p-5 bg-slate-900/20">
                      <div
                        className="text-sm leading-6 text-slate-300 bg-slate-900/35 border border-slate-700/20 rounded-xl p-4"
                        dangerouslySetInnerHTML={{
                          __html: resultado.resumen,
                        }}
                      />
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* EMPTY STATE */}
        {!loading && results.length === 0 && (
          <div className="text-center py-20 bg-slate-800/20 border border-slate-800/40 rounded-2xl">
            <div className="text-slate-500 text-lg">
              No se encontraron resoluciones
            </div>
            <p className="text-slate-600 text-sm mt-2">
              Prueba modificando los términos de búsqueda o agregando filtros
            </p>
          </div>
        )}

        {/* PAGINACION */}
        {!loading && (
          <Paginacion
            paginaActual={pagination.paginaActual}
            totalPaginas={pagination.totalPaginas}
            onCambiarPagina={handleCambiarPagina}
          />
        )}
      </main>

      {/* MODALS */}
      <ModalUpgrade
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        consultasUsadas={0}
        consultasMax={10}
      />
    </div>
  )
}