import { createContext, useContext, useState, useEffect, useCallback } from 'react'
import { getAllData, addMemberToGas, updateMemberInGas, deleteMemberFromGas, addTransactionToGas } from '../api/gasApi'

const AppContext = createContext(null)

export function AppProvider({ children }) {
  const [members, setMembers] = useState([])
  const [transactions, setTransactions] = useState([])
  const [settings, setSettings] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // โหลดข้อมูลทั้งหมดจาก GAS
  const loadData = useCallback(async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getAllData()
      
      setMembers(data.members || [])
      setTransactions(data.transactions || [])
      setSettings(data.settings || {})
      
    } catch (err) {
      console.error('Error loading data:', err)
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }, [])

  // โหลดครั้งแรก
  useEffect(() => {
    loadData()
  }, [loadData])

  // CRUD Members
  async function addMember(data) {
    await addMemberToGas(data)
    setMembers(prev => [...prev, data])
    return data
  }

  async function updateMember(id, data) {
    await updateMemberInGas(id, data)
    setMembers(prev => prev.map(m => m.id === id ? { ...m, ...data } : m))
    return data
  }

  async function deleteMember(id) {
    await deleteMemberFromGas(id)
    setMembers(prev => prev.filter(m => m.id !== id))
  }

  // CRUD Transactions
  async function addTransaction(data) {
    await addTransactionToGas(data)
    setTransactions(prev => [data, ...prev])
    return data
  }

  // คำนวณ Dashboard stats
  const today = new Date().toISOString().split('T')[0]
  const now = new Date()
  const currentYear = now.getFullYear()
  const currentMonth = now.getMonth()

  const todayDeposits = transactions.filter(t => t.date === today && t.type === 'deposit')
  const todayWithdraws = transactions.filter(t => t.date === today && t.type === 'withdraw')

  const monthlyTx = transactions.filter(t => {
    const d = new Date(t.date)
    return d.getFullYear() === currentYear && d.getMonth() === currentMonth
  })

  const stats = {
    totalMembers: members.length,
    totalBalance: members.reduce((s, m) => s + Number(m.balance || 0), 0),
    todayDepositCount: todayDeposits.length,
    todayWithdrawCount: todayWithdraws.length,
    monthlyDeposit: monthlyTx.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount || 0), 0),
    monthlyWithdraw: monthlyTx.filter(t => t.type === 'withdraw').reduce((s, t) => s + Number(t.amount || 0), 0),
  }

  const value = {
    members, transactions, settings, loading, error, stats,
    loadData, addMember, updateMember, deleteMember, addTransaction,
    setMembers, setTransactions,
  }

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>
}

export function useApp() {
  const ctx = useContext(AppContext)
  if (!ctx) throw new Error('useApp must be used within AppProvider')
  return ctx
}
