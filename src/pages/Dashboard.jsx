import { useNavigate } from 'react-router-dom'
import {
  UserGroupIcon, BanknotesIcon, ArrowDownTrayIcon, ArrowUpTrayIcon,
  ClockIcon, ChartBarIcon, TrophyIcon
} from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import StatCard, { StatCardSkeleton } from '../components/ui/StatCard'
import MonthlyChart from '../components/charts/MonthlyChart'
import SummaryChart from '../components/charts/SummaryChart'
import { formatCurrency, formatDateShort } from '../utils/formatters'
import Avatar from '../components/ui/Avatar'

export default function Dashboard() {
  const { stats, members, transactions, loading } = useApp()
  const navigate = useNavigate()

  const topMembers = [...members]
    .sort((a, b) => Number(b.balance) - Number(a.balance))
    .slice(0, 5)

  const recentTx = transactions.slice(0, 6)

  return (
    <div className="space-y-6">

      {/* Stat Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {loading ? (
          Array(6).fill(0).map((_, i) => <StatCardSkeleton key={i} />)
        ) : (
          <>
            <StatCard
              icon={<UserGroupIcon className="w-6 h-6 text-white" />}
              label="สมาชิกทั้งหมด"
              value={`${stats.totalMembers} คน`}
              color="primary"
              onClick={() => navigate('/members')}
            />
            <StatCard
              icon={<BanknotesIcon className="w-6 h-6 text-white" />}
              label="ยอดเงินออมรวม"
              value={formatCurrency(stats.totalBalance)}
              color="success"
            />
            <StatCard
              icon={<ArrowDownTrayIcon className="w-6 h-6 text-white" />}
              label="ฝากวันนี้"
              value={`${stats.todayDepositCount} รายการ`}
              color="teal"
              onClick={() => navigate('/deposit')}
            />
            <StatCard
              icon={<ArrowUpTrayIcon className="w-6 h-6 text-white" />}
              label="ถอนวันนี้"
              value={`${stats.todayWithdrawCount} รายการ`}
              color="danger"
              onClick={() => navigate('/withdraw')}
            />
            <StatCard
              icon={<ChartBarIcon className="w-6 h-6 text-white" />}
              label="ยอดฝากเดือนนี้"
              value={formatCurrency(stats.monthlyDeposit)}
              color="purple"
            />
            <StatCard
              icon={<ClockIcon className="w-6 h-6 text-white" />}
              label="ยอดถอนเดือนนี้"
              value={formatCurrency(stats.monthlyWithdraw)}
              color="warning"
            />
          </>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'ฝากเงิน', path: '/deposit', color: 'btn-success', icon: <ArrowDownTrayIcon className="w-5 h-5" /> },
          { label: 'ถอนเงิน', path: '/withdraw', color: 'btn-danger', icon: <ArrowUpTrayIcon className="w-5 h-5" /> },
          { label: 'สมาชิก', path: '/members', color: 'btn-primary', icon: <UserGroupIcon className="w-5 h-5" /> },
          { label: 'รายงาน', path: '/reports', color: 'btn-warning', icon: <ChartBarIcon className="w-5 h-5" /> },
        ].map(({ label, path, color, icon }) => (
          <button
            key={path}
            onClick={() => navigate(path)}
            className={`${color} btn-lg justify-center w-full`}
          >
            {icon}
            {label}
          </button>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
        {/* Monthly Chart */}
        <div className="xl:col-span-2 card p-5">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">ยอดฝาก-ถอน รายเดือน</h2>
          <div className="h-64">
            <MonthlyChart />
          </div>
        </div>

        {/* Summary Chart */}
        <div className="card p-5">
          <h2 className="font-semibold text-slate-700 dark:text-slate-200 mb-4">สัดส่วนฝาก-ถอน</h2>
          <div className="h-64">
            <SummaryChart />
          </div>
        </div>
      </div>

      {/* Bottom Row: Top Members + Recent Transactions */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Top Savers */}
        <div className="card p-5">
          <div className="flex items-center gap-2 mb-4">
            <TrophyIcon className="w-5 h-5 text-warning-500" />
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">ออมสูงสุด 5 อันดับ</h2>
          </div>
          <div className="space-y-3">
            {topMembers.map((m, i) => (
              <div key={m.id} className="flex items-center gap-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0
                  ${i === 0 ? 'bg-warning-100 text-warning-600' :
                    i === 1 ? 'bg-slate-100 text-slate-600' :
                    i === 2 ? 'bg-orange-100 text-orange-600' :
                    'bg-slate-50 text-slate-400'}`}>
                  {i + 1}
                </span>
                <Avatar name={m.name} src={m.avatar_url} size="sm" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">{m.name}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{m.classroom}</p>
                </div>
                <span className="text-sm font-semibold text-success-600 dark:text-success-400 flex-shrink-0">
                  {formatCurrency(m.balance)}
                </span>
              </div>
            ))}
            {topMembers.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีข้อมูลสมาชิก</p>
            )}
          </div>
        </div>

        {/* Recent Transactions */}
        <div className="card p-5">
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-semibold text-slate-700 dark:text-slate-200">รายการล่าสุด</h2>
            <button onClick={() => navigate('/history')} className="text-xs text-primary-600 dark:text-primary-400 hover:underline">
              ดูทั้งหมด →
            </button>
          </div>
          <div className="space-y-2.5">
            {recentTx.map(t => {
              const member = members.find(m => m.id === t.member_id)
              return (
                <div key={t.id} className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0
                    ${t.type === 'deposit' ? 'bg-success-100 dark:bg-success-900/30' : 'bg-danger-100 dark:bg-danger-900/30'}`}>
                    {t.type === 'deposit'
                      ? <ArrowDownTrayIcon className="w-4 h-4 text-success-600 dark:text-success-400" />
                      : <ArrowUpTrayIcon className="w-4 h-4 text-danger-600 dark:text-danger-400" />
                    }
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate">
                      {member?.name || t.member_id}
                    </p>
                    <p className="text-xs text-slate-400">{formatDateShort(t.date)}</p>
                  </div>
                  <span className={`text-sm font-semibold flex-shrink-0
                    ${t.type === 'deposit' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                    {t.type === 'deposit' ? '+' : '-'}{formatCurrency(t.amount)}
                  </span>
                </div>
              )
            })}
            {recentTx.length === 0 && (
              <p className="text-sm text-slate-400 text-center py-4">ยังไม่มีรายการ</p>
            )}
          </div>
        </div>

      </div>
    </div>
  )
}
