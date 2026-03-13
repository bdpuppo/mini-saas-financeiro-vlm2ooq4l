import { useMemo } from 'react'
import useFinanceStore from '@/stores/useFinanceStore'
import { ActivityPanel } from '@/components/operacional/ActivityPanel'
import { FinancePanel } from '@/components/operacional/FinancePanel'
import { formatCurrency } from '@/utils/formatters'

export default function Operacional() {
  const { transactions, activities, currentDate } = useFinanceStore()

  const todaysActivities = useMemo(
    () => activities.filter((a) => a.date === currentDate),
    [activities, currentDate],
  )
  const todaysReceivables = useMemo(
    () => transactions.filter((t) => t.date === currentDate && t.type === 'entrada'),
    [transactions, currentDate],
  )
  const todaysPayables = useMemo(
    () => transactions.filter((t) => t.date === currentDate && t.type === 'saida'),
    [transactions, currentDate],
  )

  const sumIn = todaysReceivables.reduce((a, b) => a + b.amount, 0)
  const sumOut = todaysPayables.reduce((a, b) => a + b.amount, 0)

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Headers Badge Row - Replicating spreadsheet aesthetic */}
      <div className="flex flex-col sm:flex-row gap-2 h-auto sm:h-14">
        <div className="flex bg-slate-800 text-white border border-slate-900 w-full sm:w-1/4">
          <div className="w-1/3 flex items-center justify-center font-bold text-sm border-r border-slate-700">
            Data
          </div>
          <div className="w-2/3 flex items-center justify-center font-bold text-lg bg-yellow-500 text-slate-900 border-r border-slate-900">
            11/03/26
          </div>
        </div>

        <div className="flex bg-slate-800 text-white border border-slate-900 w-full sm:w-1/4">
          <div className="w-1/2 flex items-center justify-center font-bold text-sm border-r border-slate-700">
            Semana
          </div>
          <div className="w-1/2 flex items-center justify-center font-bold text-sm bg-yellow-500 text-slate-900 border-r border-slate-900">
            Quarta
          </div>
        </div>

        <div className="flex flex-col bg-white border border-slate-800 w-full sm:w-1/2 overflow-hidden">
          <div className="flex h-1/2 bg-slate-100 border-b border-slate-300">
            <div className="w-1/2 flex items-center justify-center text-xs font-bold border-r border-slate-300">
              Entrada
            </div>
            <div className="w-1/2 flex items-center justify-center text-xs font-bold">Saída</div>
          </div>
          <div className="flex h-1/2">
            <div className="w-1/2 flex items-center justify-center text-sm font-mono font-bold text-green-700 border-r border-slate-300 bg-green-50">
              {formatCurrency(sumIn)}
            </div>
            <div className="w-1/2 flex items-center justify-center text-sm font-mono font-bold text-red-700 bg-red-50">
              {formatCurrency(sumOut)}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ActivityPanel activities={todaysActivities} date={currentDate} />
        <FinancePanel receivables={todaysReceivables} payables={todaysPayables} />
      </div>
    </div>
  )
}
