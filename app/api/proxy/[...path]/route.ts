import { NextRequest } from "next/server"

const BACKEND = "http://143.244.163.112:3000"

export async function GET(req: NextRequest, context: any) {
  const { path } = await context.params

  const url = new URL(req.url)
  const query = url.searchParams.toString()

  const targetUrl =
    `${BACKEND}/${path.join("/")}` +
    (query ? `?${query}` : "")

  const res = await fetch(targetUrl)

  const contentType = res.headers.get("content-type") || ""

  // 🔥 IMPORTANTE: NO asumir JSON
  if (contentType.includes("application/json")) {
    const data = await res.json()
    return Response.json(data)
  }

  // 🔥 PDF / HTML / archivos
  const buffer = await res.arrayBuffer()

  return new Response(buffer, {
    headers: {
      "Content-Type": contentType,
    },
  })
}