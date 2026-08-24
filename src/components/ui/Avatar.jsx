import { getInitials, getAvatarColor } from '../../utils/formatters'

export default function Avatar({ name = '', src, size = 'md', className = '' }) {
  const sizes = {
    xs:  'w-7 h-7 text-xs',
    sm:  'w-9 h-9 text-sm',
    md:  'w-11 h-11 text-base',
    lg:  'w-14 h-14 text-lg',
    xl:  'w-20 h-20 text-2xl',
  }

  const sizeClass = sizes[size] || sizes.md

  if (src) {
    return (
      <img
        src={src}
        alt={name}
        className={`${sizeClass} rounded-full object-cover ring-2 ring-white dark:ring-slate-700 flex-shrink-0 ${className}`}
        onError={(e) => { e.target.style.display = 'none' }}
      />
    )
  }

  const colorClass = getAvatarColor(name)
  const initials = getInitials(name)

  return (
    <div className={`
      ${sizeClass} ${colorClass}
      rounded-full flex items-center justify-center
      text-white font-bold flex-shrink-0
      ring-2 ring-white dark:ring-slate-700
      ${className}
    `}>
      {initials}
    </div>
  )
}
