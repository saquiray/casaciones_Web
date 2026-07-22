import { createClient } from '@/lib/supabase-server'

/**
 * Devuelve el saldo de creditos actual del usuario.
 */
export async function obtenerCreditos(userId: string): Promise<number> {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('perfiles')
    .select('creditos')
    .eq('id', userId)
    .single()

  if (error || !data) return 0
  return data.creditos ?? 0
}

/**
 * Agrega creditos al usuario (por ejemplo, tras una compra confirmada por Culqi)
 * y deja registro en el historial. Devuelve el nuevo saldo.
 */
export async function agregarCreditos(
  userId: string,
  cantidad: number,
  descripcion: string,
  culqiChargeId?: string
): Promise<number> {
  const supabase = await createClient()

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('creditos')
    .eq('id', userId)
    .single()

  const saldoActual = perfil?.creditos ?? 0
  const nuevoSaldo = saldoActual + cantidad

  await supabase
    .from('perfiles')
    .update({ creditos: nuevoSaldo })
    .eq('id', userId)

  await supabase.from('creditos_historial').insert({
    perfil_id: userId,
    tipo: 'compra',
    cantidad,
    saldo_resultante: nuevoSaldo,
    descripcion,
    culqi_charge_id: culqiChargeId || null,
  })

  return nuevoSaldo
}

/**
 * Descuenta creditos del usuario por uso del aplicativo (por ejemplo, una consulta
 * que excede la cuota mensual gratuita del plan). Nunca deja el saldo en negativo.
 * Devuelve el nuevo saldo, o null si no habia creditos suficientes.
 */
export async function consumirCreditos(
  userId: string,
  cantidad: number,
  descripcion: string
): Promise<number | null> {
  const supabase = await createClient()

  const { data: perfil } = await supabase
    .from('perfiles')
    .select('creditos')
    .eq('id', userId)
    .single()

  const saldoActual = perfil?.creditos ?? 0

  if (saldoActual < cantidad) {
    return null
  }

  const nuevoSaldo = saldoActual - cantidad

  await supabase
    .from('perfiles')
    .update({ creditos: nuevoSaldo })
    .eq('id', userId)

  await supabase.from('creditos_historial').insert({
    perfil_id: userId,
    tipo: 'consumo',
    cantidad: -cantidad,
    saldo_resultante: nuevoSaldo,
    descripcion,
  })

  return nuevoSaldo
}
