import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'

const CULQI_API_URL = 'https://api.culqi.com/v2'
const CULQI_SECRET_KEY = process.env.CULQI_SECRET_KEY || ''

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Verificar autenticación
    const supabaseAuth = await createClient()
    const { data: { user } } = await supabaseAuth.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: 'No autenticado' }, { status: 401 })
    }

    const { id: orderId } = await params

    if (!orderId) {
      return NextResponse.json({ error: 'ID de orden requerido' }, { status: 400 })
    }

    // Obtener orden de Culqi
    const response = await fetch(`${CULQI_API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${CULQI_SECRET_KEY}`,
        'Content-Type': 'application/json',
      },
    })

    const data = await response.json()

    if (!response.ok) {
      return NextResponse.json(
        { error: data.user_message || 'Error al obtener orden' },
        { status: response.status }
      )
    }

    return NextResponse.json({
      id: data.id,
      state: data.state,
      amount: data.amount,
      qrCode: data.qr_code,
      cipCode: data.payment_code,
      expiration: data.expiration_date,
    })
  } catch (err) {
    console.error('Error al obtener orden:', err)
    const errorMessage = err instanceof Error ? err.message : 'Error desconocido'
    return NextResponse.json({ error: errorMessage }, { status: 500 })
  }
}
