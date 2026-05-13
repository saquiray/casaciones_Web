import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { supabase } from '@/lib/supabase'
import { cancelarSuscripcion } from '@/lib/culqi'

// DELETE - Cancelar suscripcion
export async function DELETE(request: NextRequest) {
  try {
    // Verificar autenticación
    const supabaseAuth = await createClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const body = await request.json()
    const { suscripcionId } = body

    if (!suscripcionId) {
      return NextResponse.json({ error: 'ID de suscripcion requerido' }, { status: 400 })
    }

    // Verificar que la suscripcion pertenece al usuario
    const { data: suscripcion } = await supabase
      .from('suscripciones')
      .select('*')
      .eq('id', suscripcionId)
      .eq('perfil_id', user.id)
      .single()

    if (!suscripcion) {
      return NextResponse.json({ error: 'Suscripcion no encontrada' }, { status: 404 })
    }

    // Cancelar en Culqi si tiene ID
    if (suscripcion.culqi_subscription_id) {
      try {
        await cancelarSuscripcion(suscripcion.culqi_subscription_id)
      } catch (err) {
        console.error('Error al cancelar en Culqi:', err)
        // Continuar aunque falle en Culqi
      }
    }

    // Actualizar estado en base de datos
    await supabase
      .from('suscripciones')
      .update({ estado: 'cancelada' })
      .eq('id', suscripcionId)

    // El plan se mantiene activo hasta fecha_fin
    // Pero si no hay fecha_fin, cambiar a gratis inmediatamente
    if (!suscripcion.fecha_fin || new Date(suscripcion.fecha_fin) <= new Date()) {
      await supabase
        .from('perfiles')
        .update({ plan_id: 'gratis' })
        .eq('id', user.id)
    }

    return NextResponse.json({ success: true })
  } catch (err) {
    console.error('Error al cancelar suscripcion:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
