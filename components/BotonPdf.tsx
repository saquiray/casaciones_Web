'use client'

import { useState } from 'react'
import { jsPDF } from 'jspdf'

interface BotonPdfProps {
  casacionId?: number
  numeroCasacion: string
  tipo: string
  sala: string
  materia: string
  textoCompleto?: string
  className?: string
}

export default function BotonPdf({
  casacionId,
  numeroCasacion,
  tipo,
  sala,
  materia,
  textoCompleto,
  className = '',
}: BotonPdfProps) {
  const [generando, setGenerando] = useState(false)

  const generarPdf = async () => {
    setGenerando(true)
    try {
      let texto = textoCompleto

      // Si no hay texto y hay ID, cargar desde la API
      if (!texto && casacionId) {
        const response = await fetch(`/api/casaciones/${casacionId}`)
        if (response.ok) {
          const data = await response.json()
          texto = data.texto_completo
        }
      }

      const doc = new jsPDF()
      const margenIzq = 20
      const margenDer = 20
      const anchoUtil = doc.internal.pageSize.getWidth() - margenIzq - margenDer
      let y = 20

      // Título
      doc.setFontSize(14)
      doc.setFont('helvetica', 'bold')
      doc.text(`CASACION N ${numeroCasacion}`, margenIzq, y)
      y += 8

      // Subtítulo
      doc.setFontSize(10)
      doc.setFont('helvetica', 'normal')
      doc.text(`${tipo} - ${sala}`, margenIzq, y)
      y += 6
      doc.text(`Materia: ${materia}`, margenIzq, y)
      y += 10

      // Línea separadora
      doc.setDrawColor(200)
      doc.line(margenIzq, y, doc.internal.pageSize.getWidth() - margenDer, y)
      y += 8

      // Texto completo - dividir en párrafos y justificar
      doc.setFontSize(9)
      const contenido = texto || 'Texto no disponible'
      const alturaLinea = 4
      const alturaPagina = doc.internal.pageSize.getHeight()
      const margenInferior = 20

      // Función para imprimir línea justificada manualmente
      const imprimirLineaJustificada = (linea: string, xInicio: number, yPos: number, ancho: number) => {
        const palabras = linea.split(' ').filter(p => p.length > 0)
        if (palabras.length <= 1) {
          doc.text(linea, xInicio, yPos)
          return
        }

        const anchoTexto = doc.getTextWidth(linea)
        const espacioExtra = ancho - anchoTexto
        const espacioEntrePalabras = espacioExtra / (palabras.length - 1)

        let xActual = xInicio
        for (let i = 0; i < palabras.length; i++) {
          doc.text(palabras[i], xActual, yPos)
          xActual += doc.getTextWidth(palabras[i]) + doc.getTextWidth(' ') + espacioEntrePalabras
        }
      }

      // Dividir en párrafos (por 2+ saltos de línea)
      const parrafos = contenido
        .split(/\n{2,}/)
        .map(p => p.replace(/\n/g, ' ').trim())
        .filter(p => p.length > 0)

      for (const parrafo of parrafos) {
        // Dividir el párrafo en líneas que caben en el ancho
        const lineas = doc.splitTextToSize(parrafo, anchoUtil)

        for (let i = 0; i < lineas.length; i++) {
          // Salto de página si no cabe
          if (y + alturaLinea > alturaPagina - margenInferior) {
            doc.addPage()
            y = 20
          }

          // Última línea del párrafo: sin justificar
          const esUltimaLinea = i === lineas.length - 1
          if (esUltimaLinea) {
            doc.text(lineas[i], margenIzq, y)
          } else {
            imprimirLineaJustificada(lineas[i], margenIzq, y, anchoUtil)
          }

          y += alturaLinea
        }

        y += 2 // Espacio extra entre párrafos
      }

      // Descargar
      doc.save(`Casacion_${numeroCasacion.replace(/\//g, '-')}.pdf`)
    } catch (error) {
      console.error('Error al generar PDF:', error)
      alert('Error al generar el PDF')
    } finally {
      setGenerando(false)
    }
  }

  return (
    <button
      onClick={generarPdf}
      disabled={generando}
      className={`inline-flex items-center gap-1 px-2.5 py-1.5 text-xs font-medium text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 rounded-lg hover:bg-emerald-500/20 transition-colors disabled:opacity-50 ${className}`}
      title="Descargar PDF"
    >
      {generando ? (
        <div className="animate-spin rounded-full h-3.5 w-3.5 border-2 border-emerald-400/30 border-t-emerald-400"></div>
      ) : (
        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      )}
    </button>
  )
}
