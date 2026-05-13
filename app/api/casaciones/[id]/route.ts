import { NextRequest, NextResponse } from 'next/server'

// 🔥 Nuevo backend
const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL || '/api/proxy'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params

    // 🔥 Consultar nuevo endpoint
    const response = await fetch(
      `${API_BASE_URL}/document/${id}`
    )

    if (!response.ok) {
      return NextResponse.json(
        { error: 'Documento no encontrado' },
        { status: 404 }
      )
    }

    const doc = await response.json()

    // 🔥 Adaptar al formato viejo del frontend
    const data = {
      id: doc.id,
      numero_casacion: doc.titulo,
      fecha_publicacion: doc.fecha || null,

      ediciones: {
        id: doc.id,
        numero_edicion: doc.numero_edicion || null,
        fecha_publicacion: doc.fecha || null,

        // 🔥 URL para visualizar/descargar PDF
        download_url: `${API_BASE_URL}${doc.url_pdf}`,
      },

      raw: doc,
    }

    return NextResponse.json(data)
  } catch (err) {
    const errorMessage =
      err instanceof Error ? err.message : 'Error desconocido'

    console.error('Error obteniendo documento:', err)

    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    )
  }
}