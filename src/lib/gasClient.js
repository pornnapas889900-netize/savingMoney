const GAS_URL = import.meta.env.VITE_GAS_API_URL

/**
 * เรียก Google Apps Script Web App API
 * @param {string} action - ชื่อ action ที่ต้องการ
 * @param {object} payload - ข้อมูลที่ส่ง
 */
export async function callGAS(action, payload = {}) {
  if (!GAS_URL || GAS_URL.includes('REPLACE_WITH')) {
    console.warn('⚠️ GAS API URL not configured. Skipping Drive operation.')
    return null
  }

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow'
    })

    if (!response.ok) {
      throw new Error(`GAS Error: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error('GAS API Error:', error)
    throw error
  }
}

/**
 * สร้าง folder สมาชิกใหม่ใน Google Drive
 */
export async function createMemberFolder(memberId, name) {
  return callGAS('createMemberFolder', { memberId, name })
}

/**
 * อัปโหลดรูปโปรไฟล์ไปยัง Google Drive
 * @param {string} base64 - รูปภาพในรูปแบบ base64
 * @param {string} folderId - Google Drive folder ID ของสมาชิก
 */
export async function uploadAvatar(base64, folderId) {
  return callGAS('uploadAvatar', { base64, folderId })
}

/**
 * บันทึกไฟล์ Export ลง Google Drive
 */
export async function exportToDrive(base64, filename, mimeType, subfolder) {
  return callGAS('exportToDrive', { base64, filename, mimeType, subfolder })
}

/**
 * บันทึก Backup JSON ลง Google Drive
 */
export async function backupToDriver(jsonData) {
  const date = new Date().toISOString().split('T')[0]
  return callGAS('backup', {
    jsonData: JSON.stringify(jsonData),
    filename: `backup_${date}.json`
  })
}

/**
 * ดึงรายการ Backup จาก Google Drive
 */
export async function listBackups() {
  return callGAS('listBackups', {})
}

/**
 * ลบ folder สมาชิกออกจาก Google Drive
 */
export async function deleteMemberFolder(folderId) {
  return callGAS('deleteFolder', { folderId })
}
