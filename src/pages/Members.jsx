import { useState, useMemo } from 'react'
import {
  PlusIcon, MagnifyingGlassIcon, PencilSquareIcon, TrashIcon,
  PhoneIcon, AcademicCapIcon, BanknotesIcon
} from '@heroicons/react/24/outline'
import { useApp } from '../context/AppContext'
import { useToast } from '../components/ui/Toast'
import Modal, { ConfirmModal } from '../components/ui/Modal'
import Avatar from '../components/ui/Avatar'
import { formatCurrency, generateId } from '../utils/formatters'

const EMPTY_FORM = {
  id: '', student_id: '', name: '', classroom: '', phone: '', balance: 0,
  avatar_url: null, drive_folder_id: null
}

export default function Members() {
  const { members, addMember, updateMember, deleteMember, loading } = useApp()
  const toast = useToast()

  const [search, setSearch] = useState('')
  const [classFilter, setClassFilter] = useState('')
  const [modalOpen, setModalOpen] = useState(false)
  const [editTarget, setEditTarget] = useState(null)
  const [form, setForm] = useState(EMPTY_FORM)
  const [formErrors, setFormErrors] = useState({})
  const [saving, setSaving] = useState(false)
  const [deleteTarget, setDeleteTarget] = useState(null)
  const [deleting, setDeleting] = useState(false)

  // Unique classrooms for filter
  const classrooms = useMemo(() =>
    [...new Set(members.map(m => m.classroom).filter(Boolean))].sort()
  , [members])

  // Filtered members
  const filtered = useMemo(() =>
    members.filter(m => {
      const q = search.toLowerCase()
      const matchSearch = !q || m.name.toLowerCase().includes(q) ||
        m.id.toLowerCase().includes(q) ||
        (m.student_id || '').toLowerCase().includes(q)
      const matchClass = !classFilter || m.classroom === classFilter
      return matchSearch && matchClass
    })
  , [members, search, classFilter])

  // Open add/edit modal
  function openModal(member = null) {
    if (member) {
      setEditTarget(member)
      setForm({ ...member })
    } else {
      setEditTarget(null)
      const nextId = `M${String(members.length + 1).padStart(3, '0')}`
      setForm({ ...EMPTY_FORM, id: nextId })
    }
    setFormErrors({})
    setModalOpen(true)
  }

  function validate() {
    const errs = {}
    if (!form.id.trim())   errs.id   = 'กรุณากรอกรหัสสมาชิก'
    if (!form.name.trim()) errs.name = 'กรุณากรอกชื่อ-นามสกุล'
    if (form.balance < 0)  errs.balance = 'ยอดเงินต้องไม่ติดลบ'
    // Check duplicate ID (only for new member)
    if (!editTarget && members.find(m => m.id === form.id)) {
      errs.id = 'รหัสนี้มีอยู่แล้ว'
    }
    setFormErrors(errs)
    return Object.keys(errs).length === 0
  }

  async function handleSave() {
    if (!validate()) return
    setSaving(true)
    try {
      if (editTarget) {
        await updateMember(editTarget.id, {
          student_id: form.student_id,
          name: form.name,
          classroom: form.classroom,
          phone: form.phone,
          avatar_url: form.avatar_url,
        })
        toast.success('บันทึกข้อมูลสมาชิกเรียบร้อยแล้ว', 'แก้ไขสำเร็จ')
      } else {
        await addMember({
          id: form.id,
          student_id: form.student_id || null,
          name: form.name,
          classroom: form.classroom || null,
          phone: form.phone || null,
          balance: Number(form.balance) || 0,
          avatar_url: null,
          drive_folder_id: null,
        })
        toast.success(`เพิ่มสมาชิก "${form.name}" เรียบร้อยแล้ว`, 'เพิ่มสำเร็จ')
      }
      setModalOpen(false)
    } catch (err) {
      toast.error(err.message || 'เกิดข้อผิดพลาด กรุณาลองใหม่', 'ข้อผิดพลาด')
    } finally {
      setSaving(false)
    }
  }

  async function handleDelete() {
    if (!deleteTarget) return
    setDeleting(true)
    try {
      await deleteMember(deleteTarget.id)
      toast.success(`ลบสมาชิก "${deleteTarget.name}" เรียบร้อยแล้ว`, 'ลบสำเร็จ')
      setDeleteTarget(null)
    } catch (err) {
      toast.error(err.message || 'เกิดข้อผิดพลาด', 'ข้อผิดพลาด')
    } finally {
      setDeleting(false)
    }
  }

  const Field = ({ label, id, error, children }) => (
    <div>
      <label htmlFor={id} className="label">{label}</label>
      {children}
      {error && <p className="text-xs text-danger-500 mt-1">{error}</p>}
    </div>
  )

  return (
    <div className="space-y-4">

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3">
        {/* Search */}
        <div className="relative flex-1">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            id="search-members"
            type="text"
            className="input pl-9"
            placeholder="ค้นหาชื่อ, รหัสสมาชิก, รหัสนักศึกษา..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>

        {/* Classroom Filter */}
        <select
          id="filter-classroom"
          className="input sm:w-48"
          value={classFilter}
          onChange={e => setClassFilter(e.target.value)}
        >
          <option value="">ทุกห้องเรียน</option>
          {classrooms.map(c => <option key={c} value={c}>{c}</option>)}
        </select>

        {/* Add Button */}
        <button id="btn-add-member" className="btn-primary" onClick={() => openModal()}>
          <PlusIcon className="w-4 h-4" />
          เพิ่มสมาชิก
        </button>
      </div>

      {/* Stats bar */}
      <div className="flex items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <span>ทั้งหมด <span className="font-semibold text-slate-700 dark:text-slate-200">{filtered.length}</span> คน</span>
        {classFilter && (
          <button onClick={() => setClassFilter('')} className="text-primary-600 hover:underline text-xs">
            ล้าง filter
          </button>
        )}
      </div>

      {/* Table */}
      <div className="card overflow-hidden">
        <div className="table-wrapper">
          <table className="table">
            <thead>
              <tr>
                <th>สมาชิก</th>
                <th>รหัสนักศึกษา</th>
                <th>ห้องเรียน</th>
                <th>เบอร์โทร</th>
                <th>ยอดเงิน</th>
                <th className="text-right">จัดการ</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array(5).fill(0).map((_, i) => (
                  <tr key={i}>
                    {Array(6).fill(0).map((_, j) => (
                      <td key={j}><div className="shimmer h-5 rounded-md" /></td>
                    ))}
                  </tr>
                ))
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="text-center py-12 text-slate-400">
                    {search || classFilter ? 'ไม่พบสมาชิกที่ค้นหา' : 'ยังไม่มีสมาชิก'}
                  </td>
                </tr>
              ) : (
                filtered.map(m => (
                  <tr key={m.id}>
                    <td>
                      <div className="flex items-center gap-3">
                        <Avatar name={m.name} src={m.avatar_url} size="sm" />
                        <div>
                          <p className="font-medium text-slate-800 dark:text-slate-200 text-sm">{m.name}</p>
                          <p className="text-xs text-slate-400">{m.id}</p>
                        </div>
                      </div>
                    </td>
                    <td className="text-slate-600 dark:text-slate-300">{m.student_id || '-'}</td>
                    <td>
                      {m.classroom
                        ? <span className="badge-primary">{m.classroom}</span>
                        : <span className="text-slate-400">-</span>}
                    </td>
                    <td className="text-slate-600 dark:text-slate-300">
                      {m.phone
                        ? <span className="flex items-center gap-1"><PhoneIcon className="w-3 h-3" />{m.phone}</span>
                        : '-'}
                    </td>
                    <td>
                      <span className="font-semibold text-success-600 dark:text-success-400">
                        {formatCurrency(m.balance)}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          id={`btn-edit-${m.id}`}
                          onClick={() => openModal(m)}
                          className="btn-ghost btn-sm"
                          title="แก้ไข"
                        >
                          <PencilSquareIcon className="w-4 h-4" />
                        </button>
                        <button
                          id={`btn-delete-${m.id}`}
                          onClick={() => setDeleteTarget(m)}
                          className="btn-ghost btn-sm text-danger-500 hover:bg-danger-50 dark:hover:bg-danger-900/20"
                          title="ลบ"
                        >
                          <TrashIcon className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add/Edit Modal */}
      <Modal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editTarget ? 'แก้ไขข้อมูลสมาชิก' : 'เพิ่มสมาชิกใหม่'}
        footer={
          <>
            <button className="btn-outline" onClick={() => setModalOpen(false)} disabled={saving}>ยกเลิก</button>
            <button id="btn-save-member" className="btn-primary" onClick={handleSave} disabled={saving}>
              {saving ? <span className="animate-spin border-2 border-white border-t-transparent rounded-full w-4 h-4 inline-block" /> : 'บันทึก'}
            </button>
          </>
        }
      >
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <Field label="รหัสสมาชิก *" id="field-id" error={formErrors.id}>
              <input
                id="field-id"
                type="text"
                className={`input ${formErrors.id ? 'input-error' : ''}`}
                value={form.id}
                onChange={e => setForm(f => ({ ...f, id: e.target.value }))}
                disabled={!!editTarget}
                placeholder="M001"
              />
            </Field>
            <Field label="รหัสนักศึกษา" id="field-student-id">
              <input
                id="field-student-id"
                type="text"
                className="input"
                value={form.student_id || ''}
                onChange={e => setForm(f => ({ ...f, student_id: e.target.value }))}
                placeholder="650001"
              />
            </Field>
          </div>

          <Field label="ชื่อ-นามสกุล *" id="field-name" error={formErrors.name}>
            <input
              id="field-name"
              type="text"
              className={`input ${formErrors.name ? 'input-error' : ''}`}
              value={form.name}
              onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
              placeholder="สมชาย ใจดี"
            />
          </Field>

          <div className="grid grid-cols-2 gap-4">
            <Field label="ห้องเรียน" id="field-classroom">
              <input
                id="field-classroom"
                type="text"
                className="input"
                value={form.classroom || ''}
                onChange={e => setForm(f => ({ ...f, classroom: e.target.value }))}
                placeholder="ปวช.2/1"
                list="classroom-list"
              />
              <datalist id="classroom-list">
                {classrooms.map(c => <option key={c} value={c} />)}
              </datalist>
            </Field>
            <Field label="เบอร์โทร" id="field-phone">
              <input
                id="field-phone"
                type="tel"
                className="input"
                value={form.phone || ''}
                onChange={e => setForm(f => ({ ...f, phone: e.target.value }))}
                placeholder="08x-xxx-xxxx"
              />
            </Field>
          </div>

          {!editTarget && (
            <Field label="ยอดเงินเริ่มต้น (บาท)" id="field-balance" error={formErrors.balance}>
              <input
                id="field-balance"
                type="number"
                min="0"
                className={`input ${formErrors.balance ? 'input-error' : ''}`}
                value={form.balance}
                onChange={e => setForm(f => ({ ...f, balance: Number(e.target.value) }))}
                placeholder="0"
              />
            </Field>
          )}
        </div>
      </Modal>

      {/* Delete Confirm */}
      <ConfirmModal
        isOpen={!!deleteTarget}
        onClose={() => setDeleteTarget(null)}
        onConfirm={handleDelete}
        loading={deleting}
        title="ยืนยันการลบสมาชิก"
        message={`คุณต้องการลบ "${deleteTarget?.name}" ออกจากระบบ? การดำเนินการนี้ไม่สามารถย้อนกลับได้`}
        confirmLabel="ลบสมาชิก"
        confirmClass="btn-danger"
      />
    </div>
  )
}
