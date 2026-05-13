'use client'

interface CasacionFila {
  id: string
  titulo: string
  contenido?: string
  pagina: number
  chunk: number
  mes: string
  anio: string
  score: number
  url_pdf: string

  highlight?: {
    contenido?: string[]
  }
}

interface TablaCasacionesProps {
  casaciones: CasacionFila[]
  cargando: boolean
  busqueda: string
  onVerDetalle?: (id: string) => void
}

export default function TablaCasaciones({
  casaciones,
  cargando,
  busqueda,
}: TablaCasacionesProps) {

  if (cargando) {
    return (
      <div className="flex items-center justify-center py-16">
        <div className="flex flex-col items-center gap-3">
          <div className="animate-spin rounded-full h-8 w-8 border-2 border-amber-500/30 border-t-amber-500"></div>

          <span className="text-slate-400 text-sm">
            Buscando documentos...
          </span>
        </div>
      </div>
    )
  }

  if (casaciones.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <p className="text-slate-400 text-sm">
          No se encontraron resultados.
        </p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-sm">

        <thead>
          <tr className="border-b border-slate-700/50">

            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Documento
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Página
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Fecha
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Coincidencia
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              Score
            </th>

            <th className="px-4 py-3 text-left text-xs font-semibold text-slate-300 uppercase">
              PDF
            </th>

          </tr>
        </thead>

        <tbody className="divide-y divide-slate-700/30">
          {casaciones.map((casacion, index) => (

            <tr
              key={`${casacion.id}-${index}`}
              className="hover:bg-slate-700/20 transition-colors align-top"
            >

              {/* DOCUMENTO */}
              <td className="px-4 py-4 min-w-[220px]">
                <div className="flex flex-col gap-1">

                  <span className="font-semibold text-white text-sm break-all">
                    {casacion.titulo}
                  </span>

                  <span className="text-xs text-slate-500">
                    Chunk #{casacion.chunk}
                  </span>

                </div>
              </td>

              {/* PAGINA */}
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-slate-300 text-sm">
                  {casacion.pagina}
                </span>
              </td>

              {/* FECHA */}
              <td className="px-4 py-4 whitespace-nowrap">
                <span className="text-slate-300 text-sm">
                  {casacion.mes} {casacion.anio}
                </span>
              </td>

              {/* HIGHLIGHT */}
              <td className="px-4 py-4 min-w-[500px]">

                {casacion.highlight?.contenido?.length ? (

                  <div className="space-y-2">

                    {casacion.highlight.contenido.map((texto, i) => (

                      <div
                        key={i}
                        className="text-sm text-slate-300 leading-6 bg-slate-900/40 border border-slate-700/30 rounded-lg p-3"
                        dangerouslySetInnerHTML={{
                          __html: texto,
                        }}
                      />

                    ))}

                  </div>

                ) : (

                  <p className="text-slate-500 text-sm">
                    Sin preview
                  </p>

                )}

              </td>

              {/* SCORE */}
              <td className="px-4 py-4 whitespace-nowrap">

                <span className="inline-flex px-2 py-1 rounded-lg bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
                  {casacion.score?.toFixed(2)}
                </span>

              </td>

              {/* PDF */}
              <td className="px-4 py-4 whitespace-nowrap">

                <div className="flex items-center gap-2">

                  {/* 👁️ VER PDF EN PAGINA */}
                  <a
                    href={`/api/proxy/pdfjs/web/viewer.html?file=/api/proxy${casacion.url_pdf}#page=${casacion.pagina}&search=${encodeURIComponent(busqueda)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Ver PDF
                  </a>

                  {/* ⬇️ DESCARGAR */}
                  <a
                    href={`/api/proxy${casacion.url_pdf}`}
                    download
                    className="inline-flex items-center gap-1 px-3 py-2 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors"
                  >
                    Descargar
                  </a>

                </div>

              </td>

            </tr>

          ))}
        </tbody>

      </table>
    </div>
  )
}