import { useState, useEffect, createContext, useContext, useCallback } from 'react'
import { CheckCircleIcon, XCircleIcon, ExclamationTriangleIcon, InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/solid'

const ToastContext = createContext(null)

const ICONS = {
  success: <CheckCircleIcon className="w-5 h-5 text-success-500" />,
  error:   <XCircleIcon className="w-5 h-5 text-danger-500" />,
  warning: <ExclamationTriangleIcon className="w-5 h-5 text-warning-500" />,
  info:    <InformationCircleIcon className="w-5 h-5 text-primary-500" />,
}

const BORDERS = {
  success: 'border-l-success-500',
  error:   'border-l-danger-500',
  warning: 'border-l-warning-500',
  info:    'border-l-primary-500',
}

function ToastItem({ toast, onRemove }) {
  useEffect(() => {
    const timer = setTimeout(() => onRemove(toast.id), toast.duration || 3500)
    return () => clearTimeout(timer)
  }, [toast.id, toast.duration, onRemove])

  return (
    <div className={`
      toast-enter flex items-start gap-3 px-4 py-3.5
      bg-white dark:bg-slate-800 rounded-2xl shadow-modal
      border border-slate-100 dark:border-slate-700
      border-l-4 ${BORDERS[toast.type] || BORDERS.info}
      min-w-[280px] max-w-sm
    `}>
      <div className="flex-shrink-0 mt-0.5">{ICONS[toast.type] || ICONS.info}</div>
      <div className="flex-1 min-w-0">
        {toast.title && <p className="font-semibold text-sm text-slate-800 dark:text-slate-100">{toast.title}</p>}
        <p className="text-sm text-slate-600 dark:text-slate-300">{toast.message}</p>
      </div>
      <button
        onClick={() => onRemove(toast.id)}
        className="flex-shrink-0 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors"
      >
        <XMarkIcon className="w-4 h-4" />
      </button>
    </div>
  )
}

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([])

  const addToast = useCallback(({ type = 'info', title, message, duration = 3500 }) => {
    const id = Date.now() + Math.random()
    setToasts(prev => [...prev, { id, type, title, message, duration }])
  }, [])

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id))
  }, [])

  const toast = {
    success: (message, title) => addToast({ type: 'success', title, message }),
    error:   (message, title) => addToast({ type: 'error', title, message }),
    warning: (message, title) => addToast({ type: 'warning', title, message }),
    info:    (message, title) => addToast({ type: 'info', title, message }),
  }

  return (
    <ToastContext.Provider value={toast}>
      {children}
      {/* Toast Container */}
      <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2 sm:bottom-6 sm:right-6">
        {toasts.map(t => (
          <ToastItem key={t.id} toast={t} onRemove={removeToast} />
        ))}
      </div>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const ctx = useContext(ToastContext)
  if (!ctx) throw new Error('useToast must be used within ToastProvider')
  return ctx
}
