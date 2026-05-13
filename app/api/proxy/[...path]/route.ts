import { NextRequest, NextResponse } from "next/server"

const BACKEND = "http://143.244.163.112:3000"

type Context = {
  params: Promise<{ path: string[] }>
}

export async function GET(req: NextRequest, context: Context) {
  try {
    const { path } = await context.params

    const url = new URL(req.url)
    const queryString = url.searchParams.toString()

    const targetUrl =
      `${BACKEND}/${path.join("/")}` +
      (queryString ? `?${queryString}` : "")

    const res = await fetch(targetUrl)
    const data = await res.json()

    return NextResponse.json(data)
  } catch (error: unknown) {
    return NextResponse.json(
      { error: "proxy failed", details: (error as Error).message },
      { status: 500 }
    )
  }
}