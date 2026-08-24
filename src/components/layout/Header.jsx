import { useLocation } from 'react-router-dom'
import { SunIcon, MoonIcon, BellIcon, ArrowPathIcon } from '@heroicons/react/24/outline'
import { useTheme } from '../../context/ThemeContext'
import { useApp } from '../../context/AppContext'

const PAGE_TITLES = {
  '/':          { title: 'Dashboard', subtitle: 'ภาพรวมการออมเงิน' },
  '/members':   { title: 'จัดการสมาชิก', subtitle: 'เพิ่ม แก้ไข ค้นหาสมาชิก' },
  '/deposit':   { title: 'ฝากเงิน', subtitle: 'บันทึกการรับฝากเงิน' },
  '/withdraw':  { title: 'ถอนเงิน', subtitle: 'บันทึกการถอนเงิน' },
  '/history':   { title: 'ประวัติรายการ', subtitle: 'รายการฝาก-ถอนทั้งหมด' },
  '/reports':   { title: 'รายงาน', subtitle: 'สรุปและส่งออกรายงาน' },
}

export default function Header() {
  const { isDark, toggleTheme } = useTheme()
  const { loadData, loading } = useApp()
  const location = useLocation()

  const page = PAGE_TITLES[location.pathname] || { title: 'SmartSave', subtitle: '' }

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-800/90 backdrop-blur-md border-b border-slate-100 dark:border-slate-700">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Page title */}
        <div className="flex items-center gap-3">
          {/* Mobile logo */}
          <div className="lg:hidden w-8 h-8 bg-gradient-to-br from-primary-500 to-primary-700 rounded-lg flex items-center justify-center">
            <span className="text-white text-sm font-bold">S</span>
          </div>
          <div>
            <h1 className="font-bold text-slate-800 dark:text-slate-100 text-base leading-tight">{page.title}</h1>
            <p className="text-xs text-slate-400 dark:text-slate-500 hidden sm:block">{page.subtitle}</p>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-1.5">
          {/* Refresh */}
          <button
            onClick={loadData}
            disabled={loading}
            title="รีเฟรชข้อมูล"
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors disabled:opacity-40"
          >
            <ArrowPathIcon className={`w-4.5 h-4.5 ${loading ? 'animate-spin' : ''}`} />
          </button>

          {/* Dark Mode Toggle */}
          <button
            onClick={toggleTheme}
            title={isDark ? 'เปิดโหมดสว่าง' : 'เปิดโหมดมืด'}
            className="w-9 h-9 flex items-center justify-center rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
          >
            {isDark
              ? <SunIcon className="w-4.5 h-4.5 text-warning-500" />
              : <MoonIcon className="w-4.5 h-4.5" />
            }
          </button>
        </div>
      </div>
    </header>
  )
}
