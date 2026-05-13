'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase-browser'
import { Suscripcion, Plan } from '@/lib/types'

const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

interface SuscripcionConPlan extends Suscripcion {
  planes: Plan
}

export default function SuscripcionPage() {
  const router = useRouter()
  const { user, perfil, loading: authLoading, refreshPerfil } = useAuth()

  const [suscripcion, setSuscripcion] = useState<SuscripcionConPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [cancelando, setCancelando] = useState(false)

  useEffect(() => {
    if (!PAYMENTS_ENABLED) {
      router.push('/cuenta')
      return
    }
    if (!authLoading && !user) {
      router.push('/auth/login')
    }
  }, [authLoading, user, router])

  useEffect(() => {
    const cargarSuscripcion = async () => {
      if (!user) return

      const supabase = createClient()
      const { data } = await supabase
        .from('suscripciones')
        .select('*, planes(*)')
        .eq('perfil_id', user.id)
        .eq('estado', 'activa')
        .order('created_at', { ascending: false })
        .limit(1)
        .single()

      setSuscripcion(data)
      setLoading(false)
    }

    if (user) {
      cargarSuscripcion()
    }
  }, [user])

  const handleCancelar = async () => {
    if (!suscripcion || !confirm('Estas seguro de cancelar tu suscripcion? Mantendras acceso hasta el final del periodo pagado.')) {
      return
    }

    setCancelando(true)

    try {
      const response = await fetch('/api/culqi/suscripcion', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ suscripcionId: suscripcion.id }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.error || 'Error al cancelar')
      }

      // Recargar datos
      await refreshPerfil()
      router.push('/cuenta')
    } catch (err) {
      console.error('Error al cancelar:', err)
      alert(err instanceof Error ? err.message : 'Error al cancelar')
    } finally {
      setCancelando(false)
    }
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
      </div>
    )
  }

  if (!user || !perfil) {
    return null
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/cuenta"
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Suscripcion</h1>
              <p className="text-xs text-slate-400">Gestiona tu plan actual</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Plan actual */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Plan actual</h2>

            {suscripcion ? (
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xl font-bold text-white">{suscripcion.planes.nombre}</p>
                    <p className="text-sm text-slate-400">{suscripcion.planes.descripcion}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-amber-400">S/{suscripcion.planes.precio}</p>
                    <p className="text-sm text-slate-400">/mes</p>
                  </div>
                </div>

                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Fecha de inicio</p>
                    <p className="text-white font-medium">
                      {new Date(suscripcion.fecha_inicio).toLocaleDateString('es-PE')}
                    </p>
                  </div>
                  <div className="bg-slate-700/30 rounded-xl p-4">
                    <p className="text-sm text-slate-400 mb-1">Proxima renovacion</p>
                    <p className="text-white font-medium">
                      {suscripcion.fecha_fin
                        ? new Date(suscripcion.fecha_fin).toLocaleDateString('es-PE')
                        : 'Sin fecha'}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded border border-emerald-500/30">
                    Activa
                  </span>
                  {perfil.plan_id === 'profesional' && (
                    <span className="px-2 py-1 bg-purple-500/20 text-purple-400 text-xs font-medium rounded border border-purple-500/30">
                      Consultas ilimitadas
                    </span>
                  )}
                </div>
              </div>
            ) : (
              <div className="text-center py-8">
                <div className="w-16 h-16 bg-slate-700/50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <p className="text-slate-400 mb-4">Estas usando el plan gratuito</p>
                <Link
                  href="/precios"
                  className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Ver planes
                </Link>
              </div>
            )}
          </div>

          {/* Acciones */}
          {suscripcion && (
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Acciones</h2>

              <div className="space-y-3">
                <Link
                  href="/precios"
                  className="flex items-center justify-between p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
                      </svg>
                    </div>
                    <div>
                      <p className="font-medium text-white">Cambiar de plan</p>
                      <p className="text-xs text-slate-400">Actualiza o cambia tu suscripcion</p>
                    </div>
                  </div>
                  <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </Link>

                <button
                  onClick={handleCancelar}
                  disabled={cancelando}
                  className="flex items-center justify-between w-full p-4 bg-red-500/10 border border-red-500/30 rounded-xl hover:bg-red-500/20 transition-colors disabled:opacity-50"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-red-500/20 rounded-lg flex items-center justify-center">
                      <svg className="w-5 h-5 text-red-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </div>
                    <div className="text-left">
                      <p className="font-medium text-red-400">Cancelar suscripcion</p>
                      <p className="text-xs text-slate-400">Mantendras acceso hasta el final del periodo</p>
                    </div>
                  </div>
                  {cancelando ? (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-red-400/30 border-t-red-400" />
                  ) : (
                    <svg className="w-5 h-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  )}
                </button>
              </div>
            </div>
          )}

          {/* Info */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4">
            <div className="flex items-start gap-3">
              <svg className="w-5 h-5 text-blue-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <p className="text-sm text-white font-medium">Sobre la facturacion</p>
                <p className="text-xs text-slate-400">
                  Los pagos se procesan de forma segura a traves de Culqi.
                  Para consultas sobre facturacion, contactanos a soporte@casaciones.pe
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}
