import { createClient } from '@/lib/supabase-server'

export interface PerfilConPlan {
  id: string
  email: string
  nombre: string | null
  plan_id: string
  consultas_usadas: number
  fecha_reset: string
  planes: {
    consultas_mes: number
  }
}

export async function obtenerPerfil(userId: string): Promise<PerfilConPlan | null> {
  try {
    const supabase = await createClient()

    const { data, error } = await supabase
      .from('perfiles')
      .select(`
        *,
        planes (
          consultas_mes
        )
      `)
      .eq('id', userId)
      .single()

    if (error) {
      console.error('Error obteniendo perfil:', error)
      return null
    }

    return data
  } catch (error) {
    console.error('Error en obtenerPerfil:', error)
    return null
  }
}

export async function verificarCuota(userId: string): Promise<{
  permitido: boolean
  consultasUsadas: number
  consultasMax: number
  planId: string
}> {
  try {
    const perfil = await obtenerPerfil(userId)

    if (!perfil) {
      console.log('Perfil no encontrado para usuario:', userId)
      // Si no hay perfil, permitir acceso con plan gratis por defecto
      return { permitido: true, consultasUsadas: 0, consultasMax: 10, planId: 'gratis' }
    }

    // Verificar si hay que resetear el contador (nuevo mes)
    const fechaReset = new Date(perfil.fecha_reset)
    const ahora = new Date()
    const inicioMes = new Date(ahora.getFullYear(), ahora.getMonth(), 1)

    if (fechaReset < inicioMes) {
      // Resetear contador
      const supabase = await createClient()
      await supabase
        .from('perfiles')
        .update({
          consultas_usadas: 0,
          fecha_reset: ahora.toISOString().split('T')[0]
        })
        .eq('id', userId)

      perfil.consultas_usadas = 0
    }

    // Si no hay relación con planes, usar valores por defecto según plan_id
    let consultasMax = 10 // default gratis
    if (perfil.planes?.consultas_mes !== undefined) {
      consultasMax = perfil.planes.consultas_mes
    } else if (perfil.plan_id === 'profesional') {
      consultasMax = -1
    } else if (perfil.plan_id === 'basico') {
      consultasMax = 100
    }

    const esIlimitado = consultasMax === -1

    return {
      permitido: esIlimitado || perfil.consultas_usadas < consultasMax,
      consultasUsadas: perfil.consultas_usadas,
      consultasMax: consultasMax,
      planId: perfil.plan_id
    }
  } catch (error) {
    console.error('Error en verificarCuota:', error)
    // En caso de error, permitir acceso para no bloquear al usuario
    return { permitido: true, consultasUsadas: 0, consultasMax: 10, planId: 'gratis' }
  }
}

export async function incrementarUso(userId: string): Promise<number> {
  const supabase = await createClient()

  const { data } = await supabase
    .from('perfiles')
    .select('consultas_usadas')
    .eq('id', userId)
    .single()

  const nuevasConsultas = (data?.consultas_usadas ?? 0) + 1

  await supabase
    .from('perfiles')
    .update({ consultas_usadas: nuevasConsultas })
    .eq('id', userId)

  return nuevasConsultas
}
