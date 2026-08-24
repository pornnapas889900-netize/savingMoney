import * as XLSX from 'xlsx'
import { formatCurrency, formatDate } from './formatters'

/**
 * Export สมาชิกเป็น Excel
 */
export function exportMembersExcel(members) {
  const data = members.map((m, i) => ({
    'ลำดับ': i + 1,
    'รหัสสมาชิก': m.id,
    'รหัสนักศึกษา': m.student_id || '',
    'ชื่อ-นามสกุล': m.name,
    'ห้องเรียน': m.classroom || '',
    'เบอร์โทร': m.phone || '',
    'ยอดเงินคงเหลือ (บาท)': Number(m.balance),
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()

  // ตั้งค่าความกว้าง column
  ws['!cols'] = [
    { wch: 6 }, { wch: 10 }, { wch: 14 }, { wch: 20 },
    { wch: 12 }, { wch: 14 }, { wch: 18 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'สมาชิก')
  XLSX.writeFile(wb, `smartsave_members_${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Export ประวัติรายการเป็น Excel
 */
export function exportTransactionsExcel(transactions, members) {
  const memberMap = {}
  members.forEach(m => { memberMap[m.id] = m.name })

  const data = transactions.map((t, i) => ({
    'ลำดับ': i + 1,
    'รหัสรายการ': t.id,
    'วันที่': t.date,
    'สมาชิก': memberMap[t.member_id] || t.member_id,
    'ประเภท': t.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน',
    'จำนวนเงิน (บาท)': Number(t.amount),
    'ยอดคงเหลือ (บาท)': Number(t.balance),
    'หมายเหตุ': t.note || '',
    'ผู้บันทึก': t.recorded_by || '',
  }))

  const ws = XLSX.utils.json_to_sheet(data)
  const wb = XLSX.utils.book_new()

  ws['!cols'] = [
    { wch: 6 }, { wch: 12 }, { wch: 12 }, { wch: 20 },
    { wch: 10 }, { wch: 16 }, { wch: 18 }, { wch: 20 }, { wch: 14 },
  ]

  XLSX.utils.book_append_sheet(wb, ws, 'ประวัติรายการ')
  XLSX.writeFile(wb, `smartsave_transactions_${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Export รายงานรวมเป็น Excel (หลาย Sheet)
 */
export function exportFullReportExcel(members, transactions) {
  const wb = XLSX.utils.book_new()
  const memberMap = {}
  members.forEach(m => { memberMap[m.id] = m.name })

  // Sheet 1: สมาชิก
  const membersData = members.map((m, i) => ({
    'ลำดับ': i + 1,
    'รหัสสมาชิก': m.id,
    'ชื่อ-นามสกุล': m.name,
    'ห้องเรียน': m.classroom || '',
    'เบอร์โทร': m.phone || '',
    'ยอดเงิน (บาท)': Number(m.balance),
  }))
  const ws1 = XLSX.utils.json_to_sheet(membersData)
  ws1['!cols'] = [{ wch: 6 }, { wch: 10 }, { wch: 20 }, { wch: 12 }, { wch: 14 }, { wch: 16 }]
  XLSX.utils.book_append_sheet(wb, ws1, 'สมาชิก')

  // Sheet 2: รายการทั้งหมด
  const txData = transactions.map((t, i) => ({
    'ลำดับ': i + 1,
    'วันที่': t.date,
    'สมาชิก': memberMap[t.member_id] || t.member_id,
    'ประเภท': t.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน',
    'จำนวนเงิน (บาท)': Number(t.amount),
    'ยอดคงเหลือ (บาท)': Number(t.balance),
    'หมายเหตุ': t.note || '',
  }))
  const ws2 = XLSX.utils.json_to_sheet(txData)
  ws2['!cols'] = [{ wch: 6 }, { wch: 12 }, { wch: 20 }, { wch: 10 }, { wch: 16 }, { wch: 18 }, { wch: 20 }]
  XLSX.utils.book_append_sheet(wb, ws2, 'ประวัติรายการ')

  // Sheet 3: สรุปรายเดือน
  const monthlyMap = {}
  transactions.forEach(t => {
    const key = t.date.substring(0, 7) // YYYY-MM
    if (!monthlyMap[key]) monthlyMap[key] = { deposit: 0, withdraw: 0, count: 0 }
    if (t.type === 'deposit') monthlyMap[key].deposit += Number(t.amount)
    else monthlyMap[key].withdraw += Number(t.amount)
    monthlyMap[key].count++
  })
  const summaryData = Object.entries(monthlyMap).sort().map(([month, v]) => ({
    'เดือน': month,
    'ยอดฝากรวม (บาท)': v.deposit,
    'ยอดถอนรวม (บาท)': v.withdraw,
    'สุทธิ (บาท)': v.deposit - v.withdraw,
    'จำนวนรายการ': v.count,
  }))
  const ws3 = XLSX.utils.json_to_sheet(summaryData)
  ws3['!cols'] = [{ wch: 10 }, { wch: 18 }, { wch: 18 }, { wch: 14 }, { wch: 14 }]
  XLSX.utils.book_append_sheet(wb, ws3, 'สรุปรายเดือน')

  XLSX.writeFile(wb, `smartsave_report_${new Date().toISOString().split('T')[0]}.xlsx`)
}

/**
 * Export เป็น CSV
 */
export function exportTransactionsCSV(transactions, members) {
  const memberMap = {}
  members.forEach(m => { memberMap[m.id] = m.name })

  const header = ['รหัสรายการ', 'วันที่', 'สมาชิก', 'ประเภท', 'จำนวนเงิน', 'ยอดคงเหลือ', 'หมายเหตุ', 'ผู้บันทึก']
  const rows = transactions.map(t => [
    t.id,
    t.date,
    memberMap[t.member_id] || t.member_id,
    t.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน',
    t.amount,
    t.balance,
    `"${(t.note || '').replace(/"/g, '""')}"`,
    t.recorded_by || '',
  ])

  const csvContent = '\uFEFF' + [header, ...rows].map(r => r.join(',')).join('\n')
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = `smartsave_transactions_${new Date().toISOString().split('T')[0]}.csv`
  a.click()
  URL.revokeObjectURL(url)
}
