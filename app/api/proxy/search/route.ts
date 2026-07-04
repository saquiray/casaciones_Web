import { NextRequest, NextResponse } from "next/server"

const API_BASE_URL = "http://143.244.163.112:3000"

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)

    const q = searchParams.get("q")
    const year = searchParams.get("year")

    const url = `${API_BASE_URL}/search/casaciones_separado?q=${q}&year=${year}`

    const res = await fetch(url)

    const data = await res.json()

    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "Proxy error", details: (error as Error).message },
      { status: 500 }
    )
  }
}