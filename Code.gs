/**
 * SmartSave - Google Apps Script Backend (Serverless 100%)
 * 
 * ใช้ Google Sheets เป็น Database 
 * ใช้ Google Drive เป็น Storage สำหรับเก็บรูป
 * 
 * 1. วางโค้ดนี้ลงในโปรเจกต์ Google Apps Script ที่ผูกกับ Google Sheets (Extension > Apps Script)
 * 2. กำหนด ROOT_FOLDER_ID ของ Google Drive ที่จะใช้เก็บรูป
 * 3. Deploy เป็น Web App (สิทธิ์เข้าถึง: "Anyone" หรือ "ทุกคน")
 */

const ROOT_FOLDER_ID = '1W9o2ep_QRp0ksj4fk8elsOfzdEe2rTz5';

/**
 * รองรับ GET Request เพื่อใช้ทดสอบว่า API ทำงานหรือไม่
 */
function doGet(e) {
  return handleResponse({ status: 'ok', message: 'SmartSave GAS API is running' });
}

/**
 * รองรับ POST Request รับคำสั่งต่างๆ จาก Frontend
 */
function doPost(e) {
  try {
    if (!e.postData || !e.postData.contents) {
      throw new Error('No data received');
    }
    
    // ตั้งค่า Content-Type เป็น text/plain จาก React เพื่อเลี่ยง CORS
    const data = JSON.parse(e.postData.contents);
    const action = data.action;

    switch (action) {
      case 'getData':
        return getAllData();
      case 'addMember':
        return addMember(data.memberData);
      case 'updateMember':
        return updateMember(data.id, data.memberData);
      case 'deleteMember':
        return deleteMember(data.id);
      case 'addTransaction':
        return addTransaction(data.transactionData);
      case 'uploadAvatar':
        return uploadAvatar(data);
      default:
        throw new Error('Unknown action: ' + action);
    }
  } catch (error) {
    return handleResponse({ error: error.toString() }, 400);
  }
}

// ---------------------------------------------------------
// ฟังก์ชันอ่าน-เขียนข้อมูลใน Google Sheets
// ---------------------------------------------------------

/**
 * ดึงข้อมูลทั้งหมดจากทุกชีต
 */
function getAllData() {
  const ss = SpreadsheetApp.openById('1dlbx0AmyA8ILZxXTi1OcN40uL6Om4RP0JD77ZPUVhBo');
  
  // สร้างชีตหากยังไม่มี
  setupSheetsIfNotExist(ss);
  
  const members = getSheetData(ss.getSheetByName('members'));
  const transactions = getSheetData(ss.getSheetByName('transactions'));
  
  // แปลงชีต settings (Key-Value) เป็น Object
  const settingsData = getSheetData(ss.getSheetByName('settings'));
  const settings = {};
  settingsData.forEach(row => {
    if (row.key) settings[row.key] = row.value;
  });
  
  return handleResponse({ members, transactions, settings });
}

/**
 * เพิ่มสมาชิกใหม่
 */
function addMember(member) {
  const sheet = SpreadsheetApp.openById('1dlbx0AmyA8ILZxXTi1OcN40uL6Om4RP0JD77ZPUVhBo').getSheetByName('members');
  const headers = getSheetHeaders(sheet);
  
  const newRow = headers.map(header => {
    if (header === 'created_at' || header === 'updated_at') return new Date().toISOString();
    return member[header] || '';
  });
  
  sheet.appendRow(newRow);
  return handleResponse({ success: true, member });
}

/**
 * แก้ไขข้อมูลสมาชิก
 */
function updateMember(id, memberData) {
  const sheet = SpreadsheetApp.openById('1dlbx0AmyA8ILZxXTi1OcN40uL6Om4RP0JD77ZPUVhBo').getSheetByName('members');
  const data = sheet.getDataRange().getValues();
  const headers = data[0];
  const idIndex = headers.indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      memberData.updated_at = new Date().toISOString();
      headers.forEach((header, colIndex) => {
        if (memberData[header] !== undefined) {
          sheet.getRange(i + 1, colIndex + 1).setValue(memberData[header]);
        }
      });
      return handleResponse({ success: true });
    }
  }
  throw new Error('Member not found');
}

/**
 * ลบสมาชิก
 */
function deleteMember(id) {
  const sheet = SpreadsheetApp.openById('1dlbx0AmyA8ILZxXTi1OcN40uL6Om4RP0JD77ZPUVhBo').getSheetByName('members');
  const data = sheet.getDataRange().getValues();
  const idIndex = data[0].indexOf('id');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === id) {
      sheet.deleteRow(i + 1);
      return handleResponse({ success: true });
    }
  }
  throw new Error('Member not found');
}

/**
 * บันทึกรายการฝาก-ถอน
 */
