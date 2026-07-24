'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { createClient } from '@/lib/supabase-browser'

interface ModalUpgradeProps {
  isOpen: boolean
  onClose: () => void
  consultasUsadas: number
  consultasMax: number
}

interface Plan {
  id: string
  nombre: string
  precio: number
  consultas_mes: number
  descripcion: string | null
}

export default function ModalUpgrade({
  isOpen,
  onClose,
  consultasUsadas,
  consultasMax,
}: ModalUpgradeProps) {
  const [planes, setPlanes] = useState<Plan[]>([{ id: "d04d64e3-252e-4f59-bda4-fdf62fb83775", nombre: "Básico", precio: 29.9, consultas_mes: 100, descripcion: "" }, { id: "d6ffe19d-8cc5-4b7f-a27f-789c97aa35c5", nombre: "Profesional", precio: 59.9, consultas_mes: 500, descripcion: "" }, { id: "8e6d8c85-c9e4-4cfc-89a5-56df16e6f9a4", nombre: "Empresarial", precio: 99.9, consultas_mes: 1000, descripcion: "" }])
  const [loading, setLoading] = useState(false)


  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Fondo */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative w-full max-w-2xl rounded-2xl border border-slate-700 bg-slate-800 p-8 shadow-2xl">

          {/* Icono */}
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-amber-500/20">
            <svg
              className="h-8 w-8 text-amber-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
          </div>

          <h2 className="mb-2 text-center text-2xl font-bold text-white">
            Ya no tienes consultas disponibles
          </h2>

          <p className="mb-6 text-center text-slate-400">
            Has utilizado{' '}
            <span className="font-semibold text-white">
              {consultasUsadas}
            </span>{' '}
            de{' '}
            <span className="font-semibold text-white">
              {consultasMax}
            </span>{' '}
            consultas de tu cuenta.
          </p>

          {/* Barra */}
          <div className="mb-8 h-2 w-full rounded-full bg-slate-700">
            <div
              className="h-2 rounded-full bg-gradient-to-r from-amber-400 to-red-500"
              style={{ width: '100%' }}
            />
          </div>

          <h3 className="mb-4 text-lg font-semibold text-white">
            Planes disponibles
          </h3>

          {loading ? (
            <div className="flex justify-center py-10">
              <div className="h-10 w-10 animate-spin rounded-full border-2 border-amber-500/30 border-t-amber-500" />
            </div>
          ) : (
            <div className="space-y-4 mb-8">
              {planes.map((plan) => (
                <div
                  key={plan.id}
                  className="rounded-xl border border-slate-700 bg-slate-700/40 p-5"
                >
                  <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                    <div>
                      <h4 className="text-lg font-bold text-white">
                        {plan.nombre}
                      </h4>

                      <p className="mt-1 text-sm text-slate-400">
                        {plan.descripcion}
                      </p>

                      <p className="mt-2 text-sm text-amber-400 font-medium">
                        {plan.consultas_mes === -1
                          ? 'Consultas ilimitadas'
                          : `${plan.consultas_mes} consultas por mes`}
                      </p>
                    </div>

                    <div className="text-right">
                      <div className="text-3xl font-bold text-white">
                        S/{plan.precio}
                      </div>

                      <Link
                        href={`/checkout?plan=${plan.id}`}
                        className="mt-3 inline-block rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-5 py-2 text-sm font-semibold text-white hover:from-amber-400 hover:to-amber-500"
                      >
                        Comprar plan
                      </Link>
                    </div>
                  </div>
                </div>
              ))}

              {!loading && planes.length === 0 && (
                <div className="rounded-xl border border-slate-700 bg-slate-700/30 p-6 text-center text-slate-400">
                  No hay planes disponibles.
                </div>
              )}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 rounded-lg border border-slate-600 bg-slate-700/50 px-4 py-3 text-sm font-medium text-slate-300 hover:bg-slate-700"
            >
              Cerrar
            </button>

            <Link
              href="/precios"
              className="flex-1 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 px-4 py-3 text-center text-sm font-medium text-white hover:from-amber-400 hover:to-amber-500"
            >
              Ver todos los planes
            </Link>
          </div>

          <Link
            href="/precios#creditos"
            className="mt-4 block text-center text-sm text-emerald-400 hover:text-emerald-300"
          >
            ¿Prefieres no cambiar de plan? Compra un paquete de créditos.
          </Link>

          <p className="mt-4 text-center text-xs text-slate-500">
            Las consultas incluidas en tu plan se renuevan automáticamente cada
            mes.
          </p>
        </div>
      </div>
    </div>
  )
}