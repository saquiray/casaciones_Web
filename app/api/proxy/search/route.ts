import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://134.122.118.168:3000"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const q = searchParams.get("q")
    const year = searchParams.get("anio")
    const pagina = searchParams.get("pagina")

    const url = `${API_BASE_URL}/search?q=${q}&anio=${year}&pagina=${pagina}`

    const res = await fetch(url)

    const data = await res.json()
    console.log("url:", url)
    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Proxy error", details: (error as Error).message },
      { status: 500 }
    )
  }
}