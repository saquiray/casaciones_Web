import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

export async function POST() {
  try {
    const supabase = await createClient()

    // Obtener usuario autenticado
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      return NextResponse.json(
        { error: 'No autenticado' },
        { status: 401 }
      )
    }

    // Obtener consultas usadas actuales
    const { data: perfil, error: perfilError } = await supabase
      .from('perfiles')
      .select('consultas_usadas')
      .eq('id', user.id)
      .single()

    if (perfilError || !perfil) {
      return NextResponse.json(
        { error: 'Perfil no encontrado' },
        { status: 404 }
      )
    }

    const consultasUsadas = perfil.consultas_usadas ?? 0

    // Incrementar consultas usadas
    const { error: updateError } = await supabase
      .from('perfiles')
      .update({
        consultas_usadas: consultasUsadas + 1,
      })
      .eq('id', user.id)

    if (updateError) {
      console.error(updateError)

      return NextResponse.json(
        { error: 'No se pudo actualizar el perfil' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      consultas_usadas: consultasUsadas + 1,
    })
  } catch (error) {
    console.error(error)

    return NextResponse.json(
      { error: 'Error interno del servidor' },
      { status: 500 }
    )
  }
}