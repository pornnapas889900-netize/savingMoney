-- 🗄️ Supabase – Database Schema สำหรับระบบ SmartSave
-- คัดลอกคำสั่งด้านล่างนี้ไปรันใน SQL Editor ของ Supabase Dashboard

-- 1. สร้างตาราง members (ข้อมูลสมาชิก)
CREATE TABLE members (
  id           TEXT PRIMARY KEY,        -- รหัสสมาชิก เช่น "M001"
  student_id   TEXT UNIQUE,             -- รหัสนักศึกษา เช่น "650001"
  name         TEXT NOT NULL,           -- ชื่อ-นามสกุล
  classroom    TEXT,                    -- ห้องเรียน เช่น "ปวช.2/1"
  phone        TEXT,                    -- เบอร์โทรศัพท์
  balance      NUMERIC(12,2) DEFAULT 0, -- ยอดเงินคงเหลือ
  avatar_url   TEXT,                    -- URL รูปโปรไฟล์จาก Google Drive
  drive_folder_id TEXT,                 -- ID ของ folder ใน Drive ของสมาชิกนี้
  created_at   TIMESTAMPTZ DEFAULT NOW(),
  updated_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 2. สร้างตาราง transactions (ประวัติการฝาก-ถอน)
CREATE TABLE transactions (
  id           TEXT PRIMARY KEY,        -- รหัสรายการ เช่น "TRX001"
  member_id    TEXT REFERENCES members(id) ON DELETE CASCADE,
  date         DATE NOT NULL,           -- วันที่ทำรายการ
  type         TEXT CHECK (type IN ('deposit','withdraw')), -- ประเภท: ฝาก(deposit) หรือ ถอน(withdraw)
  amount       NUMERIC(12,2) NOT NULL,  -- จำนวนเงิน
  balance      NUMERIC(12,2) NOT NULL,  -- ยอดเงินคงเหลือ ณ ตอนนั้น (หลังทำรายการ)
  note         TEXT,                    -- หมายเหตุเพิ่มเติม
  recorded_by  TEXT,                    -- ชื่อผู้บันทึก/เจ้าหน้าที่
  created_at   TIMESTAMPTZ DEFAULT NOW()
);

-- 3. สร้างตาราง settings (การตั้งค่าระบบ)
CREATE TABLE settings (
  key   TEXT PRIMARY KEY,
  value TEXT
);

-- ==========================================================
-- 🔒 ตั้งค่าความปลอดภัยเบื้องต้น (Optional but Recommended)
-- ปิด Row Level Security (RLS) เพื่อให้ระบบเข้าถึงได้ง่ายในตอนเริ่มต้น
-- แต่หากต้องการความปลอดภัยสูงขึ้น ควรตั้งค่า Policy เพิ่มเติมภายหลัง
-- ==========================================================
ALTER TABLE members ENABLE ROW LEVEL SECURITY;
CREATE POLICY "อนุญาตให้ทุกคนเข้าถึงข้อมูลสมาชิก" ON members FOR ALL USING (true);

ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "อนุญาตให้ทุกคนเข้าถึงประวัติรายการ" ON transactions FOR ALL USING (true);

ALTER TABLE settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "อนุญาตให้ทุกคนเข้าถึงการตั้งค่า" ON settings FOR ALL USING (true);
