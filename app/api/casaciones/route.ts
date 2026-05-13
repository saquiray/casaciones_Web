import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase-server'
import { verificarCuota, incrementarUso } from '@/lib/uso'

type DocCasacion = {
  id?: string
  titulo?: string
  fecha?: string
  url_pdf?: string
}
// 🔥 Backend API
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ||
  'http://143.244.163.112:3000'

// 🔥 Auth opcional
const AUTH_REQUIRED =
  process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true'

export async function GET(
  request: NextRequest
) {

  try {

    let userId: string | null = null

    // 🔐 Auth opcional
    if (AUTH_REQUIRED) {

      const supabaseAuth =
        await createClient()

      const {
        data: { user },
      } =
        await supabaseAuth.auth.getUser()

      if (!user) {

        return NextResponse.json(
          {
            error: 'No autenticado',
            requireAuth: true,
          },
          { status: 401 }
        )
      }

      userId = user.id

      const cuota =
        await verificarCuota(user.id)

      if (!cuota.permitido) {

        return NextResponse.json(
          {
            error: 'Cuota agotada',
            requireUpgrade: true,

            consultasUsadas:
              cuota.consultasUsadas,

            consultasMax:
              cuota.consultasMax,

            planId:
              cuota.planId,
          },
          { status: 402 }
        )
      }
    }

    const searchParams =
      request.nextUrl.searchParams

    const busqueda =
      searchParams.get('busqueda') || ''

    const anio =
      searchParams.get('anio') || ''

    const mes =
      searchParams.get('mes') || ''

    const pagina =
      parseInt(
        searchParams.get('pagina') || '1'
      )

    // 🔥 NUEVO
    const origen =
      searchParams.get('origen') ||
      'casaciones'

    // 🔥 construir params backend
    const params =
      new URLSearchParams()

    if (busqueda) {
      params.append('q', busqueda)
    }

    if (anio) {
      params.append('year', anio)
    }

    if (mes) {
      params.append('month', mes)
    }

    // 🔥 endpoint dinámico
    const endpoint =
      origen === 'sentencias'
        ? 'searchsentencias'
        : 'search/casaciones_nuevo'

    console.log(
      'Consulta API:',
      `${API_BASE_URL}/${endpoint}?${params.toString()}`
    )

    // 🔥 consultar backend
    const response = await fetch(
      `${API_BASE_URL}/${endpoint}?${params.toString()}`
    )

    if (!response.ok) {

      throw new Error(
        'Error consultando backend'
      )
    }

    const data =
      await response.json()

    // 🔥 incrementar uso
    if (
      AUTH_REQUIRED &&
      userId
    ) {

      await incrementarUso(
        userId
      )
    }

    // 🔥 adaptar formato
    const casaciones =
      (data.results || []).map(
        (
          doc: DocCasacion,
          index: number
        ) => ({

          id:
            doc.id || index,

          numero_casacion:
            doc.titulo,

          fecha_publicacion:
            doc.fecha || null,

          ediciones: {

            download_url:
              'http://143.244.163.112:3000' +
              doc.url_pdf,
          },

          raw: doc,
        })
      )

    return NextResponse.json({

      origen,

      casaciones,

      total:
        data.results?.length || 0,

      pagina,

      porPagina: 50,

      totalPaginas: 1,
    })

  } catch (err) {

    const errorMessage =
      err instanceof Error
        ? err.message
        : 'Error desconocido'

    console.error(
      'Error en API:',
      err
    )

    return NextResponse.json(
      {
        error: errorMessage
      },
      {
        status: 500
      }
    )
  }
}