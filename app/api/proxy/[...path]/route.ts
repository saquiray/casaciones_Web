import { NextRequest } from "next/server"

const BACKEND = "http://143.244.163.112:3000"

type Context = {
  params: Promise<{ path: string[] }>
}

export async function GET(req: NextRequest, context: Context): Promise<Response> {
  const { path } = await context.params

  const url = new URL(req.url)
  const query = url.searchParams.toString()

  const targetUrl =
    `${BACKEND}/${path.join("/")}` +
    (query ? `?${query}` : "")

  const res = await fetch(targetUrl)

  const contentType = res.headers.get("content-type") || ""

  if (contentType.includes("application/json")) {
    const data = await res.json()
    return Response.json(data)
  }

  const buffer = await res.arrayBuffer()

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
    },
  })
}