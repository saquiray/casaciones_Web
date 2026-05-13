'use client'

import { FiltrosState } from '@/lib/types'

interface FiltrosBarProps {
  filtros: FiltrosState
  onChange: (filtros: FiltrosState) => void
  onBuscar: () => void
}

/*const TIPOS = [
  { value: '', label: 'Todos' },
  { value: 'CIV', label: 'Civil' },
  { value: 'LAB', label: 'Laboral' },
  { value: 'PREV', label: 'Previsional' },
]*/

const ANIOS = [
  { value: '', label: 'Todos' },
  ...Array.from({ length: new Date().getFullYear() - 2012 }, (_, i) => {
    const year = new Date().getFullYear() - i
    return { value: year.toString(), label: year.toString() }
  })
]

const MESES = [
  { value: '', label: 'Todos' },
  { value: 'Enero', label: 'Ene' },
  { value: 'Febrero', label: 'Feb' },
  { value: 'Marzo', label: 'Mar' },
  { value: 'Abril', label: 'Abr' },
  { value: 'Mayo', label: 'May' },
  { value: 'Junio', label: 'Jun' },
  { value: 'Julio', label: 'Jul' },
  { value: 'Agosto', label: 'Ago' },
  { value: 'Septiembre', label: 'Sep' },
  { value: 'Octubre', label: 'Oct' },
  { value: 'Noviembre', label: 'Nov' },
  { value: 'Diciembre', label: 'Dic' },
]

export default function FiltrosBar({ filtros, onChange, onBuscar }: FiltrosBarProps) {
  const handleChange = (campo: keyof FiltrosState, valor: string) => {
    onChange({ ...filtros, [campo]: valor })
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      onBuscar()
    }
  }

  const inputClass = "w-full px-3 py-2 text-sm bg-slate-700/50 border border-slate-600/50 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-amber-500/50 focus:border-amber-500/50 transition-all"
  const labelClass = "block text-xs font-medium text-slate-400 mb-1.5"

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-xl p-4 mb-6">
      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-8 gap-3">
        {/* Busqueda libre */}
        <div className="col-span-2">
          <label className={labelClass}>
            Busqueda
          </label>
          <div className="relative">
            <input
              type="text"
              value={filtros.busqueda}
              onChange={(e) => handleChange('busqueda', e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="N°, materia, vocal..."
              className={inputClass + " pl-9"}
            />
            <svg className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        {/* Ano */}
        <div>
          <label className={labelClass}>
            Ano
          </label>
          <select
            value={filtros.anio}
            onChange={(e) => handleChange('anio', e.target.value)}
            className={inputClass + " cursor-pointer"}
          >
            {ANIOS.map((a) => (
              <option key={a.value} value={a.value} className="bg-slate-800">
                {a.label}
              </option>
            ))}
          </select>
        </div>

        {/* Mes */}
        <div>
          <label className={labelClass}>
            Mes
          </label>
          <select
            value={filtros.mes}
            onChange={(e) => handleChange('mes', e.target.value)}
            className={inputClass + " cursor-pointer"}
          >
            {MESES.map((m) => (
              <option key={m.value} value={m.value} className="bg-slate-800">
                {m.label}
              </option>
            ))}
          </select>
        </div>

        {/* Boton buscar */}
        <div className="flex items-end">
          <button
            onClick={onBuscar}
            className="w-full px-4 py-2 text-sm bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-white font-medium rounded-lg transition-all duration-200 shadow-lg shadow-amber-500/25 hover:shadow-amber-500/40 flex items-center justify-center gap-2"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            Buscar
          </button>
        </div>
      </div>
    </div>
  )
}
