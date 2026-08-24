import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, LineElement, PointElement, Filler
} from 'chart.js'
import { Bar } from 'react-chartjs-2'
import { useApp } from '../../context/AppContext'
import { getThaiMonth } from '../../utils/formatters'

ChartJS.register(
  CategoryScale, LinearScale, BarElement,
  Title, Tooltip, Legend, ArcElement, LineElement, PointElement, Filler
)

export default function MonthlyChart() {
  const { transactions } = useApp()

  // สร้างข้อมูล 6 เดือนย้อนหลัง
  const months = []
  const now = new Date()
  for (let i = 5; i >= 0; i--) {
    const d = new Date(now.getFullYear(), now.getMonth() - i, 1)
    months.push({ year: d.getFullYear(), month: d.getMonth() })
  }

  const labels = months.map(m => `${getThaiMonth(m.month)} ${String(m.year).slice(2)}`)
  const deposits = months.map(m =>
    transactions
      .filter(t => {
        const d = new Date(t.date)
        return t.type === 'deposit' && d.getFullYear() === m.year && d.getMonth() === m.month
      })
      .reduce((s, t) => s + Number(t.amount), 0)
  )
  const withdraws = months.map(m =>
    transactions
      .filter(t => {
        const d = new Date(t.date)
        return t.type === 'withdraw' && d.getFullYear() === m.year && d.getMonth() === m.month
      })
      .reduce((s, t) => s + Number(t.amount), 0)
  )

  const data = {
    labels,
    datasets: [
      {
        label: 'ฝากเงิน',
        data: deposits,
        backgroundColor: 'rgba(16, 185, 129, 0.85)',
        borderRadius: 8,
        borderSkipped: false,
      },
      {
        label: 'ถอนเงิน',
        data: withdraws,
        backgroundColor: 'rgba(239, 68, 68, 0.75)',
        borderRadius: 8,
        borderSkipped: false,
      },
    ],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    interaction: { mode: 'index', intersect: false },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { family: 'Sarabun', size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.dataset.label}: ฿${ctx.raw.toLocaleString('th-TH')}`,
        },
        titleFont: { family: 'Sarabun' },
        bodyFont: { family: 'Sarabun' },
        cornerRadius: 12,
        padding: 12,
      },
    },
    scales: {
      x: {
        grid: { display: false },
        ticks: { font: { family: 'Sarabun', size: 11 } },
      },
      y: {
        grid: { color: 'rgba(148, 163, 184, 0.15)' },
        ticks: {
          font: { family: 'Sarabun', size: 11 },
          callback: (v) => `฿${(v / 1000).toFixed(0)}K`,
        },
        beginAtZero: true,
      },
    },
  }

  return <Bar data={data} options={options} />
}
