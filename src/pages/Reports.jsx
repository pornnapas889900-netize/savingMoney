import { useState } from 'react'
import { DocumentTextIcon, TableCellsIcon, ArrowDownTrayIcon } from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'
import { exportMembersPDF, exportTransactionsPDF, exportMonthlyReportPDF } from '../utils/exportPDF'
import { exportMembersExcel, exportTransactionsExcel, exportFullReportExcel, exportTransactionsCSV } from '../utils/exportExcel'
import { getThaiMonthFull } from '../utils/formatters'

export default function Reports() {
  const { members, transactions } = useApp()
  const toast = useToast()

  const [month, setMonth] = useState(new Date().getMonth())
  const [year, setYear] = useState(new Date().getFullYear())

  const years = Array.from({ length: 5 }, (_, i) => new Date().getFullYear() - i)
  const months = Array.from({ length: 12 }, (_, i) => ({ val: i, label: getThaiMonthFull(i) }))

  function handleExport(type, format) {
    try {
      if (format === 'pdf') {
        if (type === 'members') exportMembersPDF(members)
        if (type === 'transactions') exportTransactionsPDF(transactions, members)
        if (type === 'monthly') exportMonthlyReportPDF(transactions, members, year, month)
      } 
      else if (format === 'excel') {
        if (type === 'members') exportMembersExcel(members)
        if (type === 'transactions') exportTransactionsExcel(transactions, members)
        if (type === 'full') exportFullReportExcel(members, transactions)
      }
      else if (format === 'csv') {
        if (type === 'transactions') exportTransactionsCSV(transactions, members)
      }
      
      toast.success(`ดาวน์โหลดรายงาน ${format.toUpperCase()} เรียบร้อยแล้ว`, 'ส่งออกสำเร็จ')
    } catch (err) {
      console.error(err)
      toast.error('เกิดข้อผิดพลาดในการสร้างไฟล์รายงาน', 'ล้มเหลว')
    }
  }

  const ReportCard = ({ title, description, icon: Icon, actions }) => (
    <div className="card p-5 flex flex-col h-full hover:shadow-card-hover transition-shadow">
      <div className="flex items-start gap-4 mb-4">
        <div className="w-12 h-12 bg-primary-50 dark:bg-primary-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
          <Icon className="w-6 h-6 text-primary-600 dark:text-primary-400" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800 dark:text-slate-100">{title}</h3>
          <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{description}</p>
        </div>
      </div>
      <div className="mt-auto flex flex-wrap gap-2 pt-4 border-t border-slate-100 dark:border-slate-700">
        {actions}
      </div>
    </div>
  )

  return (
    <div className="space-y-6 max-w-5xl">
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* รายงานสมาชิก */}
        <ReportCard
          title="ข้อมูลสมาชิกทั้งหมด"
          description="รายชื่อสมาชิก รหัส ห้องเรียน เบอร์โทร และยอดเงินคงเหลือปัจจุบัน"
          icon={DocumentTextIcon}
          actions={
            <>
              <button onClick={() => handleExport('members', 'pdf')} className="btn-outline btn-sm">
                <ArrowDownTrayIcon className="w-4 h-4" /> PDF
              </button>
              <button onClick={() => handleExport('members', 'excel')} className="btn-outline btn-sm">
                <TableCellsIcon className="w-4 h-4 text-success-600" /> Excel
              </button>
            </>
          }
        />

        {/* ประวัติรายการทั้งหมด */}
        <ReportCard
          title="ประวัติรายการฝาก-ถอนทั้งหมด"
          description="รายการฝากเงิน ถอนเงินทั้งหมดในระบบ พร้อมยอดคงเหลือแต่ละรายการ"
          icon={DocumentTextIcon}
          actions={
            <>
              <button onClick={() => handleExport('transactions', 'pdf')} className="btn-outline btn-sm">
                <ArrowDownTrayIcon className="w-4 h-4" /> PDF
              </button>
              <button onClick={() => handleExport('transactions', 'excel')} className="btn-outline btn-sm">
                <TableCellsIcon className="w-4 h-4 text-success-600" /> Excel
              </button>
              <button onClick={() => handleExport('transactions', 'csv')} className="btn-outline btn-sm">
                CSV
              </button>
            </>
          }
        />

        {/* รายงานสรุปรวม */}
        <ReportCard
          title="รายงานสรุปรวม (Full Report)"
          description="ไฟล์ Excel ที่มีหลายชีต ประกอบด้วยข้อมูลสมาชิก ประวัติรายการ และสรุปยอดรายเดือน"
          icon={TableCellsIcon}
          actions={
            <button onClick={() => handleExport('full', 'excel')} className="btn-success btn-sm w-full justify-center">
              <TableCellsIcon className="w-4 h-4" /> ดาวน์โหลด Excel (หลายชีต)
            </button>
          }
        />

        {/* รายงานประจำเดือน */}
        <div className="card p-5 border-2 border-primary-100 dark:border-primary-900/30 md:col-span-2 lg:col-span-1">
          <div className="flex items-start gap-4 mb-4">
            <div className="w-12 h-12 bg-warning-50 dark:bg-warning-900/30 rounded-2xl flex items-center justify-center flex-shrink-0">
              <DocumentTextIcon className="w-6 h-6 text-warning-600 dark:text-warning-400" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 dark:text-slate-100">รายงานสรุปประจำเดือน</h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">สรุปยอดเงินฝาก ถอน และรายการทั้งหมดของเดือนที่เลือก</p>
            </div>
          </div>
          
          <div className="flex items-center gap-3 mb-4">
            <select className="input flex-1 py-2" value={month} onChange={e => setMonth(Number(e.target.value))}>
              {months.map(m => <option key={m.val} value={m.val}>{m.label}</option>)}
            </select>
            <select className="input w-32 py-2" value={year} onChange={e => setYear(Number(e.target.value))}>
              {years.map(y => <option key={y} value={y}>{y + 543} ({y})</option>)}
            </select>
          </div>

          <button onClick={() => handleExport('monthly', 'pdf')} className="btn-primary w-full justify-center">
            <ArrowDownTrayIcon className="w-5 h-5" /> สรุปรายงานเดือน {getThaiMonthFull(month)} เป็น PDF
          </button>
        </div>

      </div>
    </div>
  )
}
