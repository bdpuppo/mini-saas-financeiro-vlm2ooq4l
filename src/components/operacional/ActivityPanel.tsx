import { useState, useEffect } from 'react'
import { Activity, ActivityStatus } from '@/stores/useFinanceStore'
import { getStatusClass } from '@/utils/formatters'
import useFinanceStore from '@/stores/useFinanceStore'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { cn } from '@/lib/utils'

interface ActivityPanelProps {
  activities: Activity[]
  date: string
}

function EditableActivityRow({ act }: { act: Activity }) {
  const { updateActivity } = useFinanceStore()
  const [title, setTitle] = useState(act.title)
  const [obs, setObs] = useState(act.notes || '')
  const [status, setStatus] = useState<ActivityStatus>(act.status)

  useEffect(() => {
    setTitle(act.title)
    setObs(act.notes || '')
    setStatus(act.status)
  }, [act.title, act.notes, act.status])

  return (
    <tr className="border-b border-slate-200 border-dashed last:border-0 hover:bg-slate-50 transition-colors">
      <td className="p-0 border-r border-slate-200 border-dashed">
        <div className="flex flex-col">
          <input
            className="w-full bg-transparent px-2 pt-2 pb-0.5 focus:bg-white outline-none font-medium text-slate-800"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            onBlur={() => {
              if (title !== act.title) updateActivity(act.id, { title })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter') {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
            placeholder="Título da atividade"
          />
          <Textarea
            className="w-full bg-transparent px-2 pb-2 pt-0.5 focus:bg-white outline-none border-transparent shadow-none focus-visible:ring-1 focus-visible:ring-slate-300 text-xs text-slate-500 italic resize-y min-h-[40px] rounded-none"
            value={obs}
            onChange={(e) => setObs(e.target.value)}
            onBlur={() => {
              if (obs !== (act.notes || '')) updateActivity(act.id, { notes: obs })
            }}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && !e.shiftKey) {
                e.preventDefault()
                e.currentTarget.blur()
              }
            }}
            placeholder="Adicionar observação..."
            rows={1}
          />
        </div>
      </td>
      <td className="p-1 w-[130px] border-b-2 border-white align-middle">
        <Select
          value={status}
          onValueChange={(v) => {
            const newStatus = v as ActivityStatus
            setStatus(newStatus)
            updateActivity(act.id, { status: newStatus })
          }}
        >
          <SelectTrigger className="h-8 text-xs font-semibold w-full focus:ring-0 bg-slate-100 text-slate-800 border-slate-200">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="OK">OK</SelectItem>
            <SelectItem value="Andamento">ANDAMENTO</SelectItem>
            <SelectItem value="Aguardando">AGUARDANDO</SelectItem>
            <SelectItem value="Parado">PARADO</SelectItem>
          </SelectContent>
        </Select>
      </td>
    </tr>
  )
}

export function ActivityPanel({ activities }: ActivityPanelProps) {
  const statusCounts = activities.reduce(
    (acc, act) => {
      const key = act.status.toLowerCase()
      acc[key] = (acc[key] || 0) + 1
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
              src="https://img.usecurling.com/p/250/250?q=workspace&color=blue"
              alt="Tema"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="p-2 space-y-1 text-xs bg-slate-50 flex-1">
            {['Aguardando', 'Andamento', 'Parado', 'OK'].map((status) => {
              const count = statusCounts[status.toLowerCase()] || 0
              const pct = total ? Math.round((count / total) * 100) : 0
              return (
                <div
                  key={status}
                  className={cn(
                    'flex justify-between px-2 py-1.5 rounded',
                    getStatusClass(status),
                    'bg-opacity-40',
                  )}
                >
                  <span className="font-medium">{status}</span>
                  <span>{pct}%</span>
                </div>
              )
            })}
          </div>
        </div>

        <div className="flex-1 flex flex-col min-h-[300px]">
          <table className="w-full text-sm flex-1">
            <tbody>
              {activities.map((act) => (
                <EditableActivityRow key={act.id} act={act} />
              ))}
              {activities.length === 0 && (
                <tr>
                  <td colSpan={2} className="p-8 text-center text-slate-400 italic">
                    Nenhuma atividade registrada para hoje.
                  </td>
                </tr>
              )}
            </tbody>
          </table>

          <div className="mt-auto border-t border-slate-300">
            <div className="bg-slate-800 text-white text-center py-1.5 text-sm font-bold">
              Resumo de Observações
            </div>
            <div className="p-3 bg-yellow-50/50 min-h-[80px] text-sm italic text-slate-700 space-y-1.5">
              {activities
                .filter((a) => a.notes)
                .map((a) => (
                  <p key={a.id} className="border-b border-slate-300 border-dashed pb-1.5">
                    <span className="font-semibold">{a.title}:</span> {a.notes}
                  </p>
                ))}
              {activities.filter((a) => a.notes).length === 0 && (
                <p className="text-slate-400 text-center py-2">Sem observações adicionais hoje.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
