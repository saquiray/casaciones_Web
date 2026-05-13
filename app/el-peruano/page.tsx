'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import FiltrosBar from '@/components/FiltrosBar'
import UserMenu from '@/components/UserMenu'
import ModalUpgrade from '@/components/ModalUpgrade'
import ModalDetalle from '@/components/ModalDetalle'
import { useAuth } from '@/components/AuthProvider'
import { FiltrosState } from '@/lib/types'
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

  highlight?: {
    contenido?: string[]
  }
}

interface ApiBusquedaResponse {
  total: number
  results: ResultadoBusqueda[]
}

const AUTH_REQUIRED =
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

export default function ElPeruanoPage() {
  const { user, loading: authLoading } = useAuth()

  const [filtros, setFiltros] = useState<FiltrosState>({
    busqueda: '',
    tipo: '',
    anio: new Date().getFullYear().toString(),
    mes: '',
    fechaDesde: '',
    fechaHasta: '',
  })

  const [resultados, setResultados] = useState<
    ResultadoBusqueda[]
  >([])

  const [total, setTotal] = useState(0)

  const [cargando, setCargando] = useState(false)

  const [showUpgradeModal, setShowUpgradeModal] =
    useState(false)

  const [casacionSeleccionada, setCasacionSeleccionada] =
    useState<number | null>(null)

  const cargarResultados = useCallback(async () => {
    if (AUTH_REQUIRED && !user) return

    setCargando(true)

    try {
      const params = new URLSearchParams()

      if (filtros.busqueda?.trim()) {
        params.set('q', filtros.busqueda)
      }

      if (filtros.mes) {
        params.set('month', filtros.mes)
      }

      if (filtros.anio) {
        params.set('year', filtros.anio)
      }

      const response = await fetch(
        `http://143.244.163.112:3000/search/casaciones_nuevo?${params.toString()}`
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
  }, [filtros, user])

  useEffect(() => {
    if (AUTH_REQUIRED) {
      if (!authLoading && user) {
        cargarResultados()
      }
    } else {
      cargarResultados()
    }
  }, [authLoading, user, cargarResultados])

  const handleBuscar = () => {
    cargarResultados()
  }

  const busquedaLimpia = filtros.busqueda
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
                Buscador de Casaciones
              </h1>

              <p className="text-sm text-slate-400">
                OpenSearch + PDFs indexados
              </p>
            </div>
          </div>

          {AUTH_REQUIRED && <UserMenu />}
        </div>
      </header>

      {/* MAIN */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* FILTROS */}
        <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-5 mb-6">
          <FiltrosBar
            filtros={filtros}
            onChange={setFiltros}
            onBuscar={handleBuscar}
          />
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

          {filtros.busqueda && (
            <div className="text-xs text-slate-500">
              búsqueda:{' '}
              <span className="text-amber-400">
                {filtros.busqueda}
              </span>
            </div>
          )}
        </div>

        {/* RESULTADOS */}
        <div className="space-y-5">

          {resultados.map((resultado, index) => {

            const pdfViewerUrl =
              `http://143.244.163.112:3000/pdfjs/web/viewer.html?file=` +
              encodeURIComponent(
                `http://143.244.163.112:3000${resultado.url_pdf}`
              ) +
              `#page=${resultado.pagina}&search=${search}`

            return (
              <div
                key={`${resultado.id}-${resultado.chunk}-${index}`}
                className="bg-slate-800/40 border border-slate-700/40 rounded-2xl overflow-hidden shadow-lg"
              >

                {/* TOP */}
                <div className="p-5 border-b border-slate-700/30">

                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-5">

                    <div className="flex-1">

                      <h2 className="text-white font-bold text-lg break-all">
                        {resultado.titulo}
                      </h2>

                      <div className="flex flex-wrap gap-3 mt-3 text-xs">

                        <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300">
                          📄 Página {resultado.pagina}
                        </span>

                        <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300">
                          🧩 Chunk {resultado.chunk}
                        </span>

                        <span className="px-2 py-1 rounded-lg bg-slate-700/50 text-slate-300">
                          📅 {resultado.mes} {resultado.anio}
                        </span>

                        <span className="px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 font-semibold">
                          ⭐ {resultado.score?.toFixed(2)}
                        </span>

                      </div>
                    </div>

                    {/* BOTONES */}
                    <div className="flex items-center gap-3">

                      {/* VER PDF */}
                      <a
                        href={pdfViewerUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-blue-500/10 border border-blue-500/30 text-blue-400 hover:bg-blue-500/20 transition"
                      >
                        Ver PDF
                      </a>

                      {/* DESCARGAR */}
                      <a
                        href={`http://143.244.163.112:3000${resultado.url_pdf}`}
                        download
                        className="px-4 py-2 rounded-xl text-sm font-medium bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 hover:bg-emerald-500/20 transition"
                      >
                        Descargar
                      </a>

                    </div>

                  </div>
                </div>

                {/* HIGHLIGHTS */}
                <div className="p-5 space-y-4">

                  {resultado.highlight?.contenido?.length ? (

                    resultado.highlight.contenido.map(
                      (texto, idx) => (

                        <div
                          key={idx}
                          className="bg-slate-900/40 border border-slate-700/30 rounded-xl p-4 text-sm leading-7 text-slate-300"

                          dangerouslySetInnerHTML={{
                            __html: texto,
                          }}
                        />

                      )
                    )

                  ) : (

                    <div className="text-slate-500 text-sm">
                      Sin preview disponible
                    </div>

                  )}

                </div>

              </div>
            )
          })}
        </div>

        {/* VACIO */}
        {!cargando && resultados.length === 0 && (
          <div className="text-center py-20">

            <div className="text-slate-500 text-lg">
              No se encontraron resultados
            </div>

            <p className="text-slate-600 text-sm mt-2">
              Intenta con otra búsqueda o cambia los filtros
            </p>

          </div>
        )}

      </main>

      {/* MODALS */}
      <ModalDetalle
        casacionId={casacionSeleccionada}
        onCerrar={() => setCasacionSeleccionada(null)}
      />

      <ModalUpgrade
        isOpen={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        consultasUsadas={0}
        consultasMax={10}
      />
    </div>
  )
}