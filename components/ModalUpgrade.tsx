'use client'

import Link from 'next/link'

interface ModalUpgradeProps {
  isOpen: boolean
  onClose: () => void
  consultasUsadas: number
  consultasMax: number
}

export default function ModalUpgrade({ isOpen, onClose, consultasUsadas, consultasMax }: ModalUpgradeProps) {
  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/70 backdrop-blur-sm transition-opacity"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="flex min-h-full items-center justify-center p-4">
        <div className="relative bg-slate-800 border border-slate-700/50 rounded-2xl shadow-2xl max-w-md w-full p-8 text-center">
          {/* Icon */}
          <div className="w-16 h-16 bg-amber-500/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg className="w-8 h-8 text-amber-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>

          <h2 className="text-2xl font-bold text-white mb-2">
            Consultas agotadas
          </h2>

          <p className="text-slate-400 mb-6">
            Has usado <span className="text-white font-semibold">{consultasUsadas}</span> de{' '}
            <span className="text-white font-semibold">{consultasMax}</span> consultas este mes.
            Actualiza tu plan para continuar buscando.
          </p>

          {/* Progress bar */}
          <div className="w-full bg-slate-700 rounded-full h-2 mb-6">
            <div
              className="bg-gradient-to-r from-amber-400 to-red-500 h-2 rounded-full"
              style={{ width: '100%' }}
            />
          </div>

          {/* Plans preview */}
          <div className="grid grid-cols-2 gap-3 mb-6">
            <div className="bg-slate-700/50 border border-slate-600/50 rounded-xl p-4">
              <div className="text-lg font-bold text-white">Basico</div>
              <div className="text-2xl font-bold text-amber-400">S/29</div>
              <div className="text-xs text-slate-400">100 consultas/mes</div>
            </div>
            <div className="bg-purple-500/10 border border-purple-500/30 rounded-xl p-4">
              <div className="text-lg font-bold text-white">Pro</div>
              <div className="text-2xl font-bold text-purple-400">S/79</div>
              <div className="text-xs text-slate-400">Ilimitadas</div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 px-4 py-3 text-sm font-medium text-slate-300 bg-slate-700/50 border border-slate-600/50 rounded-lg hover:bg-slate-700 transition-colors"
            >
              Cerrar
            </button>
            <Link
              href="/precios"
              className="flex-1 px-4 py-3 text-sm font-medium text-white bg-gradient-to-r from-amber-500 to-amber-600 rounded-lg hover:from-amber-400 hover:to-amber-500 transition-all shadow-lg shadow-amber-500/25"
            >
              Ver planes
            </Link>
          </div>

          {/* Info */}
          <p className="mt-4 text-xs text-slate-500">
            Las consultas se renuevan cada mes
          </p>
        </div>
      </div>
    </div>
  )
}
