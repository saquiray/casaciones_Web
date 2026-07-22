import { createClient } from '@/lib/supabase-server'
import { consumirCreditos } from '@/lib/creditos'

export interface PerfilConPlan {
  id: string
  email: string
  nombre: string | null
  plan_id: string
  consultas_usadas: number
  fecha_reset: string
  creditos: number
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
  creditos: number
  usaraCredito: boolean
}> {
  try {
    const perfil = await obtenerPerfil(userId)

    if (!perfil) {
      console.log('Perfil no encontrado para usuario:', userId)
      // Si no hay perfil, permitir acceso con plan gratis por defecto
      return { permitido: true, consultasUsadas: 0, consultasMax: 10, planId: 'gratis', creditos: 0, usaraCredito: false }
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
    const dentroDeCuota = esIlimitado || perfil.consultas_usadas < consultasMax
    const creditos = perfil.creditos ?? 0

    // Si ya se agoto la cuota mensual del plan, se puede seguir usando la app
    // consumiendo creditos comprados (paquetes de creditos)
    const usaraCredito = !dentroDeCuota && creditos > 0

    return {
      permitido: dentroDeCuota || usaraCredito,
      consultasUsadas: perfil.consultas_usadas,
      consultasMax: consultasMax,
      planId: perfil.plan_id,
      creditos,
      usaraCredito,
    }
  } catch (error) {
    console.error('Error en verificarCuota:', error)
    // En caso de error, permitir acceso para no bloquear al usuario
    return { permitido: true, consultasUsadas: 0, consultasMax: 10, planId: 'gratis', creditos: 0, usaraCredito: false }
  }
}

/**
 * Registra el uso de una consulta. Si el usuario ya agoto la cuota mensual de su
 * plan pero tiene creditos comprados, descuenta 1 credito en vez de bloquear el uso.
 */
export async function incrementarUso(userId: string): Promise<{
  consultasUsadas: number
  creditos: number
  usoConCredito: boolean
}> {
  const supabase = await createClient()
  const cuota = await verificarCuota(userId)

  if (cuota.usaraCredito) {
    const nuevoSaldo = await consumirCreditos(userId, 1, 'Consulta de casacion')
    return {
      consultasUsadas: cuota.consultasUsadas,
      creditos: nuevoSaldo ?? cuota.creditos,
      usoConCredito: true,
    }
  }

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

  return {
    consultasUsadas: nuevasConsultas,
    creditos: cuota.creditos,
    usoConCredito: false,
  }
}
