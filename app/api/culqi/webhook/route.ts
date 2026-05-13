import { NextRequest, NextResponse } from 'next/server'
import { verificarWebhook } from '@/lib/culqi'
import { supabase } from '@/lib/supabase'

interface CulqiWebhookEvent {
  type: string
  data: {
    object: {
      id: string
      amount: number
      currency_code: string
      email: string
      source: {
        card_number: string
        last_four: string
      }
      outcome: {
        type: string
        code: string
        user_message: string
      }
      metadata?: {
        user_id?: string
        plan_id?: string
      }
    }
  }
}

export async function POST(request: NextRequest) {
  try {
    const payload = await request.text()
    const signature = request.headers.get('culqi-signature') || ''

    // Verificar firma del webhook (en produccion)
    if (process.env.NODE_ENV === 'production') {
      const isValid = await verificarWebhook(payload, signature)
      if (!isValid) {
        console.error('Firma de webhook invalida')
        return NextResponse.json({ error: 'Firma invalida' }, { status: 401 })
      }
    }

    const event: CulqiWebhookEvent = JSON.parse(payload)

    console.log('Webhook Culqi recibido:', event.type)

    switch (event.type) {
      case 'charge.succeeded':
        await handleChargeSucceeded(event)
        break

      case 'charge.failed':
        await handleChargeFailed(event)
        break

      case 'order.paid':
        await handleOrderPaid(event)
        break

      case 'subscription.created':
        await handleSubscriptionCreated(event)
        break

      case 'subscription.cancelled':
        await handleSubscriptionCancelled(event)
        break

      default:
        console.log('Evento no manejado:', event.type)
    }

    return NextResponse.json({ received: true })
  } catch (err) {
    console.error('Error en webhook:', err)
    return NextResponse.json({ error: 'Error interno' }, { status: 500 })
  }
}

async function handleChargeSucceeded(event: CulqiWebhookEvent) {
  const charge = event.data.object
  const userId = charge.metadata?.user_id
  const planId = charge.metadata?.plan_id

  if (!userId || !planId) {
    console.log('Charge sin metadata, ignorando')
    return
  }

  // Actualizar pago a completado
  await supabase
    .from('pagos')
    .update({ estado: 'completado' })
    .eq('culqi_charge_id', charge.id)

  // Actualizar plan del usuario
  await supabase
    .from('perfiles')
    .update({
      plan_id: planId,
      consultas_usadas: 0,
    })
    .eq('id', userId)

  console.log(`Usuario ${userId} actualizado a plan ${planId}`)
}

async function handleChargeFailed(event: CulqiWebhookEvent) {
  const charge = event.data.object

  // Actualizar pago a fallido
  await supabase
    .from('pagos')
    .update({ estado: 'fallido' })
    .eq('culqi_charge_id', charge.id)

  console.log(`Pago fallido: ${charge.id}`)
}

async function handleOrderPaid(event: CulqiWebhookEvent) {
  const order = event.data.object

  // Buscar el pago pendiente y actualizarlo
  const { data: pago } = await supabase
    .from('pagos')
    .select('*, perfiles(*)')
    .eq('culqi_charge_id', order.id)
    .eq('estado', 'pendiente')
    .single()

  if (!pago) {
    console.log('Orden no encontrada:', order.id)
    return
  }

  // Actualizar pago a completado
  await supabase
    .from('pagos')
    .update({ estado: 'completado' })
    .eq('id', pago.id)

  // Determinar el plan basado en el monto
  let planId = 'basico'
  if (order.amount >= 7900) {
    planId = 'profesional'
  }

  // Actualizar plan del usuario
  await supabase
    .from('perfiles')
    .update({
      plan_id: planId,
      consultas_usadas: 0,
    })
    .eq('id', pago.perfil_id)

  // Crear suscripcion
  const fechaInicio = new Date()
  const fechaFin = new Date()
  fechaFin.setMonth(fechaFin.getMonth() + 1)

  await supabase.from('suscripciones').insert({
    perfil_id: pago.perfil_id,
    plan_id: planId,
    estado: 'activa',
    fecha_inicio: fechaInicio.toISOString().split('T')[0],
    fecha_fin: fechaFin.toISOString().split('T')[0],
    culqi_subscription_id: order.id,
  })

  console.log(`Orden pagada: ${order.id}, usuario actualizado`)
}

async function handleSubscriptionCreated(event: CulqiWebhookEvent) {
  console.log('Suscripcion creada:', event.data.object.id)
}

async function handleSubscriptionCancelled(event: CulqiWebhookEvent) {
  const subscription = event.data.object

  // Actualizar suscripcion a cancelada
  await supabase
    .from('suscripciones')
    .update({ estado: 'cancelada' })
    .eq('culqi_subscription_id', subscription.id)

  // Cambiar plan a gratis
  const { data: suscripcion } = await supabase
    .from('suscripciones')
    .select('perfil_id')
    .eq('culqi_subscription_id', subscription.id)
    .single()

  if (suscripcion) {
    await supabase
      .from('perfiles')
      .update({ plan_id: 'gratis' })
      .eq('id', suscripcion.perfil_id)
  }

  console.log('Suscripcion cancelada:', subscription.id)
}
