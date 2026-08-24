import jsPDF from 'jspdf'
import autoTable from 'jspdf-autotable'
import { formatCurrency, formatDate, formatDateShort, getThaiMonthFull } from './formatters'

/**
 * Export รายงานสมาชิกเป็น PDF
 */
export function exportMembersPDF(members) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })

  // Title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('SmartSave - รายงานสมาชิก', 14, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`วันที่พิมพ์: ${formatDate(new Date().toISOString())}`, 14, 28)
  doc.text(`จำนวนสมาชิก: ${members.length} คน`, 14, 34)

  // Table
  autoTable(doc, {
    startY: 42,
    head: [['รหัส', 'รหัสนักศึกษา', 'ชื่อ-นามสกุล', 'ห้องเรียน', 'เบอร์โทร', 'ยอดเงิน (บาท)']],
    body: members.map(m => [
      m.id,
      m.student_id || '-',
      m.name,
      m.classroom || '-',
      m.phone || '-',
      formatCurrency(m.balance),
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    foot: [[
      '', '', '', '', 'รวมยอดออม:',
      formatCurrency(members.reduce((s, m) => s + Number(m.balance), 0))
    ]],
    footStyles: { fillColor: [16, 185, 129], textColor: 255, fontStyle: 'bold' },
  })

  doc.save(`smartsave_members_${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Export ประวัติรายการเป็น PDF
 */
export function exportTransactionsPDF(transactions, members) {
  const doc = new jsPDF({ orientation: 'landscape', unit: 'mm', format: 'a4' })

  const memberMap = {}
  members.forEach(m => { memberMap[m.id] = m.name })

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text('SmartSave - ประวัติรายการฝาก-ถอน', 14, 20)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`วันที่พิมพ์: ${formatDate(new Date().toISOString())}`, 14, 28)
  doc.text(`จำนวนรายการ: ${transactions.length} รายการ`, 14, 34)

  const totalDeposit = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0)
  const totalWithdraw = transactions.filter(t => t.type === 'withdraw').reduce((s, t) => s + Number(t.amount), 0)

  autoTable(doc, {
    startY: 42,
    head: [['รหัส', 'วันที่', 'สมาชิก', 'ประเภท', 'จำนวนเงิน', 'ยอดคงเหลือ', 'หมายเหตุ', 'ผู้บันทึก']],
    body: transactions.map(t => [
      t.id,
      formatDateShort(t.date),
      memberMap[t.member_id] || t.member_id,
      t.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน',
      formatCurrency(t.amount),
      formatCurrency(t.balance),
      t.note || '-',
      t.recorded_by || '-',
    ]),
    styles: { fontSize: 8, cellPadding: 2.5 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [239, 246, 255] },
    columnStyles: {
      3: {
        fontStyle: 'bold',
        textColor: (cell) =>
          cell.raw === 'ฝากเงิน' ? [16, 185, 129] : [239, 68, 68]
      }
    },
    foot: [['', '', '', 'รวมฝาก:', formatCurrency(totalDeposit), '', '', ''],
           ['', '', '', 'รวมถอน:', formatCurrency(totalWithdraw), '', '', '']],
    footStyles: { fillColor: [241, 245, 249], textColor: [51, 65, 85], fontStyle: 'bold' },
  })

  doc.save(`smartsave_transactions_${new Date().toISOString().split('T')[0]}.pdf`)
}

/**
 * Export รายงานสรุปรายเดือนเป็น PDF
 */
export function exportMonthlyReportPDF(transactions, members, year, month) {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const monthName = getThaiMonthFull(month)

  const filtered = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getFullYear() === year && d.getMonth() === month
  })

  const memberMap = {}
  members.forEach(m => { memberMap[m.id] = m.name })

  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(`SmartSave - รายงานประจำเดือน ${monthName} ${year}`, 14, 20)

  const totalDeposit = filtered.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0)
  const totalWithdraw = filtered.filter(t => t.type === 'withdraw').reduce((s, t) => s + Number(t.amount), 0)

  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text(`ยอดฝากรวม: ${formatCurrency(totalDeposit)}`, 14, 30)
  doc.text(`ยอดถอนรวม: ${formatCurrency(totalWithdraw)}`, 80, 30)
  doc.text(`จำนวนรายการ: ${filtered.length} รายการ`, 150, 30)

  autoTable(doc, {
    startY: 38,
    head: [['วันที่', 'สมาชิก', 'ประเภท', 'จำนวนเงิน', 'หมายเหตุ']],
    body: filtered.map(t => [
      formatDateShort(t.date),
      memberMap[t.member_id] || t.member_id,
      t.type === 'deposit' ? 'ฝากเงิน' : 'ถอนเงิน',
      formatCurrency(t.amount),
      t.note || '-',
    ]),
    styles: { fontSize: 9, cellPadding: 3 },
    headStyles: { fillColor: [37, 99, 235], textColor: 255, fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [239, 246, 255] },
  })

  doc.save(`smartsave_report_${year}-${String(month + 1).padStart(2, '0')}.pdf`)
}
