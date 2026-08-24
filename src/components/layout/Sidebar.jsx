import { NavLink, useLocation } from 'react-router-dom'
import {
  HomeIcon, UsersIcon, ArrowDownTrayIcon, ArrowUpTrayIcon,
  ClockIcon, ChartBarIcon, Cog6ToothIcon
} from '@heroicons/react/24/outline'
import {
  HomeIcon as HomeIconSolid, UsersIcon as UsersIconSolid,
  ArrowDownTrayIcon as ArrowDownTrayIconSolid, ArrowUpTrayIcon as ArrowUpTrayIconSolid,
  ClockIcon as ClockIconSolid, ChartBarIcon as ChartBarIconSolid,
} from '@heroicons/react/24/solid'

const navItems = [
  { to: '/',          label: 'หน้าหลัก',    Icon: HomeIcon,          IconActive: HomeIconSolid },
  { to: '/members',   label: 'สมาชิก',       Icon: UsersIcon,         IconActive: UsersIconSolid },
  { to: '/deposit',   label: 'ฝากเงิน',      Icon: ArrowDownTrayIcon, IconActive: ArrowDownTrayIconSolid },
  { to: '/withdraw',  label: 'ถอนเงิน',      Icon: ArrowUpTrayIcon,   IconActive: ArrowUpTrayIconSolid },
  { to: '/history',   label: 'ประวัติ',       Icon: ClockIcon,         IconActive: ClockIconSolid },
  { to: '/reports',   label: 'รายงาน',       Icon: ChartBarIcon,      IconActive: ChartBarIconSolid },
]

export default function Sidebar() {
  return (
    <aside className="hidden lg:flex flex-col w-64 min-h-screen bg-white dark:bg-slate-800 border-r border-slate-100 dark:border-slate-700 shadow-sm">
      {/* Logo */}
      <div className="px-6 py-6 border-b border-slate-100 dark:border-slate-700">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-gradient-to-br from-primary-500 to-primary-700 rounded-xl flex items-center justify-center shadow-sm">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">SmartSave</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500">ระบบออมเงินออนไลน์</p>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-4 space-y-0.5">
        <p className="text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider px-3 mb-2">เมนูหลัก</p>
        {navItems.map(({ to, label, Icon, IconActive }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            className={({ isActive }) => `
              flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium
              transition-all duration-150 group
              ${isActive
                ? 'bg-primary-50 dark:bg-primary-900/30 text-primary-600 dark:text-primary-400'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 hover:text-slate-800 dark:hover:text-slate-100'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <span className={`w-5 h-5 flex-shrink-0 transition-transform duration-150 ${isActive ? 'scale-110' : 'group-hover:scale-105'}`}>
                  {isActive ? <IconActive className="w-5 h-5" /> : <Icon className="w-5 h-5" />}
                </span>
                {label}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Footer */}
      <div className="px-4 py-4 border-t border-slate-100 dark:border-slate-700">
        <p className="text-xs text-center text-slate-400 dark:text-slate-500">SmartSave v1.0.0</p>
      </div>
    </aside>
  )
}

// Bottom Navigation for Mobile
export function BottomNav() {
  const mobileItems = navItems.slice(0, 5)

  return (
    <nav className="lg:hidden fixed bottom-0 inset-x-0 z-50 bg-white dark:bg-slate-800 border-t border-slate-100 dark:border-slate-700 flex safe-area-pb">
      {mobileItems.map(({ to, label, Icon, IconActive }) => (
        <NavLink
          key={to}
          to={to}
          end={to === '/'}
          className={({ isActive }) => `
            flex-1 flex flex-col items-center justify-center gap-0.5 py-2 text-xs font-medium
            transition-colors duration-150
            ${isActive
              ? 'text-primary-600 dark:text-primary-400'
              : 'text-slate-500 dark:text-slate-400'
            }
          `}
        >
          {({ isActive }) => (
            <>
              <span className={`transition-transform duration-150 ${isActive ? 'scale-110' : ''}`}>
                {isActive ? <IconActive className="w-6 h-6" /> : <Icon className="w-6 h-6" />}
              </span>
              <span className="text-[10px]">{label}</span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  )
}
