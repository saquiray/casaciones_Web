'use client'

import { useState, useEffect, use } from 'react'
import Link from 'next/link'
import BotonPdf from '@/components/BotonPdf'
import { CasacionConEdicion } from '@/lib/types'

interface PageProps {
  params: Promise<{ id: string }>
}

export default function DetalleCasacion({ params }: PageProps) {
  const { id } = use(params)
  const [casacion, setCasacion] = useState<CasacionConEdicion | null>(null)
  const [cargando, setCargando] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [textoExpandido, setTextoExpandido] = useState(false)

  useEffect(() => {
    const cargar = async () => {
      try {
        const response = await fetch(`/api/casaciones/${id}`)
        if (!response.ok) {
          throw new Error('Casación no encontrada')
        }
        const data = await response.json()
        setCasacion(data)
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido')
      } finally {
        setCargando(false)
      }
    }
    cargar()
  }, [id])

  if (cargando) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="ml-3 text-gray-600">Cargando...</span>
      </div>
    )
  }

  if (error || !casacion) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center">
        <p className="text-red-600 mb-4">{error || 'Casación no encontrada'}</p>
        <Link href="/" className="text-blue-600 hover:underline">
          Volver al listado
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <Link
            href="/"
            className="inline-flex items-center text-sm text-blue-600 hover:text-blue-800 mb-4"
          >
            <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Volver al listado
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Casación N° {casacion.numero_casacion}
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                {casacion.tipo} - {casacion.distrito}
              </p>
            </div>
            <BotonPdf
              numeroCasacion={casacion.numero_casacion}
              tipo={casacion.tipo}
              sala={casacion.sala}
              materia={casacion.materia}
              textoCompleto={casacion.texto_completo}
              className="mt-2"
            />
          </div>
        </div>
      </header>

      {/* Content */}
      <main className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
        {/* Identificación */}
        <Section titulo="Identificación">
          <Campo label="Número de Casación" valor={casacion.numero_casacion} />
          <Campo label="Tipo" valor={casacion.tipo} />
          <Campo label="Distrito Judicial" valor={casacion.distrito} />
          <Campo label="Sala" valor={casacion.sala} />
          <Campo label="Código Final" valor={casacion.codigo_final} />
          <Campo label="Fecha de Publicación" valor={casacion.fecha_publicacion} />
          <Campo label="Edición" valor={casacion.numero_edicion} link={casacion.ediciones?.download_url} />
          <Campo label="Fecha de Resolución" valor={casacion.fecha_resolucion} />
        </Section>

        {/* Partes */}
        <Section titulo="Partes del Proceso">
          <Campo label="Demandante" valor={casacion.demandante} />
          <Campo label="Demandado" valor={casacion.demandado} />
          <Campo label="Instancia de Origen" valor={casacion.instancia_origen} />
          <Campo label="Vía Procedimental" valor={casacion.via_procedimental} />
        </Section>

        {/* Materia y Causales */}
        <Section titulo="Materia y Causales">
          <Campo label="Materia" valor={casacion.materia} />
          <Campo label="Causal de Casación" valor={casacion.causal_casacion} />
          <Campo label="Tipo de Infracción" valor={casacion.tipo_infraccion} />
          <Campo label="Norma Infringida" valor={casacion.norma_infringida} />
          <Campo label="Monto (S/)" valor={casacion.monto_soles} />
        </Section>

        {/* Fallo */}
        <Section titulo="Fallo">
          <Campo label="Resultado" valor={casacion.resultado} destacado />
          <Campo label="Reenvío" valor={casacion.reenvio} />
          <Campo label="Precedente Vinculante" valor={casacion.precedente_vinculante} />
          <Campo label="Pleno Casatorio" valor={casacion.pleno_casatorio ? 'Sí' : 'No'} />
        </Section>

        {/* Vocales */}
        <Section titulo="Vocales">
          <Campo label="Vocal Ponente" valor={casacion.vocal_ponente} />
          <Campo label="Vocales" valor={casacion.vocales?.replace(/;/g, ', ')} />
        </Section>

        {/* Sumilla */}
        {casacion.sumilla && (
          <Section titulo="Sumilla">
            <p className="text-gray-700 whitespace-pre-wrap">{casacion.sumilla}</p>
          </Section>
        )}

        {/* Texto Completo */}
        <Section titulo="Texto Completo">
          <div className="relative">
            <div
              className={`text-gray-700 whitespace-pre-wrap text-sm leading-relaxed overflow-hidden transition-all ${
                textoExpandido ? '' : 'max-h-96'
              }`}
            >
              {casacion.texto_completo || 'No disponible'}
            </div>
            {casacion.texto_completo && casacion.texto_completo.length > 1000 && (
              <>
                {!textoExpandido && (
                  <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-white to-transparent" />
                )}
                <button
                  onClick={() => setTextoExpandido(!textoExpandido)}
                  className="mt-4 text-blue-600 hover:text-blue-800 font-medium"
                >
                  {textoExpandido ? 'Ver menos' : 'Ver texto completo'}
                </button>
              </>
            )}
          </div>
        </Section>
      </main>
    </div>
  )
}

function Section({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h2 className="text-lg font-semibold text-gray-900 mb-4 pb-2 border-b border-gray-100">
        {titulo}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">{children}</div>
    </div>
  )
}

function Campo({
  label,
  valor,
  link,
  destacado,
}: {
  label: string
  valor?: string | null
  link?: string
  destacado?: boolean
}) {
  if (!valor) return null

  return (
    <div className="space-y-1">
      <dt className="text-sm font-medium text-gray-500">{label}</dt>
      <dd className={`text-sm ${destacado ? 'font-bold text-green-600' : 'text-gray-900'}`}>
        {link ? (
          <a href={link} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">
            {valor}
          </a>
        ) : (
          valor
        )}
      </dd>
    </div>
  )
}
