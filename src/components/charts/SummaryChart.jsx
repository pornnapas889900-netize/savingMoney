import { Doughnut } from 'react-chartjs-2'
import { useApp } from '../../context/AppContext'

export default function SummaryChart() {
  const { transactions } = useApp()

  const totalDeposit  = transactions.filter(t => t.type === 'deposit').reduce((s, t) => s + Number(t.amount), 0)
  const totalWithdraw = transactions.filter(t => t.type === 'withdraw').reduce((s, t) => s + Number(t.amount), 0)

  const data = {
    labels: ['ฝากเงิน', 'ถอนเงิน'],
    datasets: [{
      data: [totalDeposit, totalWithdraw],
      backgroundColor: ['rgba(16, 185, 129, 0.85)', 'rgba(239, 68, 68, 0.75)'],
      hoverBackgroundColor: ['rgba(16, 185, 129, 1)', 'rgba(239, 68, 68, 1)'],
      borderWidth: 0,
      hoverOffset: 6,
    }],
  }

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '70%',
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          pointStyle: 'circle',
          padding: 16,
          font: { family: 'Sarabun', size: 12 },
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ฿${ctx.raw.toLocaleString('th-TH')}`,
        },
        titleFont: { family: 'Sarabun' },
        bodyFont: { family: 'Sarabun' },
        cornerRadius: 12,
        padding: 12,
      },
    },
  }

  return (
    <div className="relative">
      <Doughnut data={data} options={options} />
      {/* Center text */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none" style={{ paddingBottom: '40px' }}>
        <div className="text-center">
          <p className="text-xs text-slate-400 dark:text-slate-500">ยอดสะสม</p>
          <p className="text-base font-bold text-slate-700 dark:text-slate-200">
            ฿{(totalDeposit - totalWithdraw).toLocaleString('th-TH')}
          </p>
        </div>
      </div>
    </div>
  )
}
