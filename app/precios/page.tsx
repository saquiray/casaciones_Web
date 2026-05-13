'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase-browser'

// Flag para habilitar pagos (false en producción por ahora)
const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

interface Plan {
  id: string
  nombre: string
  precio: number
  consultas_mes: number
  descripcion: string
}

export default function PreciosPage() {
  const { user, perfil } = useAuth()
  const [planes, setPlanes] = useState<Plan[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cargarPlanes = async () => {
      const supabase = createClient()
      const { data } = await supabase
        .from('planes')
        .select('*')
        .eq('activo', true)
        .order('precio')

      if (data) {
        setPlanes(data)
      }
      setLoading(false)
    }

    cargarPlanes()
  }, [])

  const planActual = perfil?.plan_id || 'gratis'

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Planes y Precios</h1>
              <p className="text-xs text-slate-400">Elige el plan que mejor se adapte a tus necesidades</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero */}
        <div className="text-center mb-12">
          <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
            Accede a miles de casaciones
          </h2>
          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Consulta la jurisprudencia casatoria del Peru.
            Comienza gratis y actualiza cuando lo necesites.
          </p>
        </div>

        {/* Plans Grid */}
        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {planes.map((plan) => {
              const esActual = plan.id === planActual
              const esPro = plan.id === 'profesional'
              const esGratis = plan.id === 'gratis'

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 ${
                    esPro
                      ? 'bg-gradient-to-br from-purple-500/20 to-purple-600/10 border-2 border-purple-500/50'
                      : 'bg-slate-800/50 border border-slate-700/50'
                  }`}
                >
                  {esPro && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="px-3 py-1 bg-purple-500 text-white text-xs font-semibold rounded-full">
                        Popular
                      </span>
                    </div>
                  )}

                  {esActual && (
                    <div className="absolute top-4 right-4">
                      <span className="px-2 py-1 bg-emerald-500/20 text-emerald-400 text-xs font-medium rounded border border-emerald-500/30">
                        Plan actual
                      </span>
                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white mb-2">{plan.nombre}</h3>

                  <div className="mb-4">
                    <span className="text-4xl font-bold text-white">
                      {plan.precio === 0 ? 'Gratis' : `S/${plan.precio}`}
                    </span>
                    {plan.precio > 0 && (
                      <span className="text-slate-400 text-sm">/mes</span>
                    )}
                  </div>

                  <p className="text-slate-400 text-sm mb-6">{plan.descripcion}</p>

                  <ul className="space-y-3 mb-8">
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      {plan.consultas_mes === -1 ? 'Consultas ilimitadas' : `${plan.consultas_mes} consultas/mes`}
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Ver detalles completos
                    </li>
                    <li className="flex items-center gap-2 text-sm text-slate-300">
                      <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      Descargar PDF
                    </li>
                    {!esGratis && (
                      <li className="flex items-center gap-2 text-sm text-slate-300">
                        <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                        </svg>
                        Soporte prioritario
                      </li>
                    )}
                  </ul>

                  {esActual ? (
                    <button
                      disabled
                      className="w-full py-3 text-sm font-medium text-slate-400 bg-slate-700/50 rounded-lg cursor-not-allowed"
                    >
                      Plan actual
                    </button>
                  ) : esGratis ? (
                    user ? (
                      <Link
                        href="/el-peruano"
                        className="block w-full py-3 text-sm font-medium text-center text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Ir a consultas
                      </Link>
                    ) : (
                      <Link
                        href="/auth/registro"
                        className="block w-full py-3 text-sm font-medium text-center text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition-colors"
                      >
                        Comenzar gratis
                      </Link>
                    )
                  ) : PAYMENTS_ENABLED ? (
                    <Link
                      href={user ? `/checkout?plan=${plan.id}` : `/auth/registro?redirect=/checkout?plan=${plan.id}`}
                      className={`block w-full py-3 text-sm font-medium text-center rounded-lg transition-all ${
                        esPro
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/25'
                      }`}
                    >
                      {user ? 'Actualizar plan' : 'Suscribirse'}
                    </Link>
                  ) : (
                    <button
                      onClick={() => alert('Proximamente: Integracion con pasarela de pago')}
                      className={`w-full py-3 text-sm font-medium rounded-lg transition-all ${
                        esPro
                          ? 'bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-400 hover:to-purple-500 text-white shadow-lg shadow-purple-500/25'
                          : 'bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white shadow-lg shadow-amber-500/25'
                      }`}
                    >
                      {user ? 'Actualizar plan' : 'Suscribirse'}
                    </button>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* FAQ */}
        <div className="mt-20 max-w-3xl mx-auto">
          <h3 className="text-2xl font-bold text-white text-center mb-8">Preguntas frecuentes</h3>

          <div className="space-y-4">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-2">Que cuenta como una consulta?</h4>
              <p className="text-sm text-slate-400">
                Cada busqueda que realices cuenta como una consulta. Ver el detalle de una casacion
                y descargar el PDF no consume consultas adicionales.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-2">Cuando se renuevan mis consultas?</h4>
              <p className="text-sm text-slate-400">
                Las consultas se renuevan automaticamente el primer dia de cada mes.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-2">Que metodos de pago aceptan?</h4>
              <p className="text-sm text-slate-400">
                Aceptamos tarjetas Visa y Mastercard, Yape y PagoEfectivo a traves de Culqi.
              </p>
            </div>

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-xl p-6">
              <h4 className="font-semibold text-white mb-2">Puedo cancelar en cualquier momento?</h4>
              <p className="text-sm text-slate-400">
                Si, puedes cancelar tu suscripcion cuando quieras. Mantendras acceso hasta el
                final del periodo pagado.
              </p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-700/50 mt-12">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-slate-500">
            Sistema de consulta de jurisprudencia casatoria
          </p>
        </div>
      </footer>
    </div>
  )
}
