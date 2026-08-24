/**
 * ข้อมูลตัวอย่างสำหรับ seed ลง Supabase ครั้งแรก
 */
export const SEED_MEMBERS = [
  {
    id: 'M001',
    student_id: '650001',
    name: 'สมชาย ใจดี',
    classroom: 'ปวช.2/1',
    phone: '0812345678',
    balance: 3500,
    avatar_url: null,
    drive_folder_id: null,
  },
  {
    id: 'M002',
    student_id: '650002',
    name: 'สมหญิง ดีมาก',
    classroom: 'ปวช.2/1',
    phone: '0823456789',
    balance: 2800,
    avatar_url: null,
    drive_folder_id: null,
  },
  {
    id: 'M003',
    student_id: '650003',
    name: 'ธนพล อินทร์แก้ว',
    classroom: 'ปวช.2/2',
    phone: '0834567890',
    balance: 5200,
    avatar_url: null,
    drive_folder_id: null,
  },
  {
    id: 'M004',
    student_id: '650004',
    name: 'กิตติพงษ์ แสนดี',
    classroom: 'ปวส.1/1',
    phone: '0845678901',
    balance: 1500,
    avatar_url: null,
    drive_folder_id: null,
  },
  {
    id: 'M005',
    student_id: '650005',
    name: 'นฤมล คำดี',
    classroom: 'ปวส.1/1',
    phone: '0856789012',
    balance: 4100,
    avatar_url: null,
    drive_folder_id: null,
  },
]

export const SEED_TRANSACTIONS = [
  { id: 'TRX001', member_id: 'M001', date: '2026-06-01', type: 'deposit',  amount: 1000, balance: 1000, note: 'ฝากครั้งแรก',      recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX002', member_id: 'M002', date: '2026-06-01', type: 'deposit',  amount: 800,  balance: 800,  note: 'ฝากครั้งแรก',      recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX003', member_id: 'M003', date: '2026-06-02', type: 'deposit',  amount: 2000, balance: 2000, note: 'ฝากออมทรัพย์',     recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX004', member_id: 'M004', date: '2026-06-05', type: 'deposit',  amount: 500,  balance: 500,  note: 'ฝากรายสัปดาห์',   recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX005', member_id: 'M005', date: '2026-06-05', type: 'deposit',  amount: 1500, balance: 1500, note: 'ฝากประจำเดือน',    recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX006', member_id: 'M001', date: '2026-06-10', type: 'deposit',  amount: 500,  balance: 1500, note: 'ฝากเพิ่ม',         recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX007', member_id: 'M003', date: '2026-06-15', type: 'deposit',  amount: 1000, balance: 3000, note: 'ฝากออมทรัพย์',     recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX008', member_id: 'M002', date: '2026-06-20', type: 'withdraw', amount: 300,  balance: 500,  note: 'ถอนใช้จ่าย',       recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX009', member_id: 'M001', date: '2026-07-01', type: 'deposit',  amount: 1000, balance: 2500, note: 'ฝากประจำเดือน',    recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX010', member_id: 'M002', date: '2026-07-01', type: 'deposit',  amount: 700,  balance: 1200, note: 'ฝากประจำเดือน',    recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX011', member_id: 'M003', date: '2026-07-03', type: 'deposit',  amount: 1200, balance: 4200, note: 'ฝากออมทรัพย์',     recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX012', member_id: 'M004', date: '2026-07-05', type: 'deposit',  amount: 500,  balance: 1000, note: 'ฝากรายสัปดาห์',   recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX013', member_id: 'M005', date: '2026-07-06', type: 'deposit',  amount: 1000, balance: 2500, note: 'ฝากประจำเดือน',    recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX014', member_id: 'M001', date: '2026-07-06', type: 'deposit',  amount: 1000, balance: 3500, note: 'ฝากเพิ่มเติม',     recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX015', member_id: 'M003', date: '2026-07-06', type: 'deposit',  amount: 1000, balance: 5200, note: 'ฝากออมทรัพย์',     recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX016', member_id: 'M005', date: '2026-07-06', type: 'withdraw', amount: 400,  balance: 4100, note: 'ถอนค่าเรียน',      recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX017', member_id: 'M002', date: '2026-07-06', type: 'deposit',  amount: 900,  balance: 2800, note: 'ฝากออมเพิ่ม',      recorded_by: 'เจ้าหน้าที่' },
  { id: 'TRX018', member_id: 'M004', date: '2026-08-01', type: 'deposit',  amount: 500,  balance: 1500, note: 'ฝากประจำเดือน',    recorded_by: 'เจ้าหน้าที่' },
]

export const SEED_SETTINGS = [
  { key: 'school_name',    value: 'วิทยาลัยเทคนิค SmartSave' },
  { key: 'app_version',   value: '1.0.0' },
  { key: 'seeded',        value: 'true' },
]
