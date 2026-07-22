'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/components/AuthProvider'
import { createClient } from '@/lib/supabase-browser'

const PAYMENTS_ENABLED =
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

interface Plan {
  id: string
  nombre: string
  precio: number
  consultas_mes: number // ahora representa créditos
  descripcion: string
}

export default function PreciosPage() {
  const router = useRouter()
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

  const comprarCreditos = (planId: string) => {
    if (!PAYMENTS_ENABLED) {
      alert('Próximamente integración con Culqi')
      return
    }

    if (!user) {
      router.push(
        `/auth/registro?redirect=/checkout?tipo=creditos%26plan=${planId}`
      )
      return
    }

    router.push(`/checkout?tipo=creditos&plan=${planId}`)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">

      {/* HEADER */}
      <header className="border-b border-slate-700/50">
        <div className="max-w-6xl mx-auto px-4 py-6">

          <div className="flex items-center gap-4">

            <Link
              href="/"
              className="p-2 -ml-2 rounded-lg text-slate-400 hover:text-white hover:bg-slate-700/50"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeWidth={2}
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>

            <div>
              <h1 className="text-xl font-bold text-white">
                Compra de Créditos
              </h1>

              <p className="text-xs text-slate-400">
                Cada búsqueda consume 1 crédito
              </p>
            </div>

          </div>

        </div>
      </header>

      {/* CONTENIDO */}
      <main className="max-w-6xl mx-auto px-4 py-12">

        {/* HERO */}
        <div className="text-center mb-12">

          <h2 className="text-4xl font-bold text-white mb-4">
            Compra créditos cuando los necesites
          </h2>

          <p className="text-lg text-slate-400 max-w-2xl mx-auto">
            Cada búsqueda consume un crédito.
            Los créditos nunca vencen y permanecen en tu cuenta
            hasta que los utilices.
          </p>

          {perfil && (
            <div className="mt-6 inline-flex items-center gap-2 rounded-xl border border-emerald-500/30 bg-emerald-500/10 px-5 py-3">

              <span className="text-emerald-400">
                Saldo actual:
              </span>

              <span className="font-bold text-white">
                {perfil.creditos ?? 0} créditos
              </span>

            </div>
          )}

        </div>

        {/* TARJETAS */}
        {loading ? (
          <div className="flex justify-center py-16">

            <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500" />

          </div>
        ) : (
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl mx-auto">

            {planes.map((plan, index) => {
              const destacado =
                index === Math.floor(planes.length / 2)

              return (
                <div
                  key={plan.id}
                  className={`relative rounded-2xl p-8 ${destacado
                      ? 'border-2 border-amber-500/40 bg-gradient-to-br from-amber-500/10 to-amber-600/5'
                      : 'border border-slate-700/50 bg-slate-800/50'
                    }`}
                >
                  {destacado && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">

                      <span className="rounded-full bg-amber-500 px-3 py-1 text-xs font-semibold text-black">
                        Más comprado
                      </span>

                    </div>
                  )}

                  <h3 className="text-xl font-bold text-white">
                    {plan.nombre}
                  </h3>

                  <div className="mt-4">

                    <span className="text-4xl font-bold text-white">
                      S/{plan.precio}
                    </span>

                  </div>

                  <p className="mt-5 text-slate-400 text-sm">
                    {plan.descripcion}
                  </p>

                  <ul className="mt-6 space-y-3">

                    <li className="flex items-center gap-2 text-sm text-slate-300">

                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>

                      {plan.consultas_mes} créditos

                    </li>

                    <li className="flex items-center gap-2 text-sm text-slate-300">

                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>

                      Acceso al buscador

                    </li>

                    <li className="flex items-center gap-2 text-sm text-slate-300">

                      <svg
                        className="w-5 h-5 text-emerald-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeWidth={2}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M5 13l4 4L19 7"
                        />
                      </svg>

                      Descarga de PDFs

                    </li>
                  </ul>

                  <button
                    onClick={() => comprarCreditos(plan.id)}
                    className={`mt-8 w-full rounded-lg py-3 text-sm font-semibold transition-all ${destacado
                        ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/25 hover:from-amber-400 hover:to-amber-500'
                        : 'bg-slate-700 text-white hover:bg-slate-600'
                      }`}
                  >
                    Comprar créditos
                  </button>
                </div>
              )
            })}
          </div>
        )}

        {/* Información */}
        <div className="mt-20 max-w-4xl mx-auto">

          <h3 className="mb-8 text-center text-2xl font-bold text-white">
            Preguntas frecuentes
          </h3>

          <div className="space-y-4">

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
              <h4 className="mb-2 font-semibold text-white">
                ¿Cómo funcionan los créditos?
              </h4>

              <p className="text-sm text-slate-400">
                Cada búsqueda realizada en el sistema consume un crédito.
                Ver los resultados, abrir el PDF o descargarlo no consume
                créditos adicionales.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
              <h4 className="mb-2 font-semibold text-white">
                ¿Los créditos vencen?
              </h4>

              <p className="text-sm text-slate-400">
                No. Los créditos permanecen en tu cuenta hasta que los utilices.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
              <h4 className="mb-2 font-semibold text-white">
                ¿Qué métodos de pago aceptan?
              </h4>

              <p className="text-sm text-slate-400">
                Puedes pagar mediante Visa, Mastercard, Yape,
                PagoEfectivo y otros métodos disponibles en Culqi.
              </p>
            </div>

            <div className="rounded-xl border border-slate-700/50 bg-slate-800/50 p-6">
              <h4 className="mb-2 font-semibold text-white">
                ¿Cómo recibo mis créditos?
              </h4>

              <p className="text-sm text-slate-400">
                Después de que el pago sea aprobado, los créditos se
                acreditarán automáticamente en tu cuenta y podrás
                utilizarlos inmediatamente.
              </p>
            </div>

          </div>

        </div>

      </main>

      {/* Footer */}
      <footer className="mt-16 border-t border-slate-700/50">
        <div className="mx-auto max-w-6xl px-4 py-6">

          <p className="text-center text-sm text-slate-500">
            Sistema de consulta de jurisprudencia casatoria
          </p>

        </div>
      </footer>

    </div>
  )
}