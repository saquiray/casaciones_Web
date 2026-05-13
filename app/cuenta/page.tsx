'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'

const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

export default function CuentaPage() {
  const router = useRouter()
  const { user, perfil, loading } = useAuth()

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login')
    }
  }, [loading, user, router])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
      </div>
    )
  }

  if (!user || !perfil) {
    return null
  }

  const planLabel = perfil.plan_id === 'profesional' ? 'Profesional' :
                    perfil.plan_id === 'basico' ? 'Basico' : 'Gratis'

  const planColor = perfil.plan_id === 'profesional' ? 'bg-purple-500/20 text-purple-400 border-purple-500/30' :
                    perfil.plan_id === 'basico' ? 'bg-blue-500/20 text-blue-400 border-blue-500/30' :
                    'bg-slate-500/20 text-slate-400 border-slate-500/30'

  const consultasMax = perfil.plan_id === 'profesional' ? -1 :
                       perfil.plan_id === 'basico' ? 100 : 10

  const porcentajeUso = consultasMax === -1 ? 0 : (perfil.consultas_usadas / consultasMax) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/el-peruano"
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Mi Cuenta</h1>
              <p className="text-xs text-slate-400">Gestiona tu perfil y suscripcion</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid gap-6">
          {/* Perfil */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Perfil</h2>

            <div className="flex items-center gap-4">
              <div className="w-16 h-16 bg-gradient-to-br from-amber-400 to-amber-600 rounded-full flex items-center justify-center text-white font-bold text-2xl">
                {perfil.nombre?.[0]?.toUpperCase() || user.email?.[0]?.toUpperCase() || 'U'}
              </div>
              <div>
                <p className="text-lg font-semibold text-white">{perfil.nombre || 'Usuario'}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
            </div>
          </div>

          {/* Plan actual */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Plan actual</h2>
              <span className={`px-3 py-1 text-sm font-medium rounded-full border ${planColor}`}>
                {planLabel}
              </span>
            </div>

            {/* Uso */}
            <div className="mb-6">
              <div className="flex items-center justify-between text-sm mb-2">
                <span className="text-slate-400">Consultas este mes</span>
                <span className="text-white font-medium">
                  {perfil.consultas_usadas}
                  {consultasMax !== -1 && ` / ${consultasMax}`}
                </span>
              </div>
              {consultasMax !== -1 && (
                <div className="w-full bg-slate-700 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      porcentajeUso >= 100 ? 'bg-red-500' :
                      porcentajeUso >= 80 ? 'bg-amber-500' : 'bg-emerald-500'
                    }`}
                    style={{ width: `${Math.min(porcentajeUso, 100)}%` }}
                  />
                </div>
              )}
              {consultasMax === -1 && (
                <p className="text-sm text-emerald-400">Consultas ilimitadas</p>
              )}
            </div>

            {perfil.plan_id !== 'profesional' && (
              <Link
                href="/precios"
                className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                Mejorar plan
              </Link>
            )}
          </div>

          {/* Acciones rapidas */}
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6">
            <h2 className="text-lg font-semibold text-white mb-4">Acciones rapidas</h2>

            <div className="grid sm:grid-cols-2 gap-3">
              <Link
                href="/el-peruano"
                className="flex items-center gap-3 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-10 h-10 bg-amber-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Buscar casaciones</p>
                  <p className="text-xs text-slate-400">Diario El Peruano</p>
                </div>
              </Link>

              {PAYMENTS_ENABLED && (
                <Link
                  href="/cuenta/suscripcion"
                  className="flex items-center gap-3 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-colors"
                >
                  <div className="w-10 h-10 bg-emerald-500/20 rounded-lg flex items-center justify-center">
                    <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div>
                    <p className="font-medium text-white">Mi suscripcion</p>
                    <p className="text-xs text-slate-400">Gestionar plan</p>
                  </div>
                </Link>
              )}

              <Link
                href="/precios"
                className="flex items-center gap-3 p-4 bg-slate-700/30 border border-slate-600/30 rounded-xl hover:bg-slate-700/50 transition-colors"
              >
                <div className="w-10 h-10 bg-purple-500/20 rounded-lg flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-white">Ver planes</p>
                  <p className="text-xs text-slate-400">Precios y beneficios</p>
                </div>
              </Link>
            </div>
          </div>

          {/* Info */}
          <div className="bg-slate-800/30 border border-slate-700/30 rounded-xl p-4 text-center">
            <p className="text-sm text-slate-500">
              Las consultas se renuevan el primer dia de cada mes.
              Ultima renovacion: {new Date(perfil.fecha_reset).toLocaleDateString('es-PE')}
            </p>
          </div>
        </div>
      </main>
    </div>
  )
}
