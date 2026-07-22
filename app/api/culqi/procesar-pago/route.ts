import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { crearCargo, solesToCentimos } from '@/lib/culqi'
import { agregarCreditos } from '@/lib/creditos'
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
    const { tokenId, itemId, planId, tipo = 'plan' } = body
    const id = itemId || planId

    if (!tokenId || !id) {
      return NextResponse.json({ error: 'Faltan parametros' }, { status: 400 })
    }

    // Obtener plan o paquete de creditos segun el tipo de compra
    const tabla = tipo === 'creditos' ? 'paquetes_creditos' : 'planes'
    const { data: plan } = await supabase
      .from(tabla)
      .select('*')
      .eq('id', id)
      .eq('activo', true)
      .single()

    if (!plan) {
      return NextResponse.json({ error: 'Producto no encontrado' }, { status: 404 })
    }

    const descripcion = tipo === 'creditos'
      ? `Paquete de creditos ${plan.nombre} - Casaciones Web`
      : `Suscripcion plan ${plan.nombre} - Casaciones Web`

    // Crear cargo en Culqi
    const cargo = await crearCargo({
      amount: solesToCentimos(plan.precio),
      currency_code: 'PEN',
      email: user.email || '',
      source_id: tokenId,
      description: descripcion,
      metadata: {
        user_id: user.id,
        tipo,
        referencia_id: id,
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
      tipo,
      referencia_id: id,
      creditos_otorgados: tipo === 'creditos' ? plan.creditos : null,
    })

    if (tipo === 'creditos') {
      // Sumar creditos al saldo del usuario, no toca el plan de suscripcion
      const nuevoSaldo = await agregarCreditos(
        user.id,
        plan.creditos,
        `Compra de paquete ${plan.nombre}`,
        cargo.id
      )

      return NextResponse.json({
        success: true,
        chargeId: cargo.id,
        tipo: 'creditos',
        creditos: nuevoSaldo,
      })
    }

    // Actualizar plan del usuario
    await supabase
      .from('perfiles')
      .update({
        plan_id: id,
        consultas_usadas: 0, // Resetear contador
      })
      .eq('id', user.id)

    // Crear suscripcion
    const fechaInicio = new Date()
    const fechaFin = new Date()
    fechaFin.setMonth(fechaFin.getMonth() + 1)

    await supabase.from('suscripciones').insert({
      perfil_id: user.id,
      plan_id: id,
      estado: 'activa',
      fecha_inicio: fechaInicio.toISOString().split('T')[0],
      fecha_fin: fechaFin.toISOString().split('T')[0],
      culqi_subscription_id: cargo.id,
    })

    return NextResponse.json({
      success: true,
      chargeId: cargo.id,
      tipo: 'plan',
      plan: plan.nombre,
    })
  } catch (err) {
    console.error('Error al procesar pago:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
