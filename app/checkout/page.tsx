'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import CulqiCheckout from '@/components/CulqiCheckout'
import { Plan, PaqueteCreditos } from '@/lib/types'
import { createClient } from '@/lib/supabase-browser'

const PAYMENTS_ENABLED = process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, perfil, loading: authLoading } = useAuth()

  const tipo = (searchParams.get('tipo') === 'creditos' ? 'creditos' : 'plan') as 'plan' | 'creditos'
  const itemId = tipo === 'creditos' ? searchParams.get('paquete') : searchParams.get('plan')
  const redirectParam = tipo === 'creditos' ? `tipo=creditos&paquete=${itemId}` : `plan=${itemId}`

  const [item, setItem] = useState<Plan | PaqueteCreditos | null>(null)
  const [loading, setLoading] = useState(true)
  const [procesando, setProcesando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [exito, setExito] = useState(false)
  const [ordenInfo, setOrdenInfo] = useState<{
    qrCode?: string
    cipCode?: string
    method: string
  } | null>(null)

  useEffect(() => {
    // Redirigir si los pagos están deshabilitados
    if (!PAYMENTS_ENABLED) {
      router.push('/precios')
      return
    }
    if (!authLoading && !user) {
      router.push(`/auth/login?redirect=/checkout?${redirectParam}`)
    }
  }, [authLoading, user, router, redirectParam])

  useEffect(() => {
    const cargarItem = async () => {
      if (!itemId) {
        router.push('/precios')
        return
      }

      const supabase = createClient()
      const tabla = tipo === 'creditos' ? 'paquetes_creditos' : 'planes'
      const { data } = await supabase
        .from(tabla)
        .select('*')
        .eq('id', itemId)
        .eq('activo', true)
        .single()

      if (!data) {
        router.push('/precios')
        return
      }

      setItem(data)
      setLoading(false)
    }

    cargarItem()
  }, [itemId, tipo, router])

  const handleSuccess = async (data: { token?: string; orderId?: string; method: string }) => {
    setProcesando(true)
    setError(null)

    try {
      if (data.method === 'tarjeta' && data.token) {
        // Procesar pago con tarjeta
        const response = await fetch('/api/culqi/procesar-pago', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            tokenId: data.token,
            itemId: item?.id,
            tipo,
          }),
        })

        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Error al procesar el pago')
        }

        setExito(true)
      } else if (data.orderId) {
        // Obtener info de la orden (QR o CIP)
        const response = await fetch(`/api/culqi/orden/${data.orderId}`)
        const result = await response.json()

        if (!response.ok) {
          throw new Error(result.error || 'Error al obtener la orden')
        }

        setOrdenInfo({
          qrCode: result.qrCode,
          cipCode: result.cipCode,
          method: data.method,
        })
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error desconocido')
    } finally {
      setProcesando(false)
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setProcesando(false)
  }

  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
      </div>
    )
  }

  if (!user || !item) {
    return null
  }

  const esCreditos = tipo === 'creditos'
  const paquete = esCreditos ? (item as PaqueteCreditos) : null
  const plan = !esCreditos ? (item as Plan) : null

  // Pantalla de exito
  if (exito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h1 className="text-2xl font-bold text-white mb-2">Pago exitoso</h1>
          <p className="text-slate-400 mb-6">
            {esCreditos ? (
              <>Se agregaron <span className="text-white font-semibold">{paquete?.creditos}</span> creditos a tu cuenta.</>
            ) : (
              <>Tu suscripcion al plan {plan?.nombre} ha sido activada.
              Ya puedes disfrutar de {plan?.consultas_mes === -1 ? 'consultas ilimitadas' : `${plan?.consultas_mes} consultas por mes`}.</>
            )}
          </p>
          <div className="flex gap-3 justify-center">
            <Link
              href="/poder-judicial"
              className="px-6 py-3 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all"
            >
              Ir a buscar casaciones
            </Link>
            <Link
              href="/cuenta"
              className="px-6 py-3 text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Ver mi cuenta
            </Link>
          </div>
        </div>
      </div>
    )
  }

  // Pantalla de Yape/PagoEfectivo
  if (ordenInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">
        <div className="max-w-md w-full">
          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">
            {ordenInfo.method === 'yape' && ordenInfo.qrCode ? (
              <>
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-purple-400">Y</span>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Paga con Yape</h2>
                <p className="text-slate-400 mb-6">Escanea el codigo QR con tu app de Yape</p>

                <div className="bg-white p-4 rounded-xl inline-block mb-6">
                  <Image src={ordenInfo.qrCode} alt="QR Yape" width={192} height={192} />
                </div>

                <p className="text-sm text-slate-500">
                  El pago se confirmara automaticamente
                </p>
              </>
            ) : ordenInfo.method === 'pagoefectivo' && ordenInfo.cipCode ? (
              <>
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg className="w-8 h-8 text-orange-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white mb-2">Paga con PagoEfectivo</h2>
                <p className="text-slate-400 mb-6">Usa este codigo CIP para pagar</p>

                <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-6 mb-6">
                  <p className="text-sm text-slate-400 mb-2">Codigo CIP</p>
                  <p className="text-3xl font-mono font-bold text-amber-400 tracking-wider">
                    {ordenInfo.cipCode}
                  </p>
                </div>

                <p className="text-sm text-slate-500 mb-4">
                  Puedes pagar en cualquier agente o banco afiliado.
                  El codigo vence en 24 horas.
                </p>

                <a
                  href="https://pagoefectivo.pe/donde-pagar"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm text-amber-400 hover:text-amber-300"
                >
                  Ver puntos de pago
                </a>
              </>
            ) : (
              <p className="text-slate-400">Procesando orden...</p>
            )}

            <div className="mt-6 pt-6 border-t border-slate-700/50">
              <Link
                href="/precios"
                className="text-sm text-slate-400 hover:text-white"
              >
                Cancelar y volver
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="border-b border-slate-700/50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center gap-4">
            <Link
              href="/precios"
              className="p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded-lg transition-colors"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
            </Link>
            <div>
              <h1 className="text-xl font-bold text-white">Checkout</h1>
              <p className="text-xs text-slate-400">{esCreditos ? 'Completa la compra de tus creditos' : 'Completa tu suscripcion'}</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid md:grid-cols-5 gap-8">
          {/* Formulario de pago */}
          <div className="md:col-span-3">
            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-400">{error}</p>
              </div>
            )}

            {procesando ? (
              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">
                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500 mx-auto mb-4"></div>
                <p className="text-slate-400">Procesando pago...</p>
              </div>
            ) : (
              <CulqiCheckout
                item={item}
                tipo={tipo}
                userEmail={user.email || ''}
                userName={perfil?.nombre || 'Usuario'}
                onSuccess={handleSuccess}
                onError={handleError}
              />
            )}
          </div>

          {/* Resumen de compra */}
          <div className="md:col-span-2">
            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-white mb-4">Resumen</h3>

              <div className="space-y-3 mb-6">
                <div className="flex justify-between">
                  <span className="text-slate-400">{esCreditos ? 'Paquete' : 'Plan'}</span>
                  <span className="text-white font-medium">{item.nombre}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{esCreditos ? 'Creditos' : 'Consultas'}</span>
                  <span className="text-white">
                    {esCreditos
                      ? `${paquete?.creditos} creditos`
                      : (plan?.consultas_mes === -1 ? 'Ilimitadas' : `${plan?.consultas_mes}/mes`)}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-400">{esCreditos ? 'Vigencia' : 'Periodo'}</span>
                  <span className="text-white">{esCreditos ? 'No caducan' : 'Mensual'}</span>
                </div>
              </div>

              <div className="border-t border-slate-700/50 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-slate-400">Total</span>
                  <div className="text-right">
                    <span className="text-2xl font-bold text-white">S/{item.precio}</span>
                    {!esCreditos && <span className="text-slate-400 text-sm">/mes</span>}
                  </div>
                </div>
              </div>

              <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-400 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  <div>
                    <p className="text-sm text-white font-medium">Garantia de satisfaccion</p>
                    <p className="text-xs text-slate-400">Cancela cuando quieras sin compromisos</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500"></div>
    </div>
  )
}

export default function CheckoutPage() {
  return (
    <Suspense fallback={<CheckoutLoading />}>
      <CheckoutContent />
    </Suspense>
  )
}
