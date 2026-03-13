import { Activity } from '@/stores/useFinanceStore'
import { getStatusClass } from '@/utils/formatters'

interface ActivityPanelProps {
  activities: Activity[]
  date: string
}

export function ActivityPanel({ activities }: ActivityPanelProps) {
  const statusCounts = activities.reduce(
    (acc, act) => {
      acc[act.status] = (acc[act.status] || 0) + 1
      return acc
    },
    {} as Record<string, number>,
  )

  const total = activities.length

  return (
    <div className="border border-slate-300 bg-white rounded shadow-sm overflow-hidden flex flex-col h-full">
      <div className="bg-slate-800 text-white text-center py-2 text-sm font-bold border-b border-slate-900 flex justify-between px-4">
        <span>Lista de Atividades Dia</span>
        <span>Status</span>
      </div>

      <div className="flex flex-col md:flex-row flex-1">
        <div className="w-full md:w-[200px] shrink-0 border-r border-slate-200 flex flex-col">
          <div className="aspect-square bg-slate-100 relative">
            <img
              src="https://img.usecurling.com/p/250/250?q=bees"
              alt="Tema do dia"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2 space-y-1 text-xs">
            {['Aguardando', 'Andamento', 'Parado', 'OK'].map((status) => {
              const count = statusCounts[status.toLowerCase()] || 0
              const pct = total ? Math.round((count / total) * 100) : 0
              return (
                <div
                  key={status}
                  className={`flex justify-between px-2 py-1 rounded ${getStatusClass(status.toLowerCase())} bg-opacity-40`}
                >
                  <span className="font-medium">{status}</span>
                  <span>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1">
          <table className="w-full text-sm">
            <tbody>
              {activities.map((act, i) => (
                <tr
                  key={act.id}
                  className="border-b border-slate-200 border-dashed last:border-0 hover:bg-slate-50"
                >
                  <td className="p-2 border-r border-slate-200 border-dashed">{act.title}</td>
                  <td
                    className={`p-2 text-center w-[120px] border-b-2 border-white ${getStatusClass(act.status)}`}
                  >
                    {act.status.toUpperCase()}
                  </td>
                </tr>
              ))}
              {Array.from({ length: Math.max(0, 10 - activities.length) }).map((_, i) => (
                <tr key={`empty-${i}`} className="border-b border-slate-200 border-dashed h-9">
                  <td className="p-2 border-r border-slate-200 border-dashed"></td>
                  <td className="p-2"></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="mt-auto border-t border-slate-300">
        <div className="bg-slate-800 text-white text-center py-1.5 text-sm font-bold">
          Observações
        </div>
        <div className="p-3 bg-yellow-50/50 min-h-[100px] text-sm italic text-slate-700">
          <p className="border-b border-slate-300 border-dashed pb-1">
            Cosme tem medico - Não Veio
          </p>
          <div className="h-6 border-b border-slate-300 border-dashed"></div>
          <div className="h-6 border-b border-slate-300 border-dashed"></div>
        </div>
      </div>
    </div>
  )
}
