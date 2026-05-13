import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { crearCargo, solesToCentimos } from '@/lib/culqi'
import { supabase } from '@/lib/supabase'

export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabaseAuth = await createClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { tokenId, planId } = body

    if (!tokenId || !planId) {
      return NextResponse.json({ error: 'Faltan parametros' }, { status: 400 })
    }

    // Obtener plan
    const { data: plan } = await supabase
      .from('planes')
      .select('*')
      .eq('id', planId)
      .eq('activo', true)
      .single()

    if (!plan) {
      return NextResponse.json({ error: 'Plan no encontrado' }, { status: 404 })
    }

    // Crear cargo en Culqi
    const cargo = await crearCargo({
      amount: solesToCentimos(plan.precio),
      currency_code: 'PEN',
      email: user.email || '',
      source_id: tokenId,
      description: `Suscripcion plan ${plan.nombre} - Casaciones Web`,
      metadata: {
        user_id: user.id,
        plan_id: planId,
      },
    })

    // Guardar pago en la base de datos
    await supabase.from('pagos').insert({
      perfil_id: user.id,
      monto: plan.precio,
      moneda: 'PEN',
      estado: 'completado',
      metodo_pago: 'tarjeta',
      culqi_charge_id: cargo.id,
    })

    // Actualizar plan del usuario
    await supabase
      .from('perfiles')
      .update({
        plan_id: planId,
        consultas_usadas: 0, // Resetear contador
      })
      .eq('id', user.id)

    // Crear suscripcion
    const fechaInicio = new Date()
    const fechaFin = new Date()
    fechaFin.setMonth(fechaFin.getMonth() + 1)

    await supabase.from('suscripciones').insert({
      perfil_id: user.id,
      plan_id: planId,
      estado: 'activa',
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      fecha_fin: fechaFin.toISOString().split('T')[0],
      culqi_subscription_id: cargo.id,
    })

    return NextResponse.json({
      success: true,
      chargeId: cargo.id,
      plan: plan.nombre,
    })
  } catch (err) {
    console.error('Error al procesar pago:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
