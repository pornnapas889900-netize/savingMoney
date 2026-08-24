/**
 * จัดรูปแบบตัวเลขเป็นสกุลเงินบาท
 */
export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '฿0.00'
  return new Intl.NumberFormat('th-TH', {
    style: 'currency',
    currency: 'THB',
    minimumFractionDigits: 2,
  }).format(amount)
}

/**
 * จัดรูปแบบตัวเลขธรรมดา (มี comma)
 */
export function formatNumber(num) {
  if (num === null || num === undefined) return '0'
  return new Intl.NumberFormat('th-TH').format(num)
}

/**
 * จัดรูปแบบวันที่เป็นภาษาไทย
 */
export function formatDate(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

/**
 * จัดรูปแบบวันที่แบบสั้น
 */
export function formatDateShort(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    year: '2-digit',
    month: 'short',
    day: 'numeric',
  })
}

/**
 * จัดรูปแบบวันที่และเวลา
 */
export function formatDateTime(dateStr) {
  if (!dateStr) return '-'
  const date = new Date(dateStr)
  return date.toLocaleDateString('th-TH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  })
}

/**
 * ดึงชื่อเดือนภาษาไทย
 */
export function getThaiMonth(monthIndex) {
  const months = [
    'ม.ค.', 'ก.พ.', 'มี.ค.', 'เม.ย.', 'พ.ค.', 'มิ.ย.',
    'ก.ค.', 'ส.ค.', 'ก.ย.', 'ต.ค.', 'พ.ย.', 'ธ.ค.'
  ]
  return months[monthIndex] || ''
}

/**
 * ดึงชื่อเดือนภาษาไทยแบบเต็ม
 */
export function getThaiMonthFull(monthIndex) {
  const months = [
    'มกราคม', 'กุมภาพันธ์', 'มีนาคม', 'เมษายน', 'พฤษภาคม', 'มิถุนายน',
    'กรกฎาคม', 'สิงหาคม', 'กันยายน', 'ตุลาคม', 'พฤศจิกายน', 'ธันวาคม'
  ]
  return months[monthIndex] || ''
}

/**
 * แปลงวันที่เป็น input value (YYYY-MM-DD)
 */
export function toInputDate(date = new Date()) {
  return date.toISOString().split('T')[0]
}

/**
 * สร้าง ID อัตโนมัติ
 */
export function generateId(prefix = 'ID') {
  const timestamp = Date.now().toString(36).toUpperCase()
  const random = Math.random().toString(36).substring(2, 6).toUpperCase()
  return `${prefix}${timestamp}${random}`
}

/**
 * คำนวณยอดรวม
 */
export function sumAmount(transactions, type = null) {
  return transactions
    .filter(t => type ? t.type === type : true)
    .reduce((sum, t) => sum + Number(t.amount), 0)
}

/**
 * กรองรายการตามเดือน
 */
export function filterByMonth(transactions, year, month) {
  return transactions.filter(t => {
    const d = new Date(t.date)
    return d.getFullYear() === year && d.getMonth() === month
  })
}

/**
 * สร้าง avatar fallback จากชื่อ
 */
export function getInitials(name = '') {
  const parts = name.trim().split(' ')
  if (parts.length >= 2) return parts[0][0] + parts[1][0]
  return name.substring(0, 2)
}

/**
 * สีพื้นหลัง avatar จากชื่อ
 */
export function getAvatarColor(name = '') {
  const colors = [
    'bg-blue-500', 'bg-green-500', 'bg-purple-500',
    'bg-pink-500', 'bg-orange-500', 'bg-teal-500',
    'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500',
  ]
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash)
  }
  return colors[Math.abs(hash) % colors.length]
}
