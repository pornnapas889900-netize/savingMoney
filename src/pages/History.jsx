import { useState, useMemo } from 'react'
import { MagnifyingGlassIcon, ArrowDownTrayIcon, ArrowUpTrayIcon } from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import { formatCurrency, formatDateShort } from '../utils/formatters'
import Avatar from '../components/ui/Avatar'

export default function History() {
  const { transactions, members, loading } = useApp()
  
  const [search, setSearch] = useState('')
  const [typeFilter, setTypeFilter] = useState('')
  const [dateFilter, setDateFilter] = useState('')
  const [page, setPage] = useState(1)
  const itemsPerPage = 15

  // Map member data for quick access
  const memberMap = useMemo(() => {
    const map = {}
    members.forEach(m => { map[m.id] = m })
    return map
  }, [members])

  // Filter transactions
  const filtered = useMemo(() => {
    return transactions.filter(t => {
      const member = memberMap[t.member_id]
      const memberName = member ? member.name.toLowerCase() : ''
      const memberId = t.member_id.toLowerCase()
      const studentId = (member?.student_id || '').toLowerCase()
      
      const q = search.toLowerCase()
      const matchSearch = !q || memberName.includes(q) || memberId.includes(q) || studentId.includes(q) || (t.note || '').toLowerCase().includes(q)
      const matchType = !typeFilter || t.type === typeFilter
      const matchDate = !dateFilter || t.date === dateFilter

      return matchSearch && matchType && matchDate
    })
  }, [transactions, memberMap, search, typeFilter, dateFilter])

  // Pagination
  const totalPages = Math.ceil(filtered.length / itemsPerPage) || 1
  const paginated = filtered.slice((page - 1) * itemsPerPage, page * itemsPerPage)

  return (
    <div className="space-y-4">
      
      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            className="input pl-9"
            placeholder="ค้นหาชื่อ, รหัส, หมายเหตุ..."
            value={search}
            onChange={e => { setSearch(e.target.value); setPage(1) }}
          />
        </div>

        {/* Date Filter */}
        <input
          type="date"
          className="input sm:w-40"
          value={dateFilter}
          onChange={e => { setDateFilter(e.target.value); setPage(1) }}
        />

        {/* Type Filter */}
        <select
          className="input sm:w-40"
          value={typeFilter}
          onChange={e => { setTypeFilter(e.target.value); setPage(1) }}
        >
          <option value="">ทุกประเภท</option>
          <option value="deposit">ฝากเงิน</option>
          <option value="withdraw">ถอนเงิน</option>
        </select>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>พบ <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span> รายการ</span>
        {(search || typeFilter || dateFilter) && (
          <button 
            onClick={() => { setSearch(''); setTypeFilter(''); setDateFilter(''); setPage(1) }} 
            className="text-primary-600 hover:underline text-xs"
          >
            ล้าง filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>วันที่</th>
                <th>สมาชิก</th>
                <th>ประเภท</th>
                <th className="text-right">จำนวนเงิน</th>
                <th className="text-right">ยอดคงเหลือ</th>
                <th>หมายเหตุ</th>
                <th>ผู้บันทึก</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(7).fill(0).map((_, j) => (
                      <td key={j}><div className="shimmer h-5 rounded-md" /></td>
                    ))}
                  </tr>
                ))
              ) : paginated.length === 0 ? (
                <tr>
                  <td colSpan={7} className="text-center py-12 text-slate-400">
                    ไม่พบรายการที่ค้นหา
                  </td>
                </tr>
              ) : (
                paginated.map(t => {
                  const member = memberMap[t.member_id]
                  return (
                    <tr key={t.id}>
                      <td className="text-slate-600 dark:text-slate-300">
                        {formatDateShort(t.date)}
                      </td>
                      <td>
                        <div className="flex items-center gap-3">
                          {member ? (
                            <Avatar name={member.name} src={member.avatar_url} size="xs" />
                          ) : (
                            <div className="w-7 h-7 bg-slate-200 dark:bg-slate-700 rounded-full flex-shrink-0" />
                          )}
                          <div>
                            <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">
                              {member ? member.name : t.member_id}
                            </p>
                            {member && <p className="text-xs text-slate-400">{member.classroom}</p>}
                          </div>
                        </div>
                      </td>
                      <td>
                        {t.type === 'deposit' ? (
                          <span className="badge-deposit"><ArrowDownTrayIcon className="w-3 h-3" /> ฝากเงิน</span>
                        ) : (
                          <span className="badge-withdraw"><ArrowUpTrayIcon className="w-3 h-3" /> ถอนเงิน</span>
                        )}
                      </td>
                      <td className="text-right">
                        <span className={`font-semibold ${t.type === 'deposit' ? 'text-success-600 dark:text-success-400' : 'text-danger-600 dark:text-danger-400'}`}>
                          {t.type === 'deposit' ? '+' : '-'}{formatCurrency(t.amount)}
                        </span>
                      </td>
                      <td className="text-right text-slate-600 dark:text-slate-300">
                        {formatCurrency(t.balance)}
                      </td>
                      <td className="text-slate-500 dark:text-slate-400 text-xs">
                        {t.note || '-'}
                      </td>
                      <td className="text-slate-500 dark:text-slate-400 text-xs">
                        {t.recorded_by || '-'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="px-6 py-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between">
            <span className="text-sm text-slate-500 dark:text-slate-400">
              หน้า {page} จาก {totalPages}
            </span>
            <div className="flex items-center gap-2">
              <button
                className="btn-outline btn-sm"
                onClick={() => setPage(p => Math.max(1, p - 1))}
                disabled={page === 1}
              >
                ก่อนหน้า
              </button>
              <button
                className="btn-outline btn-sm"
                onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                disabled={page === totalPages}
              >
                ถัดไป
              </button>
            </div>
          </div>
        )}
      </div>

    </div>
  )
}
