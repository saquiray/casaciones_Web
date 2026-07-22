import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { crearOrden, solesToCentimos } from '@/lib/culqi'
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
    const { itemId, planId, metodo, email, nombre, tipo = 'plan' } = body
    const id = itemId || planId

    if (!id || !metodo) {
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

    // Separar nombre en partes
    const nombreParts = (nombre || 'Usuario').split(' ')
    const firstName = nombreParts[0] || 'Usuario'
    const lastName = nombreParts.slice(1).join(' ') || 'Casaciones'

    // Crear orden en Culqi
    const orderNumber = `ORD-${user.id.substring(0, 8)}-${Date.now()}`
    const expiration = Math.floor(Date.now() / 1000) + (24 * 60 * 60) // 24 horas

    const descripcion = tipo === 'creditos'
      ? `Paquete de creditos ${plan.nombre} - Casaciones Web`
      : `Suscripcion plan ${plan.nombre} - Casaciones Web`

    const orden = await crearOrden({
      amount: solesToCentimos(plan.precio),
      currency_code: 'PEN',
      description: descripcion,
      order_number: orderNumber,
      client_details: {
        first_name: firstName,
        last_name: lastName,
        email: email || user.email || '',
        phone_number: '',
      },
      expiration_date: expiration,
      confirm: false,
    })

    // Guardar orden pendiente en la base de datos
    await supabase.from('pagos').insert({
      perfil_id: user.id,
      monto: plan.precio,
      moneda: 'PEN',
      estado: 'pendiente',
      metodo_pago: metodo,
      culqi_charge_id: orden.id,
      tipo,
      referencia_id: id,
      creditos_otorgados: tipo === 'creditos' ? plan.creditos : null,
    })

    return NextResponse.json({
      orderId: orden.id,
      qrCode: orden.qr_code,
      cipCode: orden.payment_code,
      expiration: orden.expiration_date,
    })
  } catch (err) {
    console.error('Error al crear orden:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
