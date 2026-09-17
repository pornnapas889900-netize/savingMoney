const GAS_URL = 'https://script.google.com/macros/s/https://script.google.com/macros/s/AKfycbyyz_RsNOR8ZLGeyQ1KC8kTFWOXY5WRPoP8xLFqX-ZOVqaXnCg8kKD-WWL1LEpy9M7aoQ/exec/exec';

/**
 * ฟังก์ชันหลักสำหรับเรียก Google Apps Script Web App
 * @param {string} action ชื่อ action
 * @param {object} payload ข้อมูลที่ส่งไป
 */
export async function callGAS(action, payload = {}) {
  // หากยังไม่มี GAS URL จะใช้ข้อมูลจำลองชั่วคราว (เพื่อไม่ให้แอปแครช)
  if (!GAS_URL || GAS_URL.includes('REPLACE_WITH')) {
    console.warn('⚠️ GAS API URL not configured. Returning mock data or throwing error.')
    if (action === 'getData') {
      return { members: [], transactions: [], settings: {} }
    }
    throw new Error('ยังไม่ได้ตั้งค่า VITE_GAS_API_URL ในไฟล์ .env')
  }

  try {
    const response = await fetch(GAS_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'text/plain;charset=utf-8' },
      body: JSON.stringify({ action, ...payload }),
      redirect: 'follow'
    })

    if (!response.ok) {
      throw new Error(`Server error: ${response.status}`)
    }

    const data = await response.json()
    if (data.error) throw new Error(data.error)
    return data

  } catch (error) {
    console.error(`GAS API Error [${action}]:`, error)
    throw error
  }
}

// -----------------------------------------
// ฟังก์ชันย่อยสำหรับแต่ละการกระทำ (Actions)
// -----------------------------------------

export async function getAllData() {
  return callGAS('getData')
}

export async function addMemberToGas(memberData) {
  return callGAS('addMember', { memberData })
}

export async function updateMemberInGas(id, memberData) {
  return callGAS('updateMember', { id, memberData })
}

export async function deleteMemberFromGas(id) {
  return callGAS('deleteMember', { id })
}

export async function addTransactionToGas(transactionData) {
  return callGAS('addTransaction', { transactionData })
}

export async function uploadAvatarToGas(base64, memberId, name) {
  return callGAS('uploadAvatar', { base64, memberId, name })
}
