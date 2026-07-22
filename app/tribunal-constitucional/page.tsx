'use client'

import { useState, useEffect, useCallback, useMemo } from 'react'
import Link from 'next/link'

import UserMenu from '@/components/UserMenu'
import ModalUpgrade from '@/components/ModalUpgrade'
import ModalDetalle from '@/components/ModalDetalle'

import { useAuth } from '@/components/AuthProvider'
import { TESAURO_DATA } from '@/lib/tesauroData'

const STOPWORDS = [
  'de',
  'la',
  'el',
  'los',
  'las',
  'y',
  'o',
  'en',
  'del',
  'al',
  'por',
  'para',
  'con',
]

interface ResultadoBusqueda {
  id: string
  score: number
  titulo: string
  fuente: string
  url_pdf: string
  pagina: number
  chunk: number
  mes: string
  anio: string
  nombre_archivo: string
  highlight?: {
    contenido?: string[]
  }
}

interface ApiBusquedaResponse {
  total: number
  results: ResultadoBusqueda[]
}

interface TesaurioNode {
  id: number
  nombre: string
  slug: string
  code: string
  count: number
  children?: TesaurioNode[]
}

const AUTH_REQUIRED =
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

export default function ElPeruanoPage() {
  const { user, loading: authLoading } = useAuth()
  const [buscando, setBuscando] = useState(false);

  const [busqueda, setBusqueda] = useState('')
  const [busquedaDebounced, setBusquedaDebounced] =
    useState('')
  const [mes, setMes] = useState('')
  const [anio, setAnio] = useState(
    new Date().getFullYear().toString()
  )

  const [resultados, setResultados] = useState<
    ResultadoBusqueda[]
  >([])

  const [total, setTotal] = useState(0)

  const [cargando, setCargando] = useState(false)

  const [showUpgradeModal, setShowUpgradeModal] =
    useState(false)

  const [casacionSeleccionada, setCasacionSeleccionada] =
    useState<number | null>(null)

  /**
   * TESAURO
   */

  const [selectedTesaurioPath, setSelectedTesaurioPath] =
    useState<TesaurioNode[]>([])

  const selectedTesaurioSlug = useMemo(() => {
    if (selectedTesaurioPath.length === 0) return ''

    return selectedTesaurioPath[
      selectedTesaurioPath.length - 1
    ].slug
  }, [selectedTesaurioPath])

  const getNodesForLevel = (
    level: number
  ): TesaurioNode[] => {
    if (level === 0) {
      return TESAURO_DATA as TesaurioNode[]
    }

    const parent = selectedTesaurioPath[level - 1]

    if (!parent?.children?.length) {
      return []
    }

    return parent.children
  }

  const handleSelectTesaurioLevel = (
    level: number,
    slug: string
  ) => {
    if (!slug) {
      setSelectedTesaurioPath(prev =>
        prev.slice(0, level)
      )

      return
    }

    const nodes = getNodesForLevel(level)

    const selectedNode = nodes.find(
      node => node.slug === slug
    )

    if (!selectedNode) return

    setSelectedTesaurioPath(prev => {
      const newPath = prev.slice(0, level)

      newPath[level] = selectedNode

      return newPath
    })
  }

  const getSelectedValueForLevel = (
    level: number
  ) => {
    return selectedTesaurioPath[level]?.slug || ''
  }

  const getTesaurioLevelsToRender = () => {
    const levels: number[] = [0]

    selectedTesaurioPath.forEach(
      (node, index) => {
        if (node.children?.length) {
          levels.push(index + 1)
        }
      }
    )

    return levels
  }

  const getTesaurioLevelTitle = (
    level: number
  ) => {
    if (level === 0) return 'Materia'

    if (level === 1) return 'Submateria'

    if (level === 2) return 'Tema'

    if (level === 3) return 'Subtema'

    return `Nivel ${level + 1}`
  }

  /**
   * BUSQUEDA
   */
  useEffect(() => {
    const timeout = setTimeout(() => {
      setBusquedaDebounced(busqueda)
    }, 500)

    return () => clearTimeout(timeout)
  }, [busqueda])
  const cargarResultados = useCallback(async () => {
    if (AUTH_REQUIRED && !user) return

    setCargando(true)

    try {
      const params = new URLSearchParams()

      if (busquedaDebounced?.trim()) {
        params.set('q', busquedaDebounced)
      }

      if (selectedTesaurioSlug) {
        params.set(
          'tesaurio_slug',
          selectedTesaurioSlug
        )
      }

      const response = await fetch(
        `/api/proxy/search/sentencias_nuevo?${params.toString()}`
      )

      const data: ApiBusquedaResponse =
        await response.json()

      setResultados(data.results || [])
      setTotal(data.total || 0)
    } catch (error) {
      console.error('Error buscando:', error)

      setResultados([])
      setTotal(0)
    } finally {
      setCargando(false)
    }
  }, [
    busquedaDebounced,
    mes,
    anio,
    selectedTesaurioSlug,
    user,
  ])


  const gastarCredito = async () => {
    if (!AUTH_REQUIRED || !user) return

    try {
      const response = await fetch('/api/creditos/gastar', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        const error = await response.json()

        if (response.status === 402) {
          // Sin créditos
          setShowUpgradeModal(true)
          throw new Error('No tienes créditos disponibles')
        }

        throw new Error(error.error || 'Error consumiendo crédito')
      }

      const data = await response.json()
      console.log('Crédito consumido:', data)
    } catch (error) {
      console.error(error)
      throw error
    }
  }
  const handleBuscar = async () => {
    if (buscando) return

    setBuscando(true)

    try {
      await gastarCredito()
      await cargarResultados()
    } catch (error) {
      console.error(error)
    } finally {
      setBuscando(false)
    }
  }

  const busquedaLimpia = busquedaDebounced
    .split(' ')
    .filter(
      palabra =>
        !STOPWORDS.includes(
          palabra.toLowerCase()
        )
    )
    .join(' ')

  const search = encodeURIComponent(
    `"${busquedaLimpia}"`
  )

  if (AUTH_REQUIRED && authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
      </div>
    )
  }

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
                Buscador de Sentencias
              </h1>

              <p className="text-sm text-slate-400">
                OpenSearch + PDFs indexados
              </p>
            </div>
          </div>
          <nav className="hidden md:flex items-center gap-12 text-sm text-slate-300">
            <Link
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
          {AUTH_REQUIRED && <UserMenu />}
        </div>
      </header>

      {/* MAIN */}

      <main className="max-w-7xl mx-auto px-4 py-6">
        {/* FILTROS */}

        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 mb-6">
          {/* BUSQUEDA */}

          <div className="mb-5">
            <input
              type="text"
              value={busqueda}
              onChange={e =>
                setBusqueda(e.target.value)
              }
              placeholder="Buscar casaciones..."
              className="w-full px-4 py-3 rounded-xl bg-slate-900 border border-slate-700 text-white outline-none"
            />
          </div>

          {/* TESAURO */}

          <div className="space-y-5">
            {getTesaurioLevelsToRender().map(
              level => {
                const nodes =
                  getNodesForLevel(level)

                if (!nodes.length) return null

                return (
                  <div
                    key={`tesaurio-level-${level}`}
                  >
                    <h3 className="text-sm font-semibold text-slate-300 mb-3">
                      {getTesaurioLevelTitle(
                        level
                      )}
                    </h3>

                    <div className="flex flex-wrap gap-2">
                      {nodes.map(node => {
                        const active =
                          getSelectedValueForLevel(
                            level
                          ) === node.slug

                        return (
                          <button
                            key={node.slug}
                            onClick={() =>
                              handleSelectTesaurioLevel(
                                level,
                                node.slug
                              )
                            }
                            className={`
                            px-3 py-2 rounded-xl text-sm transition
                            ${active
                                ? 'bg-amber-500 text-black font-semibold'
                                : 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                              }
                          `}
                          >
                            {node.nombre} (
                            {node.count})
                          </button>
                        )
                      })}
                    </div>
                  </div>
                )
              }
            )}
          </div>

          {/* BOTONES */}

          <div className="flex gap-3 mt-6">
            <button
              onClick={handleBuscar}
              className="px-5 py-3 rounded-xl bg-amber-500 text-black font-semibold hover:bg-amber-400 transition"
            >
              Buscar
            </button>

            <button
              onClick={() => {
                setBusqueda('')
                setSelectedTesaurioPath([])
              }}
              className="px-5 py-3 rounded-xl bg-slate-700 text-white hover:bg-slate-600 transition"
            >
              Limpiar
            </button>
          </div>
        </div>

        {/* INFO */}

        <div className="flex items-center justify-between mb-6">
          <div className="text-sm text-slate-400">
            {cargando ? (
              <span className="flex items-center gap-2">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-amber-500/30 border-t-amber-500"></div>

                Buscando...
              </span>
            ) : (
              <>
                <span className="text-white font-semibold">
                  {total}
                </span>{' '}
                resultados encontrados
              </>
            )}
          </div>
        </div>

        {/* RESULTADOS */}

        <div className="space-y-5">
          {resultados.map(
            (resultado, index) => {
              const pdfViewerUrl =
                `/api/proxy/pdfjs/web/viewer.html?file=` +
                encodeURIComponent(
                  `/api/proxy/pdf/TC/${resultado.nombre_archivo}`
                ) +
                `#page=${resultado.pagina}&search=${busqueda}`

              return (
                <div
                  key={`${resultado.id}-${resultado.chunk}-${index}`}
                  className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden shadow-lg hover:border-amber-500/20 transition"
                >
                  {/* HEADER */}

                  <div className="p-5 border-b border-slate-700/30">
                    <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                      {/* INFO */}
                      <div className="flex-1 min-w-0">

                        {/* TITULO */}
                        <h2 className="text-white font-bold text-lg leading-7 break-words">
                          {resultado.titulo}
                        </h2>

                        {/* META */}
                        <div className="flex flex-wrap gap-2 mt-4">

                          <span className="px-3 py-1 rounded-xl bg-slate-700/40 text-slate-300 text-xs">
                            📄 Página {resultado.pagina}
                          </span>

                          <span className="px-3 py-1 rounded-xl bg-slate-700/40 text-slate-300 text-xs">
                            🧩 Chunk {resultado.chunk}
                          </span>

                          <span className="px-3 py-1 rounded-xl bg-slate-700/40 text-slate-300 text-xs">
                            📅 {resultado.mes} {resultado.anio}
                          </span>

                          <span className="px-3 py-1 rounded-xl bg-slate-700/40 text-slate-300 text-xs">
                            🏛️ {resultado.fuente}
                          </span>

                          <span className="px-3 py-1 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                            ⭐ {resultado.score?.toFixed(2)}
                          </span>

                        </div>

                        {/* RESUMEN */}
                        <div className="mt-5">
                          {resultado.highlight?.contenido?.[0] ? (
                            <div
                              className="text-sm leading-7 text-slate-300 bg-slate-900/30 border border-slate-700/20 rounded-xl p-4"

                              dangerouslySetInnerHTML={{
                                __html:
                                  resultado.highlight
                                    .contenido[0],
                              }}
                            />
                          ) : (
                            <div className="text-slate-500 text-sm">
                              Sin preview disponible
                            </div>
                          )}
                        </div>

                      </div>

                      {/* BOTONES */}
                      <div className="flex lg:flex-col gap-3 shrink-0">

                        <a
                          href={pdfViewerUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-3 rounded-xl text-sm font-medium bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition text-center"
                        >
                          Ver PDF
                        </a>

                        <a
                          href={`/api/proxy${resultado.url_pdf}`}
                          download
                          className="px-4 py-3 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition text-center"
                        >
                          Descargar
                        </a>

                      </div>

                    </div>
                  </div>

                  {/* HIGHLIGHTS EXTRA */}

                  {resultado.highlight?.contenido &&
                    resultado.highlight.contenido.length >
                    1 && (
                      <div className="px-5 pb-5 space-y-3">

                        {resultado.highlight.contenido
                          .slice(1)
                          .map((texto, idx) => (
                            <div
                              key={idx}
                              className="bg-slate-900/20 border border-slate-700/20 rounded-xl p-4 text-sm leading-7 text-slate-400"

                              dangerouslySetInnerHTML={{
                                __html: texto,
                              }}
                            />
                          ))}

                      </div>
                    )}

                </div>
              )
            }
          )}
        </div>

        {/* VACIO */}

        {!cargando &&
          resultados.length === 0 && (
            <div className="text-center py-20">
              <div className="text-slate-500 text-lg">
                No se encontraron resultados
              </div>

              <p className="text-slate-600 text-sm mt-2">
                Intenta con otra búsqueda o
                cambia los filtros
              </p>
            </div>
          )}
      </main>

      {/* MODALS */}

      <ModalDetalle
        casacionId={casacionSeleccionada}
        onCerrar={() =>
          setCasacionSeleccionada(null)
        }
      />

      <ModalUpgrade
        isOpen={showUpgradeModal}
        onClose={() =>
          setShowUpgradeModal(false)
        }
        consultasUsadas={0}
        consultasMax={10}
      />
    </div>
  )
}