export default function LoadingSpinner({ size = 'md', text }) {
  const sizes = {
    sm: 'w-4 h-4 border-2',
    md: 'w-8 h-8 border-2',
    lg: 'w-12 h-12 border-3',
    xl: 'w-16 h-16 border-4',
  }

  return (
    <div className="flex flex-col items-center justify-center gap-3">
      <div className={`
        ${sizes[size]}
        border-primary-200 border-t-primary-600
        rounded-full animate-spin
        dark:border-primary-800 dark:border-t-primary-400
      `} />
      {text && <p className="text-sm text-slate-500 dark:text-slate-400 animate-pulse">{text}</p>}
    </div>
  )
}

// Full page loader
export function PageLoader({ text = 'กำลังโหลด...' }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-50 dark:bg-slate-900">
      <div className="flex flex-col items-center gap-6">
        {/* Logo */}
        <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-700 rounded-2xl flex items-center justify-center shadow-card-hover">
          <span className="text-white text-3xl font-bold">S</span>
        </div>
        <LoadingSpinner size="lg" />
        <div className="text-center">
          <p className="font-semibold text-slate-700 dark:text-slate-200 text-lg">SmartSave</p>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{text}</p>
        </div>
      </div>
    </div>
  )
}
