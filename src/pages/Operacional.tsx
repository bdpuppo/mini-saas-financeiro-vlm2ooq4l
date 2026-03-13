import { useMemo } from 'react'
import useFinanceStore from '@/stores/useFinanceStore'
import { ActivityPanel } from '@/components/operacional/ActivityPanel'
import { FinancePanel } from '@/components/operacional/FinancePanel'
import { formatCurrency, formatDate } from '@/utils/formatters'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { CalendarIcon } from 'lucide-react'

export default function Operacional() {
  const { transactions, activities, currentDate, setCurrentDate } = useFinanceStore()

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

  const sumIn = todaysReceivables.reduce((a, b) => a + Number(b.amount), 0)
  const sumOut = todaysPayables.reduce((a, b) => a + Number(b.amount), 0)

  const weekDays = ['Domingo', 'Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado']
  const weekDayName = weekDays[new Date(currentDate + 'T00:00:00').getDay()]

  return (
    <div className="max-w-6xl mx-auto space-y-4">
      {/* Headers Badge Row */}
      <div className="flex flex-col sm:flex-row gap-2 h-auto sm:h-14">
        <div className="flex bg-slate-800 text-white border border-slate-900 w-full sm:w-1/4 rounded-sm overflow-hidden shadow-sm">
          <div className="w-1/3 flex items-center justify-center font-bold text-sm border-r border-slate-700">
            Data
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="w-2/3 flex items-center justify-center font-bold text-lg bg-yellow-500 text-slate-900 hover:bg-yellow-400 transition-colors">
                {formatDate(currentDate)}
                <CalendarIcon className="ml-2 h-4 w-4 opacity-70" />
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="center">
              <Calendar
                mode="single"
                selected={new Date(currentDate + 'T00:00:00')}
                onSelect={(d) => d && setCurrentDate(d.toISOString().split('T')[0])}
              />
            </PopoverContent>
          </Popover>
        </div>

        <div className="flex bg-slate-800 text-white border border-slate-900 w-full sm:w-1/4 rounded-sm overflow-hidden shadow-sm">
          <div className="w-1/2 flex items-center justify-center font-bold text-sm border-r border-slate-700">
            Semana
          </div>
          <div className="w-1/2 flex items-center justify-center font-bold text-sm bg-yellow-500 text-slate-900">
            {weekDayName}
          </div>
        </div>

        <div className="flex flex-col bg-white border border-slate-800 w-full sm:w-1/2 overflow-hidden rounded-sm shadow-sm">
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

      <div className="grid grid-cols-1 xl:grid-cols-2 gap-4">
        <ActivityPanel activities={todaysActivities} date={currentDate} />
        <FinancePanel receivables={todaysReceivables} payables={todaysPayables} />
      </div>
    </div>
  )
}
