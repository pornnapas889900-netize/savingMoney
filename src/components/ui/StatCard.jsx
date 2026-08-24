import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

export default function StatCard({ icon, label, value, subValue, trend, trendLabel, color = 'primary', onClick }) {
  const colorMap = {
    primary: {
      bg: 'from-primary-500 to-primary-700',
      icon: 'bg-white/20',
      badge: 'bg-white/15 text-white',
    },
    success: {
      bg: 'from-success-500 to-emerald-600',
      icon: 'bg-white/20',
      badge: 'bg-white/15 text-white',
    },
    danger: {
      bg: 'from-danger-500 to-rose-600',
      icon: 'bg-white/20',
      badge: 'bg-white/15 text-white',
    },
    warning: {
      bg: 'from-warning-500 to-amber-600',
      icon: 'bg-white/20',
      badge: 'bg-white/15 text-white',
    },
    purple: {
      bg: 'from-purple-500 to-violet-600',
      icon: 'bg-white/20',
      badge: 'bg-white/15 text-white',
    },
    teal: {
      bg: 'from-teal-500 to-cyan-600',
      icon: 'bg-white/20',
      badge: 'bg-white/15 text-white',
    },
  }

  const c = colorMap[color] || colorMap.primary

  return (
    <div
      className={`
        relative overflow-hidden rounded-2xl p-5 text-white cursor-default
        bg-gradient-to-br ${c.bg} shadow-card
        transition-transform duration-200 hover:scale-[1.02] hover:shadow-card-hover
        ${onClick ? 'cursor-pointer' : ''}
      `}
      onClick={onClick}
    >
      {/* Background decoration */}
      <div className="absolute -right-6 -top-6 w-28 h-28 rounded-full bg-white/10" />
      <div className="absolute -right-2 bottom-0 w-20 h-20 rounded-full bg-white/5" />

      <div className="relative z-10 flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm text-white/80 font-medium mb-1">{label}</p>
          <p className="text-2xl font-bold tracking-tight">{value}</p>
          {subValue && <p className="text-xs text-white/70 mt-0.5">{subValue}</p>}
        </div>
        {icon && (
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center flex-shrink-0 ${c.icon}`}>
            {icon}
          </div>
        )}
      </div>

      {/* Trend / badge */}
      {(trend !== undefined || trendLabel) && (
        <div className="relative z-10 mt-3 flex items-center gap-1.5">
          {trend !== undefined && (
            <span className={`flex items-center gap-0.5 text-xs font-semibold px-2 py-0.5 rounded-full ${c.badge}`}>
              {trend >= 0
                ? <ArrowUpIcon className="w-3 h-3" />
                : <ArrowDownIcon className="w-3 h-3" />}
              {Math.abs(trend)}%
            </span>
          )}
          {trendLabel && <span className="text-xs text-white/70">{trendLabel}</span>}
        </div>
      )}
    </div>
  )
}

// Skeleton loader สำหรับ StatCard
export function StatCardSkeleton() {
  return (
    <div className="rounded-2xl p-5 shimmer h-[120px]" />
  )
}