function addTransaction(tx) {
  const ss = SpreadsheetApp.openById('1dlbx0AmyA8ILZxXTi1OcN40uL6Om4RP0JD77ZPUVhBo');
  const txSheet = ss.getSheetByName('transactions');
  const txHeaders = getSheetHeaders(txSheet);
  
  // 1. เพิ่มรายการลงชีต transactions
  const newRow = txHeaders.map(header => {
    if (header === 'created_at') return new Date().toISOString();
    return tx[header] || '';
  });
  txSheet.appendRow(newRow);
  
  // 2. อัปเดตยอดเงินคงเหลือในชีต members ทันที
  updateMemberBalance(ss, tx.member_id, tx.balance);
  
  return handleResponse({ success: true, transaction: tx });
}

function updateMemberBalance(ss, memberId, newBalance) {
  const sheet = ss.getSheetByName('members');
  const data = sheet.getDataRange().getValues();
  const idIndex = data[0].indexOf('id');
  const balanceIndex = data[0].indexOf('balance');
  const updateIndex = data[0].indexOf('updated_at');
  
  for (let i = 1; i < data.length; i++) {
    if (data[i][idIndex] === memberId) {
      sheet.getRange(i + 1, balanceIndex + 1).setValue(newBalance);
      if (updateIndex >= 0) {
        sheet.getRange(i + 1, updateIndex + 1).setValue(new Date().toISOString());
      }
      break;
    }
  }
}

// ---------------------------------------------------------
// ฟังก์ชันจัดการ Google Drive
// ---------------------------------------------------------

/**
 * อัปโหลดรูปภาพโปรไฟล์ (รับเป็น Base64)
 */
function uploadAvatar(data) {
  const root = DriveApp.getFolderById(ROOT_FOLDER_ID);
  
  // หาโฟลเดอร์ members
  const folders = root.getFoldersByName('members');
  let membersFolder;
  if (folders.hasNext()) membersFolder = folders.next();
  else membersFolder = root.createFolder('members');
  
  // หาโฟลเดอร์ย่อยของสมาชิก
  const memberFolderName = `${data.memberId}_${data.name}`;
  const memberFolders = membersFolder.getFoldersByName(memberFolderName);
  let targetFolder;
  if (memberFolders.hasNext()) targetFolder = memberFolders.next();
  else targetFolder = membersFolder.createFolder(memberFolderName);
  
  const blob = Utilities.newBlob(Utilities.base64Decode(data.base64), 'image/jpeg', 'profile.jpg');
  
  // ลบไฟล์เก่า
  const existingFiles = targetFolder.getFilesByName('profile.jpg');
  while (existingFiles.hasNext()) existingFiles.next().setTrashed(true);
  
  const file = targetFolder.createFile(blob);
  file.setSharing(DriveApp.Access.ANYONE_WITH_LINK, DriveApp.Permission.VIEW);
  
  const url = `https://drive.google.com/uc?id=${file.getId()}`;
  
  // บันทึก URL ลงฐานข้อมูล Sheets
  updateMember(data.memberId, { avatar_url: url, drive_folder_id: targetFolder.getId() });
  
  return handleResponse({ url: url });
}

// ---------------------------------------------------------
// Helper Functions
// ---------------------------------------------------------

function handleResponse(response, statusCode = 200) {
  return ContentService.createTextOutput(JSON.stringify(response))
    .setMimeType(ContentService.MimeType.JSON);
}

function getSheetHeaders(sheet) {
  if (sheet.getLastRow() === 0) return [];
  return sheet.getRange(1, 1, 1, sheet.getLastColumn()).getValues()[0];
}

function getSheetData(sheet) {
  const lastRow = sheet.getLastRow();
  const lastCol = sheet.getLastColumn();
  if (lastRow < 2) return [];
  
  const data = sheet.getRange(1, 1, lastRow, lastCol).getValues();
  const headers = data[0];
  const result = [];
  
  for (let i = 1; i < data.length; i++) {
    const rowObj = {};
    headers.forEach((header, index) => {
      if (header) rowObj[header] = data[i][index];
    });
    result.push(rowObj);
  }
  return result;
}

function setupSheetsIfNotExist(ss) {
  const defaultSheets = {
    'members': ['id', 'student_id', 'name', 'classroom', 'phone', 'balance', 'avatar_url', 'drive_folder_id', 'created_at', 'updated_at'],
    'transactions': ['id', 'member_id', 'date', 'type', 'amount', 'balance', 'note', 'recorded_by', 'created_at'],
    'settings': ['key', 'value']
  };
  
  for (const [sheetName, headers] of Object.entries(defaultSheets)) {
    let sheet = ss.getSheetByName(sheetName);
    if (!sheet) {
      sheet = ss.insertSheet(sheetName);
      sheet.appendRow(headers);
    }
  }
}
