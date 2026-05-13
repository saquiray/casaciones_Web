'use client'

import { useState, useEffect, useCallback } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import FiltrosBar from '@/components/FiltrosBar'
import TablaCasaciones from '@/components/TablaCasaciones'
import Paginacion from '@/components/Paginacion'
import ModalDetalle from '@/components/ModalDetalle'
import ModalUpgrade from '@/components/ModalUpgrade'
import UserMenu from '@/components/UserMenu'
import { useAuth } from '@/components/AuthProvider'
import { FiltrosState } from '@/lib/types'

// 🔥 NUEVO
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
  snippet?: string
  highlight?: {
    contenido?: string[]
  }
}

interface ApiBusquedaResponse {
  total: number
  results: ResultadoBusqueda[]
}

const AUTH_REQUIRED = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

export default function ElPeruanoPage() {
  const router = useRouter()
  const { user, loading: authLoading } = useAuth()

  const [filtros, setFiltros] = useState<FiltrosState>({
    busqueda: '',
    tipo: '',
    anio: new Date().getFullYear().toString(),
    mes: '',
    fechaDesde: '',
    fechaHasta: '',
  })

  // 🔥 NUEVO
  const [resultados, setResultados] = useState<ResultadoBusqueda[]>([])

  const [total, setTotal] = useState(0)
  const [pagina, setPagina] = useState(1)
  const [totalPaginas, setTotalPaginas] = useState(1)
  const [cargando, setCargando] = useState(false)

  const [casacionSeleccionada, setCasacionSeleccionada] = useState<number | null>(null)

  const [showUpgradeModal, setShowUpgradeModal] = useState(false)

  const cargarResultados = useCallback(async () => {
    if (AUTH_REQUIRED && !user) return

    setCargando(true)

    try {
      const params = new URLSearchParams()

      if (filtros.busqueda) {
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

      const data: ApiBusquedaResponse = await response.json()

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

  if (AUTH_REQUIRED && authLoading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
      </div>
    )
  }

  if (AUTH_REQUIRED && !user) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-white text-2xl font-bold mb-4">
            Acceso requerido
          </h2>

          <Link
            href="/auth/login"
            className="px-5 py-3 bg-amber-500 rounded-lg text-black font-semibold"
          >
            Iniciar sesión
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* HEADER */}
      <header className="bg-slate-900/50 border-b border-slate-700/50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-slate-400 hover:text-white"
            >
              ←
            </Link>

            <div>
              <h1 className="text-xl font-bold text-white">
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

      {/* CONTENIDO */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* FILTROS */}
        <FiltrosBar
          filtros={filtros}
          onChange={setFiltros}
          onBuscar={handleBuscar}
        />

        {/* STATS */}
        <div className="mb-5 text-sm text-slate-400">
          {cargando ? (
            <span>Buscando...</span>
          ) : (
            <span>
              <span className="text-white font-semibold">
                {total}
              </span>{' '}
              resultados encontrados
            </span>
          )}
        </div>

        {/* RESULTADOS */}
        <div className="space-y-4">
          {resultados.map((resultado) => (
            <div
              key={`${resultado.id}-${resultado.pagina}-${resultado.chunk}`}
              className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-5"
            >
              {/* TOP */}
              <div className="flex items-start justify-between gap-4">
                <div>
                  <h2 className="text-white font-semibold text-lg">
                    {resultado.titulo}
                  </h2>

                  <div className="flex gap-4 mt-2 text-sm text-slate-400">
                    <span>
                      📄 Página {resultado.pagina}
                    </span>

                    <span>
                      🧩 Chunk {resultado.chunk}
                    </span>

                    <span>
                      📅 {resultado.mes} {resultado.anio}
                    </span>

                    <span>
                      ⭐ {resultado.score?.toFixed(2)}
                    </span>
                  </div>
                </div>

                {/* PDF */}
                <a
                  href={`http://143.244.163.112:3000${resultado.url_pdf}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2 bg-blue-500/20 border border-blue-500/30 rounded-lg text-blue-400 hover:bg-blue-500/30 transition"
                >
                  Ver PDF
                </a>
              </div>

              {/* HIGHLIGHT */}
              <div className="mt-4 space-y-3">
                {resultado.highlight?.contenido?.map((texto, index) => (
                  <div
                    key={index}
                    className="text-sm text-slate-300 leading-7 bg-slate-900/40 rounded-lg p-4"
                    dangerouslySetInnerHTML={{
                      __html: texto,
                    }}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>

        {!cargando && resultados.length === 0 && (
          <div className="text-center py-20 text-slate-500">
            No se encontraron resultados
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