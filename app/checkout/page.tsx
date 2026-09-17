'use client'

import { Suspense, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { useAuth } from '@/components/AuthProvider'
import CulqiCheckout from '@/components/CulqiCheckout'
import { Plan, PaqueteCreditos } from '@/lib/types'
import { createClient } from '@/lib/supabase-browser'

const PAYMENTS_ENABLED = 'true'

function CheckoutContent() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user, perfil, loading: authLoading } = useAuth()

  const tipo = (
    searchParams.get('tipo') === 'creditos'
      ? 'creditos'
      : 'plan'
  ) as 'plan' | 'creditos'

  const itemId =
    tipo === 'creditos'
      ? searchParams.get('paquete')
      : searchParams.get('plan')

  const redirectParam =
    tipo === 'creditos'
      ? `tipo=creditos&paquete=${itemId}`
      : `plan=${itemId}`

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

  // Aceptación de términos
  const [aceptaTerminos, setAceptaTerminos] = useState(false)

  useEffect(() => {
    // Redirigir si los pagos están deshabilitados
    if (!PAYMENTS_ENABLED) {
      console.log(PAYMENTS_ENABLED)
      router.push('/precios')
      return
    }

    // Redirigir al login si no hay usuario
    if (!authLoading && !user) {
      router.push(
        `/auth/login?redirect=/checkout?${redirectParam}`
      )
    }
  }, [
    authLoading,
    user,
    router,
    redirectParam,
  ])

  useEffect(() => {
    const cargarItem = async () => {
      if (!itemId) {
        router.push('/precios')
        console.log('No se encontró itemId')
        return
      }

      const supabase = createClient()

      const tabla =
        tipo === 'creditos'
          ? 'paquetes_creditos'
          : 'planes'

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

  const handleSuccess = async (data: {
    token?: string
    orderId?: string
    method: string
  }) => {
    setProcesando(true)
    setError(null)

    try {
      /*
       * Verificación adicional.
       *
       * Aunque el checkout solamente se muestra cuando
       * aceptaTerminos === true, mantenemos esta validación
       * antes de procesar cualquier pago.
       */
      if (!aceptaTerminos) {
        throw new Error(
          'Debes aceptar los Términos y Condiciones y leer la Política de Privacidad antes de continuar.'
        )
      }

      if (!item?.id) {
        throw new Error(
          'No se pudo identificar el producto seleccionado.'
        )
      }

      if (data.method === 'tarjeta' && data.token) {
        // Procesar pago con tarjeta
        const response = await fetch(
          '/api/culqi/procesar-pago',
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              tokenId: data.token,
              itemId: item.id,
              tipo,
            }),
          }
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              'Error al procesar el pago'
          )
        }

        setExito(true)
      } else if (data.orderId) {
        // Obtener información de la orden
        // para Yape o PagoEfectivo
        const response = await fetch(
          `/api/culqi/orden/${data.orderId}`
        )

        const result = await response.json()

        if (!response.ok) {
          throw new Error(
            result.error ||
              'Error al obtener la orden'
          )
        }

        setOrdenInfo({
          qrCode: result.qrCode,
          cipCode: result.cipCode,
          method: data.method,
        })
      } else {
        throw new Error(
          'No se recibió información válida del pago.'
        )
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : 'Error desconocido'
      )
    } finally {
      setProcesando(false)
    }
  }

  const handleError = (errorMessage: string) => {
    setError(errorMessage)
    setProcesando(false)
  }
  console.log("authLoading", authLoading)
  if (authLoading || loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500">
        <div>{authLoading}</div>
        </div>
      </div>
    )
  }

  if (!user || !item) {
    return null
  }

  const esCreditos = tipo === 'creditos'

  const paquete = esCreditos
    ? (item as PaqueteCreditos)
    : null

  const plan = !esCreditos
    ? (item as Plan)
    : null

  // ============================================================
  // PANTALLA DE ÉXITO
  // ============================================================

  if (exito) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">

        <div className="max-w-md w-full text-center">

          <div className="w-20 h-20 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg
              className="w-10 h-10 text-emerald-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 13l4 4L19 7"
              />
            </svg>
          </div>

          <h1 className="text-2xl font-bold text-white mb-2">
            Pago exitoso
          </h1>

          <p className="text-slate-400 mb-6">

            {esCreditos ? (
              <>
                Se agregaron{' '}
                <span className="text-white font-semibold">
                  {paquete?.creditos}
                </span>{' '}
                créditos a tu cuenta.
              </>
            ) : (
              <>
                Tu suscripción al plan{' '}
                {plan?.nombre} ha sido activada.
                Ya puedes disfrutar de{' '}
                {plan?.consultas_mes === -1
                  ? 'consultas ilimitadas'
                  : `${plan?.consultas_mes} consultas por mes`}
                .
              </>
            )}

          </p>

          {esCreditos && (
            <div className="mb-6 rounded-xl border border-amber-500/30 bg-amber-500/5 p-4">

              <p className="text-sm text-slate-400">
                Vigencia de tus créditos
              </p>

              <p className="mt-1 font-semibold text-amber-400">
                Los créditos no caducan
              </p>

            </div>
          )}

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

  // ============================================================
  // PANTALLA DE YAPE / PAGOEFECTIVO
  // ============================================================

  if (ordenInfo) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center px-4">

        <div className="max-w-md w-full">

          <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-8 text-center">

            {ordenInfo.method === 'yape' &&
            ordenInfo.qrCode ? (
              <>
                <div className="w-16 h-16 bg-purple-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-3xl font-bold text-purple-400">
                    Y
                  </span>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  Paga con Yape
                </h2>

                <p className="text-slate-400 mb-6">
                  Escanea el código QR con tu app de Yape
                </p>

                <div className="bg-white p-4 rounded-xl inline-block mb-6">
                  <Image
                    src={ordenInfo.qrCode}
                    alt="QR Yape"
                    width={192}
                    height={192}
                  />
                </div>

                <p className="text-sm text-slate-500">
                  El pago se confirmará automáticamente.
                </p>
              </>
            ) : ordenInfo.method === 'pagoefectivo' &&
              ordenInfo.cipCode ? (
              <>
                <div className="w-16 h-16 bg-orange-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
                  <svg
                    className="w-8 h-8 text-orange-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                </div>

                <h2 className="text-xl font-bold text-white mb-2">
                  Paga con PagoEfectivo
                </h2>

                <p className="text-slate-400 mb-6">
                  Usa este código CIP para pagar
                </p>

                <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-6 mb-6">

                  <p className="text-sm text-slate-400 mb-2">
                    Código CIP
                  </p>

                  <p className="text-3xl font-mono font-bold text-amber-400 tracking-wider">
                    {ordenInfo.cipCode}
                  </p>

                </div>

                <p className="text-sm text-slate-500 mb-4">
                  Puedes pagar en cualquier agente o banco afiliado.
                  El código vence en 24 horas.
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
              <p className="text-slate-400">
                Procesando orden...
              </p>
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

  // ============================================================
  // CHECKOUT
  // ============================================================

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
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M10 19l-7-7m0 0l7-7m-7 7h18"
                />
              </svg>
            </Link>

            <div>

              <h1 className="text-xl font-bold text-white">
                Checkout
              </h1>

              <p className="text-xs text-slate-400">
                {esCreditos
                  ? 'Completa la compra de tus créditos'
                  : 'Completa la contratación de tu plan'}
              </p>

            </div>

          </div>

        </div>

      </header>

      {/* Content */}

      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        <div className="grid md:grid-cols-5 gap-8">

          {/* =====================================================
              FORMULARIO DE PAGO
          ====================================================== */}

          <div className="md:col-span-3">

            {error && (
              <div className="mb-6 p-4 bg-red-500/10 border border-red-500/30 rounded-xl">
                <p className="text-sm text-red-400">
                  {error}
                </p>
              </div>
            )}

            {/* =================================================
                TÉRMINOS Y CONDICIONES
            ================================================== */}

            <div className="mb-6 rounded-2xl border border-slate-700/50 bg-slate-800/50 p-5">

              <div className="flex items-start gap-3">

                <input
                  id="acepta-terminos"
                  type="checkbox"
                  checked={aceptaTerminos}
                  onChange={(e) => {
                    setAceptaTerminos(
                      e.target.checked
                    )

                    // Limpiar error anterior
                    if (e.target.checked) {
                      setError(null)
                    }
                  }}
                  className="mt-1 h-5 w-5 cursor-pointer rounded border-slate-600 bg-slate-700 accent-amber-500"
                />

                <label
                  htmlFor="acepta-terminos"
                  className="cursor-pointer text-sm leading-6 text-slate-400"
                >
                  Acepto los{' '}

                  <Link
                    href="/terminos-y-condiciones"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
                  >
                    Términos y Condiciones
                  </Link>

                  {' '}y he leído la{' '}

                  <Link
                    href="/politica-privacidad"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-medium text-amber-400 underline underline-offset-2 hover:text-amber-300"
                  >
                    Política de Privacidad
                  </Link>

                  .
                </label>

              </div>

              <p className="mt-3 pl-8 text-xs leading-5 text-slate-500">
                Debes aceptar los términos y leer la política de
                privacidad antes de continuar con el pago.
              </p>

            </div>

            {/* =================================================
                CHECKOUT CULQI
            ================================================== */}

            {procesando ? (

              <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-12 text-center">

                <div className="animate-spin rounded-full h-10 w-10 border-2 border-amber-500/30 border-t-amber-500 mx-auto mb-4"></div>

                <p className="text-slate-400">
                  Procesando pago...
                </p>

              </div>

            ) : aceptaTerminos ? (

              <CulqiCheckout
                item={item}
                tipo={tipo}
                userEmail={user.email || ''}
                userName={perfil?.nombre || 'Usuario'}
                onSuccess={handleSuccess}
                onError={handleError}
              />

            ) : (

              <div className="bg-slate-800/30 border border-slate-700/50 rounded-2xl p-10 text-center">

                <div className="w-14 h-14 mx-auto mb-4 rounded-full bg-amber-500/10 flex items-center justify-center">

                  <svg
                    className="w-7 h-7 text-amber-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 15v2m0-8v4m0-8a9 9 0 110 18 9 9 0 010-18z"
                    />
                  </svg>

                </div>

                <h3 className="text-lg font-semibold text-white mb-2">
                  Revisa las condiciones de compra
                </h3>

                <p className="text-sm leading-6 text-slate-400">
                  Para continuar con el pago, debes aceptar los
                  Términos y Condiciones y leer la Política de
                  Privacidad.
                </p>

              </div>

            )}

          </div>

          {/* =====================================================
              RESUMEN DE COMPRA
          ====================================================== */}

          <div className="md:col-span-2">

            <div className="bg-slate-800/50 border border-slate-700/50 rounded-2xl p-6 sticky top-8">

              <h3 className="text-lg font-semibold text-white mb-4">
                Resumen
              </h3>

              <div className="space-y-3 mb-6">

                {/* Paquete / Plan */}

                <div className="flex justify-between gap-4">

                  <span className="text-slate-400">
                    {esCreditos
                      ? 'Paquete'
                      : 'Plan'}
                  </span>

                  <span className="text-white font-medium text-right">
                    {item.nombre}
                  </span>

                </div>

                {/* Créditos / Consultas */}

                <div className="flex justify-between gap-4">

                  <span className="text-slate-400">
                    {esCreditos
                      ? 'Créditos'
                      : 'Consultas'}
                  </span>

                  <span className="text-white text-right">

                    {esCreditos
                      ? `${paquete?.creditos} créditos`
                      : (
                        plan?.consultas_mes === -1
                          ? 'Ilimitadas'
                          : `${plan?.consultas_mes}/mes`
                      )}

                  </span>

                </div>

                {/* Vigencia */}

                <div className="flex justify-between gap-4">

                  <span className="text-slate-400">
                    {esCreditos
                      ? 'Vigencia'
                      : 'Periodo'}
                  </span>

                  <span className="text-white text-right">

                    {esCreditos
                      ? 'No caducan'
                      : 'Mensual'}

                  </span>

                </div>

              </div>

              {/* Total */}

              <div className="border-t border-slate-700/50 pt-4">

                <div className="flex justify-between items-center">

                  <span className="text-slate-400">
                    Total
                  </span>

                  <div className="text-right">

                    <span className="text-2xl font-bold text-white">
                      S/{item.precio}
                    </span>

                    {!esCreditos && (
                      <span className="text-slate-400 text-sm ml-1">
                        /mes
                      </span>
                    )}

                  </div>

                </div>

              </div>

              {/* Información adicional */}

              {esCreditos ? (

                <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">

                  <div className="flex items-start gap-3">

                    <svg
                      className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <div>

                      <p className="text-sm text-white font-medium">
                        Créditos sin vencimiento
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Los créditos permanecerán en tu cuenta
                        hasta que los utilices.
                      </p>

                    </div>

                  </div>

                </div>

              ) : (

                <div className="mt-6 p-4 bg-slate-700/30 rounded-xl">

                  <div className="flex items-start gap-3">

                    <svg
                      className="w-5 h-5 text-emerald-400 mt-0.5 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>

                    <div>

                      <p className="text-sm text-white font-medium">
                        Acceso a la plataforma
                      </p>

                      <p className="text-xs text-slate-400 mt-1">
                        Tu plan se activará una vez confirmado
                        el pago.
                      </p>

                    </div>

                  </div>

                </div>

              )}

            </div>

          </div>

        </div>

      </main>

    </div>
  )
}

function CheckoutLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 flex items-center justify-center hola">

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