import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { verificarCuota } from '@/lib/uso'

export async function GET() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    return NextResponse.json({
      autenticado: false,
      permitido: false,
      consultasUsadas: 0,
      consultasMax: 10,
      planId: 'gratis'
    })
  }

  const cuota = await verificarCuota(user.id)

  return NextResponse.json({
    autenticado: true,
    ...cuota
  })
}
