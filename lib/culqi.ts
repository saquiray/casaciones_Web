// Cliente Culqi para servidor (Next.js API Routes)

const CULQI_API_URL = 'https://api.culqi.com/v2'
const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY || ''

interface CulqiRequestOptions {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE'
  endpoint: string
  body?: Record<string, unknown>
}

async function culqiRequest<T>({ method, endpoint, body }: CulqiRequestOptions): Promise<T> {
  const response = await fetch(`${CULQI_API_URL}${endpoint}`, {
    method,
    headers: {
      'Authorization': `Bearer ${CULQI_SECRET_KEY}`,
      'Content-Type': 'application/json',
    },
    body: body ? JSON.stringify(body) : undefined,
  })

  const data = await response.json()

  if (!response.ok) {
    throw new Error(data.user_message || data.merchant_message || 'Error de Culqi')
  }

  return data
}

// Crear un cargo (cobro) con token de tarjeta
export async function crearCargo(params: {
  amount: number // en centimos (ej: 2900 = S/29.00)
  currency_code: string // 'PEN'
  email: string
  source_id: string // token de tarjeta
  description?: string
  metadata?: Record<string, string>
}) {
  return culqiRequest<{
    id: string
    amount: number
    currency_code: string
    email: string
    source: { card_number: string; last_four: string }
    outcome: { type: string; code: string; user_message: string }
  }>({
    method: 'POST',
    endpoint: '/charges',
    body: params,
  })
}

// Crear una orden (para Yape y PagoEfectivo)
export async function crearOrden(params: {
  amount: number // en centimos
  currency_code: string // 'PEN'
  description: string
  order_number: string
  client_details: {
    first_name: string
    last_name: string
    email: string
    phone_number: string
  }
  expiration_date: number // timestamp en segundos
  confirm?: boolean
}) {
  return culqiRequest<{
    id: string
    amount: number
    currency_code: string
    description: string
    state: string
    qr_code?: string // Para Yape
    payment_code?: string // CIP para PagoEfectivo
    expiration_date: number
  }>({
    method: 'POST',
    endpoint: '/orders',
    body: params,
  })
}

// Confirmar una orden (para procesar el pago)
export async function confirmarOrden(orderId: string, params: {
  source_type: 'yape' | 'cuotealo' | 'pagoefectivo'
}) {
  return culqiRequest<{
    id: string
    state: string
  }>({
    method: 'POST',
    endpoint: `/orders/${orderId}/confirm`,
    body: params,
  })
}

// Crear un cliente en Culqi
export async function crearCliente(params: {
  first_name: string
  last_name: string
  email: string
  address?: string
  address_city?: string
  country_code?: string
  phone_number?: string
}) {
  return culqiRequest<{
    id: string
    email: string
    first_name: string
    last_name: string
  }>({
    method: 'POST',
    endpoint: '/customers',
    body: params,
  })
}

// Crear una tarjeta asociada a un cliente
export async function crearTarjeta(params: {
  customer_id: string
  token_id: string
}) {
  return culqiRequest<{
    id: string
    customer_id: string
    source: { card_number: string; last_four: string; card_brand: string }
  }>({
    method: 'POST',
    endpoint: '/cards',
    body: params,
  })
}

// Crear suscripcion
export async function crearSuscripcion(params: {
  card_id: string
  plan_id: string // ID del plan en Culqi (no el nuestro)
  metadata?: Record<string, string>
}) {
  return culqiRequest<{
    id: string
    card_id: string
    plan_id: string
    state: string
    current_period_start: number
    current_period_end: number
  }>({
    method: 'POST',
    endpoint: '/subscriptions',
    body: params,
  })
}

// Cancelar suscripcion
export async function cancelarSuscripcion(subscriptionId: string) {
  return culqiRequest<{
    id: string
    state: string
  }>({
    method: 'DELETE',
    endpoint: `/subscriptions/${subscriptionId}`,
  })
}

// Verificar firma de webhook
export async function verificarWebhook(payload: string, signature: string): Promise<boolean> {
  const webhookSecret = process.env.CULQI_WEBHOOK_SECRET || ''

  const encoder = new TextEncoder()
  const key = await crypto.subtle.importKey(
    'raw',
    encoder.encode(webhookSecret),
    { name: 'HMAC', hash: 'SHA-256' },
    false,
    ['sign']
  )

  const signatureBuffer = await crypto.subtle.sign(
    'HMAC',
    key,
    encoder.encode(payload)
  )

  const expectedSignature = Array.from(new Uint8Array(signatureBuffer))
    .map(b => b.toString(16).padStart(2, '0'))
    .join('')

  return signature === expectedSignature
}

// Helper para convertir soles a centimos
export function solesToCentimos(soles: number): number {
  return Math.round(soles * 100)
}

// Helper para convertir centimos a soles
export function centimosToSoles(centimos: number): number {
  return centimos / 100
}
