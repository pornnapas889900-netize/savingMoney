import { useState, useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ArrowDownTrayIcon, MagnifyingGlassIcon } from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'
import Avatar from '../components/ui/Avatar'
import { formatCurrency, generateId, toInputDate } from '../utils/formatters'

export default function Deposit() {
  const { members, updateMember, addTransaction } = useApp()
  const toast = useToast()
  const navigate = useNavigate()

  const [search, setSearch] = useState('')
  const [selectedMember, setSelectedMember] = useState(null)
  
  const [amount, setAmount] = useState('')
  const [date, setDate] = useState(toInputDate(new Date()))
  const [note, setNote] = useState('')
  const [loading, setLoading] = useState(false)

  // ค้นหาสมาชิก (แสดงสูงสุด 5 คน)
  const searchResults = useMemo(() => {
    if (!search.trim()) return []
    const q = search.toLowerCase()
    return members
      .filter(m => 
        m.name.toLowerCase().includes(q) || 
        m.id.toLowerCase().includes(q) ||
        (m.student_id || '').toLowerCase().includes(q)
      )
      .slice(0, 5)
  }, [members, search])

  function selectMember(member) {
    setSelectedMember(member)
    setSearch('')
  }

  async function handleDeposit(e) {
    e.preventDefault()
    if (!selectedMember) {
      toast.warning('กรุณาเลือกสมาชิก', 'ข้อมูลไม่ครบ')
      return
    }
    const numAmount = Number(amount)
    if (!numAmount || numAmount <= 0) {
      toast.warning('กรุณากรอกจำนวนเงินให้ถูกต้อง', 'ข้อมูลไม่ถูกต้อง')
      return
    }
    if (!date) {
      toast.warning('กรุณาเลือกวันที่', 'ข้อมูลไม่ครบ')
      return
    }

    setLoading(true)
    try {
      const newBalance = Number(selectedMember.balance) + numAmount
      
      // บันทึกรายการ
      await addTransaction({
        id: generateId('TRX'),
        member_id: selectedMember.id,
        date: date,
        type: 'deposit',
        amount: numAmount,
        balance: newBalance,
        note: note.trim(),
        recorded_by: 'เจ้าหน้าที่' // TODO: ดึงจากระบบ Login ในอนาคต
      })

      // อัปเดตยอดสมาชิก
      await updateMember(selectedMember.id, { balance: newBalance })

      toast.success(`ฝากเงิน ${formatCurrency(numAmount)} เรียบร้อยแล้ว`, 'บันทึกสำเร็จ')
      
      // รีเซ็ตฟอร์ม
      setSelectedMember(null)
      setAmount('')
      setNote('')
      setDate(toInputDate(new Date()))
      
    } catch (err) {
      toast.error(err.message || 'เกิดข้อผิดพลาดในการบันทึก', 'ข้อผิดพลาด')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      
      {/* Header */}
      <div className="flex items-center gap-3 mb-2">
        <div className="w-12 h-12 bg-success-100 dark:bg-success-900/30 rounded-2xl flex items-center justify-center">
          <ArrowDownTrayIcon className="w-6 h-6 text-success-600 dark:text-success-400" />
        </div>
        <div>
          <h2 className="text-xl font-bold text-slate-800 dark:text-slate-100">บันทึกการฝากเงิน</h2>
          <p className="text-sm text-slate-500 dark:text-slate-400">เพิ่มยอดเงินออมให้สมาชิก</p>
        </div>
      </div>

      <div className="card p-6">
        
        {/* ค้นหาสมาชิก */}
        {!selectedMember ? (
          <div className="space-y-4">
            <div>
              <label className="label">ค้นหาสมาชิก</label>
              <div className="relative">
                <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  className="input pl-10 py-3"
                  placeholder="พิมพ์ชื่อ, รหัสสมาชิก หรือรหัสนักศึกษา..."
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  autoFocus
                />
              </div>
            </div>
            
            {/* ผลการค้นหา */}
            {search.trim() && (
              <div className="border border-slate-100 dark:border-slate-700 rounded-xl overflow-hidden">
                {searchResults.length > 0 ? (
                  searchResults.map(m => (
                    <button
                      key={m.id}
                      onClick={() => selectMember(m)}
                      className="w-full flex items-center gap-3 p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 text-left border-b border-slate-100 dark:border-slate-700 last:border-0 transition-colors"
                    >
                      <Avatar name={m.name} src={m.avatar_url} size="sm" />
                      <div className="flex-1">
                        <p className="font-medium text-slate-800 dark:text-slate-200">{m.name}</p>
                        <p className="text-xs text-slate-500">{m.id} • {m.classroom}</p>
                      </div>
                    </button>
                  ))
                ) : (
                  <div className="p-4 text-center text-sm text-slate-500">
                    ไม่พบสมาชิกที่ค้นหา
                  </div>
                )}
              </div>
            )}
          </div>
        ) : (
          /* ฟอร์มฝากเงิน */
          <form onSubmit={handleDeposit} className="space-y-5 animate-fade-in">
            {/* สมาชิกที่เลือก */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <div className="flex items-center gap-3">
                <Avatar name={selectedMember.name} src={selectedMember.avatar_url} />
                <div>
                  <p className="font-bold text-slate-800 dark:text-slate-100">{selectedMember.name}</p>
                  <p className="text-xs text-slate-500">{selectedMember.id} • ยอดเดิม: <span className="font-semibold text-primary-600 dark:text-primary-400">{formatCurrency(selectedMember.balance)}</span></p>
                </div>
              </div>
              <button 
                type="button" 
                onClick={() => setSelectedMember(null)}
                className="text-xs text-slate-500 hover:text-slate-700 dark:hover:text-slate-300 hover:underline"
              >
                เปลี่ยน
              </button>
            </div>

            {/* จำนวนเงิน & วันที่ */}
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className="label">จำนวนเงิน (บาท) *</label>
                <input
                  type="number"
                  min="1"
                  className="input text-lg font-semibold text-success-600 dark:text-success-400 py-3"
                  value={amount}
                  onChange={e => setAmount(e.target.value)}
                  placeholder="0.00"
                  required
                  autoFocus
                />
              </div>
              <div>
                <label className="label">วันที่ *</label>
                <input
                  type="date"
                  className="input py-3"
                  value={date}
                  onChange={e => setDate(e.target.value)}
                  required
                />
              </div>
            </div>

            {/* หมายเหตุ */}
            <div>
              <label className="label">หมายเหตุ (ถ้ามี)</label>
              <input
                type="text"
                className="input"
                value={note}
                onChange={e => setNote(e.target.value)}
                placeholder="เช่น ฝากประจำสัปดาห์"
              />
            </div>

            {/* สรุปยอดใหม่ */}
            {amount && Number(amount) > 0 && (
              <div className="p-4 bg-success-50 dark:bg-success-900/10 rounded-xl border border-success-100 dark:border-success-900/30 animate-slide-up">
                <div className="flex justify-between items-center text-sm mb-1">
                  <span className="text-slate-600 dark:text-slate-400">ยอดเงินเดิม</span>
                  <span className="text-slate-800 dark:text-slate-200">{formatCurrency(selectedMember.balance)}</span>
                </div>
                <div className="flex justify-between items-center text-sm mb-2">
                  <span className="text-success-600 dark:text-success-500">ยอดฝากเพิ่ม</span>
                  <span className="text-success-600 dark:text-success-500">+{formatCurrency(Number(amount))}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-success-200 dark:border-success-800/30">
                  <span className="font-semibold text-slate-700 dark:text-slate-300">ยอดคงเหลือใหม่</span>
                  <span className="text-lg font-bold text-success-600 dark:text-success-400">
                    {formatCurrency(Number(selectedMember.balance) + Number(amount))}
                  </span>
                </div>
              </div>
            )}

            {/* ปุ่มบันทึก */}
            <div className="pt-2 flex gap-3">
              <button type="button" className="btn-outline flex-1 py-3" onClick={() => navigate('/')} disabled={loading}>
                ยกเลิก
              </button>
              <button type="submit" className="btn-success flex-1 py-3 text-base" disabled={loading}>
                {loading ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-5 h-5 inline-block" /> : 'บันทึกรายการฝาก'}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  )
}
